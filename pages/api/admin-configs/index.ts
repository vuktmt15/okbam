import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('http://159.223.91.231:8866/api/admin-configs');
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Admin configs proxy error:', error);
    res.status(500).json({ 
      statusCode: 'ERROR',
      message: 'Failed to fetch admin configs',
      error: error.message 
    });
  }
}
