import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { referrerId, amount } = req.query;

  if (!referrerId || !amount) {
    return res.status(400).json({ message: 'ReferrerId and amount are required' });
  }

  try {
    const apiUrl = `http://159.223.91.231:8866/api/investment-history/history-claim?referrerId=${referrerId}&amount=${amount}`;
    console.log('Calling API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('API Response:', data);
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in history-claim API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
