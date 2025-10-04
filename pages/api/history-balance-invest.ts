import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { ref } = req.query;

    if (!ref) {
      return res.status(400).json({ message: 'Missing ref parameter' });
    }

    const backendUrl = `http://159.223.91.231:8866/api/customers/history-balance-invest?ref=${encodeURIComponent(String(ref))}`;
    const backendRes = await fetch(backendUrl);

    if (!backendRes.ok) {
      const text = await backendRes.text();
      return res.status(backendRes.status).json({ 
        statusCode: 'ERROR', 
        message: text || 'Failed to fetch commission history' 
      });
    }

    const data = await backendRes.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Commission history proxy error:', error);
    return res.status(500).json({ 
      statusCode: 'ERROR', 
      message: 'Internal server error' 
    });
  }
}
