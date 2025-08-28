import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://159.223.91.231:8866/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    // Forward the response from the API server
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Login proxy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
