import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { referrerId } = req.query;
  if (!referrerId) {
    return res.status(400).json({ message: 'Missing referrerId' });
  }

  try {
    const response = await fetch(`http://159.223.91.231:8866/api/investment-history/team-statics?referrerId=${encodeURIComponent(String(referrerId))}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Team statics proxy error:', error);
    res.status(500).json({ 
      statusCode: 'ERROR',
      message: 'Failed to fetch team statics',
      error: error.message 
    });
  }
}
