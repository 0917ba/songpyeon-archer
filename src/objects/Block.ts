import { BLOCK_HEIGHT, BLOCK_WIDTH } from '@/constants/block';
import { Bodies } from 'matter-js';

export default function Block(x: number, y: number) {
  return Bodies.rectangle(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, {
    label: 'block',
    mass: 3,
    inverseMass: 1 / 3,
    render: {
      sprite: {
        texture: '/images/block.png',
        xScale: 1,
        yScale: 1,
      },
    },
  });
}
