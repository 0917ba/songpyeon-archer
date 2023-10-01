'use client';

import {
  Bodies,
  Render,
  Runner,
  World,
  Mouse,
  MouseConstraint,
  Body,
  Events,
  Constraint,
  Vector,
  Engine,
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
import { initButton } from '@/lib/handleButton';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const router = useRouter();

  useEffect(() => {
    let runner: Runner;
    let render: Render;

    const init = () => {
      runner = Runner.run(engine);
      render = Render.create({
        engine,
        canvas: canvasRef.current!,
        options: {
          width: 1080,
          height: 600,
          background: '/images/layout.png',
          wireframes: false,
        },
      });
      // 마우스 이벤트 추가
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
      stone.isStatic = true;

      const block = Block(500, 500);
      const target = Target(500, 400, 'pink');
      World.add(engine.world, [floor, stone, block, target]);

      let constraint: Constraint;
      let isDragging = false;

      let bandLeft: Body;
      let bandRight: Body;

      // 밴드 생성 함수
      const createBand = (startPoint: Vector, endPoint: Vector) => {
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

        return Bodies.rectangle(x, y, width, BAND_STROKE, {
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
      };

      // 움직일 때마다 밴드 생성
      Events.on(mouseConstraint, 'mousemove', (event) => {
        if (isDragging) {
          if (bandLeft) {
            World.remove(engine.world, bandLeft);
          }
          if (bandRight) {
            World.remove(engine.world, bandRight);
          }

          const startPointLeft = SLING_POINT_LEFT;
          const startPointRight = SLING_POINT_RIGHT;
          const endPoint = stone.position;

          bandLeft = createBand(startPointLeft, endPoint);
          bandRight = createBand(startPointRight, endPoint);

          World.add(engine.world, [bandLeft, bandRight]);
        }
      });

      // 슬링샷 중앙과 돌멩이 간 스프링 생성
      Events.on(mouseConstraint, 'startdrag', (event) => {
        const clickedObject: Body = event.body;
        if (clickedObject?.label === 'stone') {
          clickedObject.isStatic = false;
          isDragging = true;

          const initialPoint = SLING_POINT_CENTER;
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

      // 슬링샷에서 손을 떼면 돌멩이 발사
      Events.on(mouseConstraint, 'enddrag', (event) => {
        const clickedObject = event.body;
        if (clickedObject?.label === 'stone') {
          isDragging = false;
          stone.isStatic = false;
          World.remove(engine.world, bandLeft);
          World.remove(engine.world, bandRight);

          // 돌멩이 속도 설정
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

      // 스프링 최대 길이 설정
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

      Render.run(render);
      initButton(mouseConstraint, router, runner, render, init);
    };

    init();

    return () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      Events.off(engine, undefined as any, undefined as any);
      Runner?.stop(runner);
      Render?.stop(render);
    };
  }, [router]);

  return <canvas ref={canvasRef} />;
}
