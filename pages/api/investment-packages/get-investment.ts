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
    const response = await fetch(`http://159.223.91.231:8866/api/investment-packages/get-investment?referrerId=${encodeURIComponent(String(referrerId))}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Get investment proxy error:', error);
    res.status(500).json({ 
      headers: {},
      body: [],
      statusCode: "ERROR",
      statusCodeValue: 500
    });
  }
}
