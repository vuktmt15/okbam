import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { ref } = req.query;

    if (!ref) {
      return res.status(400).json({ message: 'Missing ref parameter' });
    }

    // Forward request to external API
    const apiUrl = `http://159.223.91.231:8866/api/customers/last-check-in-date?ref=${ref}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Forward the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Last check-in date API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
