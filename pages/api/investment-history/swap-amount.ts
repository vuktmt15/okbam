import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { referrerId, amount, typeSwap } = req.query;

    if (!referrerId || !amount || !typeSwap) {
      return res.status(400).json({ message: 'Missing referrerId, amount or typeSwap' });
    }

    const backendUrl = `http://159.223.91.231:8866/api/investment-history/swap-amount?referrerId=${encodeURIComponent(String(referrerId))}&amount=${encodeURIComponent(String(amount))}&typeSwap=${encodeURIComponent(String(typeSwap))}`;
    const backendRes = await fetch(backendUrl);

    const text = await backendRes.text();
    // Backend returns plain text like "done"; normalize to JSON
    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ statusCode: 'ERROR', message: text || 'Swap failed' });
    }

    return res.status(200).json({ statusCode: 'OK', body: text });
  } catch (error: any) {
    console.error('Swap proxy error:', error);
    return res.status(500).json({ statusCode: 'ERROR', message: 'Internal server error' });
  }
}


