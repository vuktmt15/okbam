import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, urlPath: frontendUrlPath } = req.query;

    if (!email) {
      return res.status(400).json({
        statusCode: 'ERROR',
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      return res.status(400).json({
        statusCode: 'ERROR',
        message: 'Invalid email format'
      });
    }

    // Use frontend urlPath if provided, otherwise auto-detect from headers
    let urlPath: string;
    if (frontendUrlPath) {
      urlPath = frontendUrlPath as string;
    } else {
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      urlPath = `${protocol}://${host}`;
    }

    // Call backend API
    const response = await fetch(`http://159.223.91.231:8866/api/auth/forgot-password?email=${encodeURIComponent(email as string)}&urlPath=${encodeURIComponent(urlPath)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        statusCode: 'OK',
        message: 'Password reset email sent successfully',
        body: data
      });
    } else {
      return res.status(response.status).json({
        statusCode: 'ERROR',
        message: data?.message || 'Failed to send reset email'
      });
    }
  } catch (error) {
    console.error('Forgot password API error:', error);
    return res.status(500).json({
      statusCode: 'ERROR',
      message: 'Internal server error'
    });
  }
}
