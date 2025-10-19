import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ref, isSpecial } = req.query;

  if (!ref) {
    return res.status(400).json({ message: 'ref parameter is required' });
  }

  try {
    const { ref, isSpecial } = req.query;
    const apiUrl = `http://159.223.91.231:8866/api/customers/history-balance-claim?ref=${ref}${isSpecial ? `&isSpecial=${isSpecial}` : ''}`;
    console.log('Fetching commission history from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ 
        message: text || 'Failed to fetch commission history' 
      });
    }

    const data = await response.json();
    console.log('Commission history response:', data);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Commission history proxy error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
