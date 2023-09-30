'use client';

import { Bodies, Engine, Render, Runner, World } from 'matter-js';
import { useEffect, useRef } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const engine = Engine.create();
    const render = Render.create({
      engine,
      canvas: canvasRef.current!,
      options: {
        width: 1080,
        height: 600,
        background: '/images/layout.png',
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(0, 600, 2160, 40, {
      isStatic: true, // 다른 사물이 통과하지 못함
      collisionFilter: {
        group: -1, // 특정 그룹에 대해서만 다른 효과를 내기 위해 그룹 묶기
      },
      render: {
        visible: false,
      },
    });

    const stone = Bodies.circle(190, 465, 20, {
      label: 'stone',
      isStatic: true,
      render: {
        sprite: {
          texture: '/images/stone.png',
          xScale: 1,
          yScale: 1,
        },
      },
    });

    World.add(engine.world, [floor, stone]);
    const runner = Runner.run(engine);
    Render.run(render);

    return () => {
      Runner.stop(runner);
      Render.stop(render);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div
        style={{
          width: 1080,
          height: 600,
          marginInline: 'auto',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
