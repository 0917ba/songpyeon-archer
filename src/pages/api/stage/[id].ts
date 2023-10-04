import connectDB from '@/lib/database';
import Stage from '@/objects/Stage';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.method, req.query);
  const { id } = req.query;

  if (req.method === 'GET') {
    const db = (await connectDB).db('songpyeon-archer');
    const stage: Stage | null = await db
      .collection('stages')
      .findOne({ _id: id });

    if (!stage) {
      return res.status(404).json({ message: 'Stage not found' });
    } else {
      return res.status(200).json(stage);
    }
  } else if (req.method === 'POST') {
    let data = req.body;
    data = JSON.parse(data);
    data.date = new Date();
    const db = (await connectDB).db('songpyeon-archer');
    await db.collection('stages').insertOne(data);
    return res.status(201).json({ message: 'Stage created' });
  } else if (req.method === 'DELETE') {
    const db = (await connectDB).db('songpyeon-archer');
    await db.collection('stages').deleteOne({ _id: id });
    return res.status(200).json({ message: 'Stage deleted' });
  }
}
