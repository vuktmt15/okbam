import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { referrerId, bamId, quantities } = req.body;
    
    if (!referrerId || !bamId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing referrerId or bamId', 
        data: null, 
        errorCode: 4000 
      });
    }

    const requestBody: any = {
      referrerId: String(referrerId),
      bamId: String(bamId)
    };

    // Add quantities if provided
    if (quantities !== undefined) {
      requestBody.quantities = String(quantities);
    }

    const response = await fetch('http://159.223.91.231:8866/api/investment-packages/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Investment register proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      data: null, 
      errorCode: 5000 
    });
  }
}
