import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://159.223.91.231:8866/api/auth/list-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Forward the response from the API server
    res.status(response.status).json(data);
  } catch (error) {
    console.error('User list proxy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
