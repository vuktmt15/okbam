import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { ref, page = '1', limit = '5' } = req.query;
  const referrerId = Array.isArray(ref) ? ref[0] : ref;

  if (!referrerId) {
    return res.status(400).json({ message: 'Missing referrerId (ref)' });
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  try {
    const backendResponse = await fetch(`http://159.223.91.231:8866/api/customers/history-balance?ref=${encodeURIComponent(referrerId)}`);
    const backendData = await backendResponse.json();

    if (backendData.statusCode === 'OK' && Array.isArray(backendData.body)) {
      // Sort by createDate DESC (newest first)
      const sortedData = [...backendData.body].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());

      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = pageNum * limitNum;
      const paginatedData = sortedData.slice(startIndex, endIndex);

      const totalItems = sortedData.length;
      const totalPages = Math.ceil(totalItems / limitNum);

      return res.status(200).json({
        data: paginatedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
        },
        statusCode: 'OK',
      });
    }

    return res.status(200).json({
      data: [],
      pagination: {
        currentPage: pageNum,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limitNum,
      },
      statusCode: 'OK',
    });
  } catch (error) {
    console.error('History balance proxy error:', error);
    return res.status(500).json({ message: 'Internal server error', statusCode: 'ERROR' });
  }
}


