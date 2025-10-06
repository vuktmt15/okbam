import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { referrerId, regisDone } = req.query;
  
  if (!referrerId) {
    return res.status(400).json({ message: 'Missing referrerId' });
  }
  
  if (!regisDone) {
    return res.status(400).json({ message: 'Missing regisDone' });
  }

  try {
    const response = await fetch(`http://159.223.91.231:8866/api/investment-history/done-regis-dragon?referrerId=${encodeURIComponent(String(referrerId))}&regisDone=${encodeURIComponent(String(regisDone))}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Done regis dragon proxy error:', error);
    res.status(500).json({ 
      statusCode: 'ERROR',
      message: 'Failed to complete dragon registration',
      error: error.message 
    });
  }
}
