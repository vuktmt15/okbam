import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ref, amount } = req.query;

  if (!ref || !amount) {
    return res.status(400).json({ message: 'ref and amount parameters are required' });
  }

  try {
    const apiUrl = `http://159.223.91.231:8866/api/customers/check-in?ref=${ref}&amount=${amount}`;
    console.log('Check-in API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Check-in response:', data);

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: data.message || 'Failed to check-in',
        error: data 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Check-in proxy error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
