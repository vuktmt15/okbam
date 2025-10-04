import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { referrerId, isSpecial } = req.query;
  if (!referrerId) {
    return res.status(400).json({ message: 'Missing referrerId' });
  }

  try {
    const qs = new URLSearchParams();
    qs.set('referrerId', String(referrerId));
    if (typeof isSpecial !== 'undefined') qs.set('isSpecial', String(isSpecial));
    const response = await fetch(`http://159.223.91.231:8866/api/investment-history/check-daily-bam?${qs.toString()}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Check daily BAM proxy error:', error);
    res.status(500).json({ 
      headers: {},
      body: null,
      statusCode: "ERROR",
      statusCodeValue: 500
    });
  }
}
