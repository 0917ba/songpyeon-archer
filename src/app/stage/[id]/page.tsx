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
import {
  BAND_STROKE,
  BAND_COLOR,
  BAND_RADIUS,
  SLING_POINT_LEFT,
  SLING_POINT_RIGHT,
  SLING_POINT_CENTER,
  MAX_STRETCH,
} from '@/constants/slingshot';
import { useEffect, useRef } from 'react';
import Floor from '@/objects/Floor';
import Stone from '@/objects/Stone';
import Block from '@/objects/Block';
import Target from '@/objects/Target';
import engine from '@/lib/engine';
import { BUTTON_RADIUS } from '@/constants/canvas';
import Pause from '@/objects/buttons/Pause';
import { init } from '@/lib/handleButton';

export default function Page({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    const floor = Floor();

    const stone = Stone();

    const block = Block(500, 500);
    const target = Target(500, 400, 'pink');

    World.add(engine.world, [target]);

    stone.isStatic = true;
    let constraint: Constraint;
    let isDragging = false;

    let bandLeft: Body;
    let bandRight: Body;

    Events.on(mouseConstraint, 'mousemove', (event) => {
      if (isDragging) {
        if (bandLeft) {
          World.remove(engine.world, bandLeft);
        }

        const startPoint = SLING_POINT_LEFT;
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

        bandLeft = Bodies.rectangle(x, y, width, BAND_STROKE, {
          angle: angle,
          isStatic: true,
          collisionFilter: {
            group: -1,
          },
          render: {
            fillStyle: BAND_COLOR,
          },
          chamfer: {
            radius: BAND_RADIUS,
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

        const startPoint = SLING_POINT_RIGHT;
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

        bandRight = Bodies.rectangle(x, y, width, BAND_STROKE, {
          angle: angle,
          isStatic: true,
          collisionFilter: {
            group: -1,
          },
          render: {
            fillStyle: BAND_COLOR,
          },
          chamfer: {
            radius: BAND_RADIUS,
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
        const startPoint = SLING_POINT_CENTER;
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

        const maxMovementLength = MAX_STRETCH;
        if (movementLength > maxMovementLength) {
          stone.isStatic = true;
        } else {
          stone.isStatic = false;
        }
      }
    });

    World.add(engine.world, [floor, stone, block]);
    const runner = Runner.run(engine);
    Render.run(render);
    init(mouseConstraint, runner);

    return () => {
      Runner.stop(runner);
      Render.stop(render);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
