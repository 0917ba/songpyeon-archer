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

export default function Page({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [highScore, setHighScore] = useRecoilState(highScoreState);
  const [score, setScore] = useState(0);
  const [targetLeftCount, setTargetLeftCount] = useState(1);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [restart, setRestart] = useState<() => {}>(() => () => {});
  const [isPaused, setIsPaused] = useState(false);
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
      let stone = Stone();
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

          // 사용한 콩 개수 증가
          setScore((prev) => prev + 1);

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

          // 0.1초 후 새로운 콩 생성
          setTimeout(() => {
            // World.remove(engine.world, stone);
            stone = Stone();
            World.add(engine.world, stone);
            stone.isStatic = true;
          }, 100);
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

      // 두 물체가 충돌하였을 때
      Events.on(engine, 'collisionStart', (event) => {
        event.pairs.some((pair) => {
          const { bodyA, bodyB } = pair;
          // 충돌한 두 물체가 바닥 & 송편인지 확인
          const isTargetDied =
            (bodyA.label === 'target' && bodyB.label === 'floor') ||
            (bodyA.label === 'floor' && bodyB.label === 'target');

          if (isTargetDied) {
            setTargetLeftCount((prev) => prev - 1);
            // 0.1초 후 타겟 제거
            setTimeout(() => {
              if (bodyA.label === 'target') {
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

    setRestart(() => () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      // 아직 typescript 지원이 완벽하지 않은듯
      Events.off(engine, undefined as any, undefined as any);
      Runner?.stop(runner);
      Render?.stop(render);
      setScore(0);
      setTargetLeftCount(1);
      setIsLevelComplete(false);
      init();
    });

    return () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      // 아직 typescript 지원이 완벽하지 않은듯
      Events.off(engine, undefined as any, undefined as any);
      Runner?.stop(runner);
      Render?.stop(render);
      setScore(0);
      setTargetLeftCount(1);
      setIsLevelComplete(false);
    };
  }, [router]);

  useEffect(() => {
    if (targetLeftCount === 0) {
      setHighScore((prev) => {
        const ret = { ...prev };
        if (!prev[params.id] || prev[params.id] > score) {
          ret[params.id] = score;
        }
        return ret;
      });
      setIsLevelComplete(true);
    }
  }, [targetLeftCount, score, params.id, setHighScore]);

  return (
    <div className="relative h-[600px] w-[1080px]">
      <div className="absolute top-6 right-6 w-56 h-11 rounded-md bg-slate-100/60 flex flex-col justify-center">
        <div className="text-center text-lg font-bold text-slate-800">
          사용한 밤톨 개수🌰: <span id="count">{score}개</span>
        </div>
      </div>
      {!isLevelComplete &&
        (isPaused ? (
          <div className="absolute top-[30px] left-[30px] flex gap-[12px]">
            <StartButton onClick={() => setIsPaused(false)} />
            <RestartButton onClick={restart} />
            <HomeButton />
          </div>
        ) : (
          <div className="absolute top-[30px] left-[30px]">
            <PauseButton onClick={() => setIsPaused(true)} />
          </div>
        ))}

      <canvas ref={canvasRef} />
      {isLevelComplete && (
        <LevelComplete
          score={score}
          highScore={highScore[params.id]}
          restart={restart}
        />
      )}
    </div>
  );
}
