import { Bodies } from 'matter-js';

export default function Floor() {
  return Bodies.rectangle(0, 600, 4320, 40, {
    label: 'floor',
    isStatic: true, // 다른 사물이 통과하지 못함
    render: {
      visible: false,
    },
  });
}
