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

    const { transcript, duration, framework = 'general' } = req.body;

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
        responseSchema: summarySchema as any,
      }
    });

    // Framework-specific instructions
    const frameworkInstructions: Record<string, string> = {
      sales: `SALES CALL ANALYSIS - Focus on deal progression and buyer engagement:

EXTRACT SPECIFICALLY:
1. Budget & Timeline:
   - Budget discussed (ranges, constraints, approval process)
   - Timeline for decision and implementation
   - Budget authority and approval requirements

2. Objections & Concerns:
   - Specific objections raised by prospect
   - Underlying concerns or hesitations
   - How objections were addressed
   - Unresolved concerns requiring follow-up

3. Competition:
   - Competitors mentioned by name
   - Competitive advantages/disadvantages discussed
   - Incumbent solutions or alternatives being considered

4. Deal Health Signals:
   - Positive signals: excitement, urgency, engagement level
   - Risk signals: hesitation, delays, lack of engagement
   - Champion identification: who is advocating for your solution
   - Decision-maker involvement and buy-in

5. Next Steps & Commitments:
   - Specific commitments made by prospect
   - Agreed-upon next steps with dates
   - Who will do what by when

CHAPTERS: Structure by call flow (intro → discovery → presentation → objections → next steps)

HIGHLIGHTS: Quote exact objections, commitments, and buying signals with importance based on deal impact

ACTION ITEMS: Focus on follow-up materials, proposal deadlines, decision-maker engagement, objection handling`,

      'one-on-one': `1:1 MEETING ANALYSIS - Focus on personal development and feedback:

EXTRACT SPECIFICALLY:
1. Career Goals & Aspirations:
   - Short-term goals (3-6 months)
   - Long-term career aspirations
   - Skills they want to develop
   - Interests and passions discussed

2. Feedback Exchange:
   - Positive feedback given (specific examples)
   - Constructive feedback shared
   - Areas for improvement identified
   - Strengths acknowledged

3. Personal Challenges:
   - Work-related challenges or frustrations
   - Work-life balance concerns
   - Team dynamics issues
   - Resource or support gaps

4. Growth Opportunities:
   - New responsibilities to take on
   - Projects or initiatives to lead
   - Learning resources needed
   - Mentorship or coaching opportunities

5. Support Needs:
   - Resources required
   - Manager support requested
   - Training or tools needed
   - Team collaboration needs

CHAPTERS: Structure by discussion topics (check-in → feedback → goals → challenges → action planning)

HIGHLIGHTS: Quote specific feedback, goals, and personal insights with importance based on career impact

ACTION ITEMS: Focus on development plans, check-in dates, resource needs, skill-building activities`,

      standup: `STANDUP ANALYSIS - Focus on team progress and blockers:

EXTRACT SPECIFICALLY:
1. Work Completed (Yesterday/Since Last Update):
   - Tasks finished with brief descriptions
   - Milestones reached
   - Deliverables completed

2. Current Work (Today/Current Sprint):
   - Tasks in progress
   - What each person is working on
   - Expected completion timeline

3. Blockers & Impediments:
   - Technical blockers (bugs, infrastructure, tooling)
   - Process blockers (approvals, reviews, decisions)
   - Dependency blockers (waiting on others)
   - Resource blockers (access, information, capacity)

4. Dependencies:
   - Work waiting on other team members
   - Cross-team dependencies
   - External dependencies

5. Team Updates & Coordination:
   - Important announcements
   - Schedule changes (PTO, meetings)
   - Help offered or requested

CHAPTERS: Keep brief, structure by person or by theme (completed → in-progress → blockers)

HIGHLIGHTS: Focus on critical blockers, significant progress, and important announcements

ACTION ITEMS: Focus on blockers to resolve, dependencies to unblock, follow-ups needed, help to provide`,

      brainstorm: `BRAINSTORM ANALYSIS - Focus on ideation and creative exploration:

EXTRACT SPECIFICALLY:
1. Ideas Generated (Group by Theme):
   - Core ideas discussed with brief descriptions
   - Variations and iterations explored
   - Related concepts that emerged
   - Theme/category for each idea cluster

2. Divergent Thinking Phase:
   - Wild or unconventional ideas
   - "Yes, and..." building on ideas
   - Different perspectives shared
   - Assumptions challenged

3. Convergent Decisions:
   - Ideas selected for further exploration
   - Ideas combined or merged
   - Ideas rejected with reasoning
   - Criteria used for evaluation

4. Creative Insights:
   - Breakthrough moments or "aha!" insights
   - Novel connections made
   - Reframing of problems
   - Innovative approaches discovered

5. Constraints & Considerations:
   - Technical feasibility concerns
   - Resource limitations discussed
   - Timeline constraints
   - Strategic alignment considerations

CHAPTERS: Structure by idea themes or brainstorm phases (diverge → explore → converge → decide)

HIGHLIGHTS: Quote innovative ideas, breakthrough insights, and key decisions with importance based on potential impact

ACTION ITEMS: Focus on ideas to explore, prototypes to build, research needed, experiments to run, validation steps`,

      general: `GENERAL MEETING ANALYSIS - Standard comprehensive coverage:

EXTRACT COMPREHENSIVELY:
1. Key Discussion Topics:
   - Main subjects covered
   - Important points raised
   - Questions asked and answered

2. Decisions Made:
   - Explicit decisions with rationale
   - Who made the decision
   - Impact of decisions

3. Action Items & Responsibilities:
   - Tasks assigned with owners
   - Deadlines and deliverables
   - Dependencies identified

4. Important Information:
   - Updates shared
   - Announcements made
   - Data or metrics discussed

CHAPTERS: Structure by major discussion topics in chronological order

HIGHLIGHTS: Focus on key decisions, important information, and significant discussion points

ACTION ITEMS: Include all tasks, responsibilities, and follow-ups mentioned with appropriate priorities`
    };

    const frameworkInstruction = frameworkInstructions[framework] || frameworkInstructions.general;

    const prompt = `Analyze this meeting transcript and generate a comprehensive structured summary.

TRANSCRIPT:
${transcript}

DURATION: ${duration || 'Unknown'}

${frameworkInstruction}

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
