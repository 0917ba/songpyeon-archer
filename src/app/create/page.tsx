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
  Composite,
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
import SaveButton from '@/components/SaveButton';
import MapSave from '@/components/MapSave';

interface Position {
  x: number;
  y: number;
  color?: 'pink' | 'green' | 'white';
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stage, setStage] = useState<Stage>(new Stage('', '', '', [], []));
  const [ended, setEnded] = useState(false);

  const saveStage = () => {
    const newStage = new Stage(
      stage.name,
      stage.password,
      stage.author,
      [],
      []
    );
    Composite.allBodies(engine.world).forEach((body) => {
      const marker = body.label.substring(0, 6);
      if (marker !== 'create') return;

      const position: Position = {
        x: body.position.x,
        y: body.position.y,
      };
      switch (body.label) {
        case 'create_block':
          newStage.blocks.push(position as BlockInfo);
          break;

        case 'create_pink':
        case 'create_green':
        case 'create_white':
          position.color = body.label.substring(7) as
            | 'pink'
            | 'green'
            | 'white';
          newStage.targets.push(position as TargetInfo);
          break;
      }
    });
    setStage(newStage);
    setEnded(true);
  };

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
      const bin = Bodies.rectangle(910, 56, 80, 80, {
        isStatic: true,
        isSensor: true,
        label: 'bin',
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
        block.label = 'origin_block';
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
        target.label = `origin_${color}`;
        return target;
      };

      let block = makeBlock();
      let targetPink = makeTarget('pink');
      let targetGreen = makeTarget('green');
      let targetWhite = makeTarget('white');

      World.add(engine.world, [block, targetPink, targetGreen, targetWhite]);

      Events.on(mouseConstraint, 'startdrag', (event) => {
        const clickedObject: Body = event.body;
        const marker = clickedObject?.label.substring(0, 6);

        if (marker === 'create' || marker === 'origin') {
          clickedObject.isStatic = false;

          setTimeout(() => {
            switch (clickedObject.label) {
              case 'origin_block':
                block = makeBlock();
                World.add(engine.world, block);
                clickedObject.label = clickedObject.label.replace(
                  'origin',
                  'create'
                );
                break;
              case 'origin_pink':
                targetPink = makeTarget('pink');
                World.add(engine.world, targetPink);
                clickedObject.label = clickedObject.label.replace(
                  'origin',
                  'create'
                );
                break;
              case 'origin_green':
                targetGreen = makeTarget('green');
                World.add(engine.world, targetGreen);
                clickedObject.label = clickedObject.label.replace(
                  'origin',
                  'create'
                );
                break;
              case 'origin_white':
                targetWhite = makeTarget('white');
                World.add(engine.world, targetWhite);
                clickedObject.label = clickedObject.label.replace(
                  'origin',
                  'create'
                );
                break;
              default:
                break;
            }
          }, 100);
        }
      });

      Events.on(mouseConstraint, 'enddrag', (event) => {
        const clickedObject: Body = event.body;
        const marker = clickedObject?.label.substring(0, 6);
        if (marker === 'create' || marker === 'origin') {
          event.body.isStatic = true;
        }
      });

      Events.on(engine, 'collisionStart', (event) => {
        event.pairs.some((pair) => {
          const { bodyA, bodyB } = pair;
          const markerA = bodyA?.label.substring(0, 6);
          const markerB = bodyB?.label.substring(0, 6);
          // 쓰레기통에 들어갔는지 확인
          const isTargetTrashed =
            (markerA === 'create' && markerB === 'bin') ||
            (markerA === 'bin' && markerB === 'create');

          if (isTargetTrashed) {
            setTimeout(() => {
              if (markerA === 'create') {
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

    const cleanup = () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      // 아직 typescript 지원이 완벽하지 않은듯
      Events.off(engine, undefined as any, undefined as any);
      Runner?.stop(runner);
      Render?.stop(render);
    };

    init();

    return () => cleanup();
  }, []);

  return (
    <div className="relative h-[600px] w-[1080px]">
      <div className="absolute top-[25px] left-[30px] flex gap-[12px]">
        <HomeButton />
      </div>
      <div className="absolute top-[25px] right-[30px]">
        <SaveButton onClick={saveStage} />
      </div>
      {ended && <MapSave stage={stage} />}

      <canvas ref={canvasRef} />
    </div>
  );
}
