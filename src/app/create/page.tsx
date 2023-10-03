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
        },
      });
      World.add(engine.world, mouseConstraint);

      // 바닥 추가
      const floor = Floor();
      World.add(engine.world, floor);

      // 쓰레기통 추가
      const bin = Bodies.rectangle(950, 56, 80, 80, {
        isStatic: true,
        collisionFilter: {
          group: -2,
        },
        render: {
          sprite: {
            texture: '/images/trash.png',
            xScale: 1,
            yScale: 1,
          },
        },
      });
      World.add(engine.world, bin);

      const block = Block(690, 55);
      const pinkTarget = Target(380, 55, 'pink');
      const greenTarget = Target(580, 55, 'green');
      const whiteTarget = Target(480, 55, 'white');
      block.isStatic = true;
      pinkTarget.isStatic = true;
      greenTarget.isStatic = true;
      whiteTarget.isStatic = true;
      block.collisionFilter.group = -2;
      pinkTarget.collisionFilter.group = -2;
      greenTarget.collisionFilter.group = -2;
      whiteTarget.collisionFilter.group = -2;
      World.add(engine.world, [block, pinkTarget, greenTarget, whiteTarget]);

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
