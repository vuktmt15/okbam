import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password, passwordConfirmation, token } = req.body;

    // Validation
    if (!password || !passwordConfirmation || !token) {
      return res.status(400).json({
        statusCode: 'ERROR',
        message: 'Password, password confirmation and token are required'
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        statusCode: 'ERROR',
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        statusCode: 'ERROR',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Call backend API
    const response = await fetch('http://159.223.91.231:8866/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        passwordConfirmation,
        token
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({
        statusCode: 'OK',
        message: 'Password updated successfully',
        body: data
      });
    } else {
      return res.status(response.status).json({
        statusCode: 'ERROR',
        message: data?.message || 'Failed to update password'
      });
    }
  } catch (error) {
    console.error('Update password API error:', error);
    return res.status(500).json({
      statusCode: 'ERROR',
      message: 'Internal server error'
    });
  }
}
