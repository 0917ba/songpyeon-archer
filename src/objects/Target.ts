import { TARGET_WIDTH, TARGET_HEIGHT } from '@/constants/target';
import generateEllipseVertices from '@/lib/generateEllipseVertices';
import { Bodies } from 'matter-js';

type Color = 'pink' | 'green' | 'white';

export default function Target(x: number, y: number, color: Color) {
  const vertices = generateEllipseVertices(TARGET_WIDTH, TARGET_HEIGHT);

  return Bodies.fromVertices(x, y, vertices, {
    label: 'target',
    mass: 0.9,
    inverseMass: 1 / 0.9,
    render: {
      sprite: {
        texture: `/images/target_${color}.png`,
        xScale: 1,
        yScale: 1,
      },
    },
  });
}
