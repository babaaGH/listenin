import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

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

// Transcription API endpoint - handles audio streaming to Gemini
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // CORS - only allow your domain
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

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests (after OPTIONS check)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ip = Array.isArray(clientIp) ? clientIp[0] : clientIp;

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Server configuration error. API key not found.'
      });
    }

    const { audioData, isFirst } = req.body;

    // Validate audio data type
    if (typeof audioData !== 'string') {
      return res.status(400).json({ error: 'Invalid audio data format' });
    }

    // Handle connection test (empty audio data)
    if (!audioData || audioData.length === 0) {
      return res.status(200).json({
        success: true,
        transcript: '',
        message: 'Connection test successful'
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = isFirst
      ? 'Transcribe this audio in real-time. Only output the spoken words, no formatting or explanations:'
      : 'Continue transcribing:';

    // Generate content
    const result = await model.generateContentStream([
      {
        inlineData: {
          mimeType: 'audio/pcm',
          data: audioData,
        },
      },
      { text: prompt },
    ]);

    // Stream response back to client
    let transcriptText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        transcriptText += chunkText;
      }
    }

    return res.status(200).json({
      success: true,
      transcript: transcriptText
    });

  } catch (error: any) {
    console.error('Transcription error:', error);

    // Handle specific error types
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({
        error: 'API key configuration error'
      });
    }

    if (error.message?.includes('quota')) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'Transcription failed. Please try again.'
    });
  }
}
