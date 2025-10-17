import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, code } = req.query;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required' });
  }

  try {
    const response = await fetch(`http://159.223.91.231:8866/api/auth/verify-email?email=${encodeURIComponent(email as string)}&code=${encodeURIComponent(code as string)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });

    const data = await response.json();
    
    // Forward the response from the API server
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Verify email proxy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}