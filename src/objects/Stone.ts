import { Bodies } from 'matter-js';
import {
  SLING_POINT_CENTER,
  STONE_HEIGHT,
  STONE_WIDTH,
} from '@/constants/slingshot';
import generateEllipseVertices from '@/lib/generateEllipseVertices';

export default function Stone(mass = 1, friction = 1, airResistance = 1) {
  const { x, y } = SLING_POINT_CENTER;
  const vertices = generateEllipseVertices(STONE_WIDTH, STONE_HEIGHT);

  return Bodies.fromVertices(x, y, vertices, {
    label: 'stone',
    frictionAir: 0.01 * airResistance,
    friction: 0.1 * friction,
    mass: mass * 2,
    inverseMass: 1 / 2 / mass,

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
