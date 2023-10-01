import { BUTTON_RADIUS } from '@/constants/canvas';
import { Bodies, Body } from 'matter-js';

export default class Button {
  x: number;
  y: number;
  body: Body;

  constructor(
    x: number,
    y: number,
    imagePath = '/images/button.png',
    label = 'button'
  ) {
    this.x = x;
    this.y = y;
    this.body = Bodies.circle(x, y, BUTTON_RADIUS, {
      isSensor: true,
      isStatic: true,
      label,
      render: {
        sprite: {
          texture: imagePath,
          xScale: 1,
          yScale: 1,
        },
      },
    });
  }
}
