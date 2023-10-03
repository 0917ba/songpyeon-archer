import connectDB from '@/lib/database';
import Stage from '@/objects/Stage';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const db = (await connectDB).db('songpyeon-archer');
    const stage = await db.collection('stages').find().toArray();

    if (!stage) {
      return res.status(404).json({ message: 'Stage not found' });
    } else {
      return res.status(200).json(stage);
    }
  }
}
