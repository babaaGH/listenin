import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 summary requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

// JSON Schema for structured output
const summarySchema = {
  type: SchemaType.OBJECT,
  properties: {
    overview: {
      type: SchemaType.STRING,
      description: "2-3 sentence executive summary of the meeting"
    },
    chapters: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          timestamp: {
            type: SchemaType.STRING,
            description: "Timestamp in MM:SS format"
          },
          title: {
            type: SchemaType.STRING,
            description: "Chapter title"
          },
          summary: {
            type: SchemaType.STRING,
            description: "Brief description of this segment"
          }
        },
        required: ["timestamp", "title", "summary"]
      }
    },
    highlights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          quote: {
            type: SchemaType.STRING,
            description: "Exact quote from the meeting"
          },
          speaker: {
            type: SchemaType.STRING,
            description: "Speaker's name or 'Unknown'"
          },
          timestamp: {
            type: SchemaType.STRING,
            description: "Timestamp in MM:SS format"
          },
          importance: {
            type: SchemaType.STRING,
            enum: ["high", "medium", "low"],
            description: "Importance level"
          }
        },
        required: ["quote", "speaker", "timestamp", "importance"]
      }
    },
    actionItems: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          task: {
            type: SchemaType.STRING,
            description: "Clear action item description"
          },
          assignee: {
            type: SchemaType.STRING,
            description: "Person responsible or 'Unassigned'"
          },
          priority: {
            type: SchemaType.STRING,
            enum: ["high", "medium", "low"],
            description: "Priority level"
          },
          dueDate: {
            type: SchemaType.STRING,
            nullable: true,
            description: "Due date if mentioned, otherwise null"
          }
        },
        required: ["task", "assignee", "priority", "dueDate"]
      }
    },
    participants: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING
      },
      description: "List of participant names identified in the meeting"
    }
  },
  required: ["overview", "chapters", "highlights", "actionItems", "participants"]
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://listeninc.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = Array.isArray(clientIp) ? clientIp[0] : clientIp;

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Maximum 10 summaries per hour.'
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Server configuration error. API key not found.'
      });
    }

    const { transcript, duration } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Invalid transcript data' });
    }

    if (transcript.length < 50) {
      return res.status(400).json({
        error: 'Transcript too short. Need at least 50 characters for meaningful summary.'
      });
    }

    // Initialize Gemini Pro
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: summarySchema,
      }
    });

    const prompt = `Analyze this meeting transcript and generate a comprehensive structured summary.

TRANSCRIPT:
${transcript}

DURATION: ${duration || 'Unknown'}

INSTRUCTIONS:
1. Provide a clear 2-3 sentence executive overview
2. Break the meeting into logical chapters with timestamps (estimate based on content flow)
3. Extract the most important highlights with quotes
4. Identify all action items mentioned
5. List all participants mentioned by name
6. Use the exact JSON schema provided
7. Be thorough but concise
8. If information is not available, use appropriate defaults (e.g., "Unknown" for speakers)

Generate the structured summary now:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summaryText = response.text();

    // Parse JSON response
    const summary = JSON.parse(summaryText);

    return res.status(200).json({
      success: true,
      summary: summary
    });

  } catch (error: any) {
    console.error('Summary generation error:', error);

    if (error.message?.includes('quota')) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later.'
      });
    }

    if (error.message?.includes('SAFETY')) {
      return res.status(400).json({
        error: 'Content filtered by safety settings. Please review transcript.'
      });
    }

    return res.status(500).json({
      error: 'Failed to generate summary. Please try again.'
    });
  }
}
