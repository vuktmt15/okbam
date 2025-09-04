import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy GET /api/usdt -> http://159.223.91.231:8866/api/usdt
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { toAddress, amount, referrerId } = req.query;

  const url = `http://159.223.91.231:8866/api/usdt?toAddress=${encodeURIComponent(
    String(toAddress ?? '')
  )}&amount=${encodeURIComponent(String(amount ?? ''))}&referrerId=${encodeURIComponent(
    String(referrerId ?? '')
  )}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error: any) {
    res.status(500).json({ message: 'Proxy error', error: String(error) });
  }
}


