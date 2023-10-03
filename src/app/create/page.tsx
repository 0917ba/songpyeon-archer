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
import { useEffect, useRef, useState } from 'react';
import Floor from '@/objects/Floor';
import Stone from '@/objects/Stone';
import Block from '@/objects/Block';
import Target from '@/objects/Target';
import engine from '@/lib/engine';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { highScoreState } from '@/atoms/atom';
import LevelComplete from '@/components/LevelComplete';
import HomeButton from '@/components/HomeButton';
import PauseButton from '@/components/PauseButton';
import StartButton from '@/components/StartButton';
import RestartButton from '@/components/RestartButton';
import Stage, { BlockInfo, TargetInfo } from '@/objects/Stage';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          background: '/images/create.png',
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
          stiffness: 1,
        },
      });
      World.add(engine.world, mouseConstraint);

      // 바닥 추가
      const floor = Floor();
      World.add(engine.world, floor);

      // 쓰레기통 추가
      const bin = Bodies.rectangle(950, 56, 80, 80, {
        isStatic: true,
        isSensor: true,
        label: 'bin',
        // collisionFilter: {
        //   group: -2,
        // },
        render: {
          sprite: {
            texture: '/images/trash.png',
            xScale: 1,
            yScale: 1,
          },
        },
      });
      World.add(engine.world, bin);

      const makeBlock = () => {
        const block = Block(690, 55);
        block.isStatic = true;
        block.collisionFilter.group = -2;
        block.label = 'create_block';
        return block;
      };

      const makeTarget = (color: 'pink' | 'green' | 'white') => {
        let target: Body;

        switch (color) {
          case 'pink':
            target = Target(380, 55, 'pink');
            break;
          case 'green':
            target = Target(580, 55, 'green');
            break;
          case 'white':
            target = Target(480, 55, 'white');
            break;
          default:
            target = Target(380, 55, 'pink');
            break;
        }

        target.isStatic = true;
        target.collisionFilter.group = -2;
        target.label = `create_${color}`;
        return target;
      };

      let block = makeBlock();
      let targetPink = makeTarget('pink');
      let targetGreen = makeTarget('green');
      let targetWhite = makeTarget('white');

      World.add(engine.world, [block, targetPink, targetGreen, targetWhite]);

      Events.on(mouseConstraint, 'startdrag', (event) => {
        const clickedObject: Body = event.body;
        if (clickedObject?.label.substring(0, 6) === 'create') {
          clickedObject.isStatic = false;

          setTimeout(() => {
            switch (clickedObject.label) {
              case 'create_block':
                block = makeBlock();
                World.add(engine.world, block);
                break;
              case 'create_pink':
                targetPink = makeTarget('pink');
                World.add(engine.world, targetPink);
                break;
              case 'create_green':
                targetGreen = makeTarget('green');
                World.add(engine.world, targetGreen);
                break;
              case 'create_white':
                targetWhite = makeTarget('white');
                World.add(engine.world, targetWhite);
                break;
              default:
                break;
            }
          }, 100);
        }
      });

      Events.on(mouseConstraint, 'enddrag', (event) => {
        const clickedObject: Body = event.body;
        if (clickedObject?.label.substring(0, 6) === 'create') {
          event.body.isStatic = true;
        }
      });

      Events.on(engine, 'collisionStart', (event) => {
        event.pairs.some((pair) => {
          const { bodyA, bodyB } = pair;
          // 쓰레기통에 들어갔는지 확인
          const isTargetTrashed =
            (bodyA?.label.substring(0, 6) === 'create' &&
              bodyB.label === 'bin') ||
            (bodyA.label === 'bin' && bodyB.label.substring(0, 6) === 'create');

          if (isTargetTrashed) {
            setTimeout(() => {
              if (bodyA.label.substring(0, 6) === 'create') {
                World.remove(engine.world, bodyA);
              } else {
                World.remove(engine.world, bodyB);
              }
            }, 100);
          }
        });
      });

      Render.run(render);
    };

    init();

    const cleanup = () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      // 아직 typescript 지원이 완벽하지 않은듯
      Events.off(engine, undefined as any, undefined as any);
      Runner?.stop(runner);
      Render?.stop(render);
    };

    return () => cleanup();
  }, []);

  return (
    <div className="relative h-[600px] w-[1080px]">
      <canvas ref={canvasRef} />
    </div>
  );
}
