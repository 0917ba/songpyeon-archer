import { TARGET_WIDTH, TARGET_HEIGHT } from '@/constants/target';
import generateEllipseVertices from '@/lib/generateEllipseVertices';
import { Bodies } from 'matter-js';

type Color = 'pink' | 'green' | 'white';

export default function Target(x: number, y: number, color: Color) {
  const vertices = generateEllipseVertices(TARGET_WIDTH, TARGET_HEIGHT);

  return Bodies.fromVertices(x, y, vertices, {
    label: 'target',
    render: {
      sprite: {
        texture: `/images/target_${color}.png`,
        xScale: 1,
        yScale: 1,
      },
    },
  });
}
