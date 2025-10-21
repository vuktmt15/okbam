import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const backendUrl = process.env.API_BASE_URL || 'http://159.223.91.231:8866';
    
    console.log('=== UPDATE CONFIG API START ===');
    console.log('Backend URL:', backendUrl);
    console.log('Request ID:', id);
    console.log('Request body:', req.body);
    
    const response = await fetch(`${backendUrl}/api/admin-configs/update-config?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      return res.status(response.status).json({ 
        message: 'Backend error', 
        error: errorText,
        status: response.status 
      });
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    console.log('=== UPDATE CONFIG API END ===');
    
    // Forward the response from the API server
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Update config proxy error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}