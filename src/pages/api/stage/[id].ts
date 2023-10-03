import connectDB from '@/lib/database';
import Stage from '@/objects/Stage';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stageId } = req.query;

  if (req.method === 'GET') {
    const db = (await connectDB).db('songpyeon-archer');
    const stage: Stage | null = await db
      .collection('stages')
      .findOne({ _id: stageId });

    if (!stage) {
      return res.status(404).json({ message: 'Stage not found' });
    } else {
      return res.status(200).json(stage);
    }
  } else if (req.method === 'POST') {
    const data = req.body;
    const db = (await connectDB).db('songpyeon-archer');
    await db.collection('stages').insertOne(data);
    return res.status(201).json({ message: 'Stage created' });
  }
}