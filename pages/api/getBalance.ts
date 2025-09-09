import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { referrerId, userId } = req.query;
  
  // Support both referrerId and userId parameters
  const idParam = referrerId || userId;
  if (!idParam) {
    return res.status(400).json({ message: 'Missing referrerId or userId' });
  }

  try {
    const response = await fetch(`http://159.223.91.231:8866/api/getBalance?referrerId=${encodeURIComponent(String(idParam))}`);
    const data = await response.json();
    
    // Extract balance from response and return full format
    if (data.statusCode === 'OK' && data.body && data.body.balance) {
      const balance = {
        usdt: data.body.balance.usdt || 0,
        dragon: data.body.balance.dragon || 0
      };
      res.status(200).json({ balance });
    } else {
      res.status(200).json({ balance: { usdt: 0, dragon: 0 } });
    }
  } catch (error: any) {
    console.error('GetBalance proxy error:', error);
    // Return default balance on error
    res.status(200).json({ balance: { usdt: 0, dragon: 0 } });
  }
}
