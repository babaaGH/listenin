import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting setup
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // 30 requests per minute for chat
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://listenin.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean);

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again in a minute.',
    });
  }

  try {
    const { question, transcript, summaryId } = req.body;

    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    if (question.length > 1000) {
      return res.status(400).json({ error: 'Question too long (max 1000 characters)' });
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        message: 'Server configuration error',
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-002', // Using versioned model name for stability
    });

    // Create context-aware prompt
    const prompt = `You are an intelligent meeting assistant helping to answer questions about a meeting transcript.

MEETING TRANSCRIPT:
${transcript}

USER QUESTION:
${question}

INSTRUCTIONS:
- Answer the user's question based ONLY on the information in the transcript above
- Be concise and specific in your answers
- If the transcript doesn't contain enough information to answer the question, say so
- Use a helpful, professional tone
- If referring to specific parts of the meeting, mention them
- Don't make assumptions beyond what's in the transcript

ANSWER:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answer = response.text();

    if (!answer || answer.trim().length === 0) {
      return res.status(500).json({
        error: 'Empty response from AI',
        message: 'Failed to generate answer',
      });
    }

    return res.status(200).json({
      success: true,
      answer: answer.trim(),
      summaryId,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    // Handle specific Gemini API errors
    if (error.message?.includes('quota')) {
      return res.status(429).json({
        error: 'API quota exceeded',
        message: 'The service is temporarily at capacity. Please try again in a few minutes.',
      });
    }

    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: 'Invalid API key',
        message: 'Server configuration error',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process your question. Please try again.',
    });
  }
}
