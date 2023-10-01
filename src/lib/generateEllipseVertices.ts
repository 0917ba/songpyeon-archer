import { Vector } from 'matter-js';

export default function generateEllipseVertices(
  width: number,
  height: number,
  vertices = 50
): Vector[][] {
  const points = [];
  const angle = (Math.PI * 2) / vertices;

  for (let i = 0; i < vertices; i++) {
    const x = (Math.cos(angle * i) * width) / 2;
    const y = (Math.sin(angle * i) * height) / 2;

    points.push({ x, y });
  }

  return points as any;
}
