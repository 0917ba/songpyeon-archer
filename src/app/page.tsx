'use client';

import {
  Bodies,
  Engine,
  Render,
  Runner,
  World,
  Mouse,
  MouseConstraint,
  Body,
  Events,
  Constraint,
  Vector,
} from 'matter-js';
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

    // 캔버스 요소에 마우스 이벤트를 추가합니다.
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        render: {
          visible: false,
        },
      },
    });
    World.add(engine.world, mouseConstraint);

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
      frictionAir: 0.005,
      // isStatic: true,
      render: {
        sprite: {
          texture: '/images/stone.png',
          xScale: 1,
          yScale: 1,
        },
      },
    });

    stone.isStatic = true;
    let constraint: Constraint;
    let isDragging = false;

    Events.on(mouseConstraint, 'startdrag', (event) => {
      const clickedObject: Body = event.body;
      if (clickedObject?.label === 'stone') {
        clickedObject.isStatic = false;
        isDragging = true;

        const initialPoint = { x: 190, y: 465 };
        constraint = Constraint.create({
          pointA: initialPoint,
          bodyB: clickedObject,
          stiffness: 0.05,
          render: {
            visible: false,
          },
        });

        World.add(engine.world, constraint);
      }
    });

    Events.on(mouseConstraint, 'enddrag', (event) => {
      const clickedObject = event.body;
      if (clickedObject?.label === 'stone') {
        // 클릭한 오브젝트가 발사할 오브젝트인 경우에만 실행됩니다.
        isDragging = false;
        stone.isStatic = false;

        // // 발사할 오브젝트의 속도를 설정합니다.
        const startPoint = { x: 190, y: 465 };
        const endPoint: { x: number; y: number } = event.mouse.position;
        const dragRatio = 0.145;
        const velocity = Vector.mult(
          Vector.sub(startPoint, endPoint),
          dragRatio
        );

        Body.setVelocity(clickedObject, velocity);
        World.remove(engine.world, constraint);
      }
    });

    Events.on(mouseConstraint, 'mousemove', (event) => {
      if (isDragging) {
        const dx = event.source.mouse.position.x - 190;
        const dy = event.source.mouse.position.y - 465;
        const movementLength = Math.sqrt(dx * dx + dy * dy);

        const maxMovementLength = 280;
        if (movementLength > maxMovementLength) {
          stone.isStatic = true;
        } else {
          stone.isStatic = false;
        }
      }
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
