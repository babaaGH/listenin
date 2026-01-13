import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// List available models for diagnostics
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // List all available models
    const models = await genAI.listModels();

    const modelList = models.map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
    }));

    return res.status(200).json({
      success: true,
      count: modelList.length,
      models: modelList
    });

  } catch (error: any) {
    console.error('List models error:', error);
    return res.status(500).json({
      error: 'Failed to list models',
      details: error.message
    });
  }
}
