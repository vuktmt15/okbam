import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Missing id' });

  try {
    const resp = await fetch(`http://159.223.91.231:8866/api/product/detail-bam?id=${encodeURIComponent(String(id))}`);
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (e: any) {
    res.status(500).json({ message: 'Proxy error', error: String(e) });
  }
}


