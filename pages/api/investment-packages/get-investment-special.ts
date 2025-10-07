import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { referrerId } = req.query;

  if (!referrerId) {
    return res.status(400).json({ message: 'ReferrerId is required' });
  }

  try {
    const response = await fetch(
      `http://159.223.91.231:8866/api/investment-packages/get-investment-special?referrerId=${referrerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in get-investment-special API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
