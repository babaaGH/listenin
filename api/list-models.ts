import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Make direct API call to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: 'Failed to fetch models from Google API',
        details: errorData.error?.message || response.statusText,
        status: response.status
      });
    }

    const data = await response.json();

    const modelList = data.models?.map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
    })) || [];

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
