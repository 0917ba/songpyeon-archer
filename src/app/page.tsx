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
      render: {
        visible: false,
      },
    });

    const stone = Bodies.circle(190, 465, 20, {
      label: 'stone',
      frictionAir: 0.001,
      // isStatic: true,
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

    stone.isStatic = true;
    let constraint: Constraint;
    let isDragging = false;

    const slingPointLeft = { x: 170, y: 465 };
    const slingPointRight = { x: 200, y: 460 };

    let bandLeft: Body;
    let bandRight: Body;

    const bandStroke = 10;
    const bandColor = '#301608';
    const bandRadius = 7;

    Events.on(mouseConstraint, 'mousemove', (event) => {
      if (isDragging) {
        if (bandLeft) {
          World.remove(engine.world, bandLeft);
        }

        const startPoint = slingPointLeft;
        const endPoint = stone.position;

        const x = (startPoint.x + endPoint.x) / 2;
        const y = (startPoint.y + endPoint.y) / 2;
        const width = Math.sqrt(
          Math.pow(startPoint.x - endPoint.x, 2) +
            Math.pow(startPoint.y - endPoint.y, 2)
        );
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x
        );

        bandLeft = Bodies.rectangle(x, y, width, bandStroke, {
          angle: angle,
          isStatic: true,
          collisionFilter: {
            group: -1,
          },
          render: {
            fillStyle: bandColor,
          },
          chamfer: {
            radius: bandRadius,
          },
        });

        World.add(engine.world, bandLeft);
      }
    });

    Events.on(mouseConstraint, 'mousemove', (event) => {
      if (isDragging) {
        if (bandRight) {
          World.remove(engine.world, bandRight);
        }

        const startPoint = slingPointRight;
        const endPoint = stone.position;

        const x = (startPoint.x + endPoint.x) / 2;
        const y = (startPoint.y + endPoint.y) / 2;
        const width = Math.sqrt(
          Math.pow(startPoint.x - endPoint.x, 2) +
            Math.pow(startPoint.y - endPoint.y, 2)
        );
        const angle = Math.atan2(
          endPoint.y - startPoint.y,
          endPoint.x - startPoint.x
        );

        bandRight = Bodies.rectangle(x, y, width, bandStroke, {
          angle: angle,
          isStatic: true,
          collisionFilter: {
            group: -1,
          },
          render: {
            fillStyle: bandColor,
          },
          chamfer: {
            radius: bandRadius,
          },
        });

        World.add(engine.world, bandRight);
      }
    });

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
            lineWidth: 5,
            strokeStyle: '#dfdfdf',
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
        World.remove(engine.world, bandLeft);
        World.remove(engine.world, bandRight);

        // // 발사할 오브젝트의 속도를 설정합니다.
        const startPoint = { x: 190, y: 465 };
        const endPoint: { x: number; y: number } = event.mouse.position;
        const dragRatio = 0.18;
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
