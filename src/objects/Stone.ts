import { Bodies } from 'matter-js';
import {
  SLING_POINT_CENTER,
  STONE_HEIGHT,
  STONE_WIDTH,
} from '@/constants/slingshot';
import generateEllipseVertices from '@/lib/generateEllipseVertices';

export default function Stone() {
  const { x, y } = SLING_POINT_CENTER;
  const vertices = generateEllipseVertices(STONE_WIDTH, STONE_HEIGHT);

  return Bodies.fromVertices(x, y, vertices, {
    label: 'stone',
    frictionAir: 0.001,

    collisionFilter: {
      group: -1,
    },

    render: {
      sprite: {
        texture: '/images/stone.png',
        xScale: 1,
        yScale: 1,
      },
    },
  });
}
