import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const apiUrl = `http://159.223.91.231:8866/api/admin-users/delete-history?id=${id}`;
    console.log('Deleting user with URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Delete user response:', data);

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: data.message || 'Failed to delete user',
        error: data 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
