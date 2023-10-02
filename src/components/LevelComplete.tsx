'use client';

import { hanalei_fill } from '@/fonts';
import RestartButton from './RestartButton';
import HomeButton from './HomeButton';

interface Props {
  score: number;
  highScore: number;
  restart: () => void;
}

export default function LevelComplete({ score, highScore, restart }: Props) {
  return (
    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-slate-100/40 w-[512px] h-[289px] rounded-md ">
      <div className="w-full h-full flex flex-col gap-5 justify-center text-center text-slate-800">
        <div className={hanalei_fill.className}>
          <h1 className="text-6xl">level complete!</h1>
        </div>
        <div className={`text-base font-medium`}>
          <div>최고 기록: {highScore}개</div>
          <div>현재 기록: {score}개</div>
        </div>
        <div className="flex gap-3 justify-center">
          <RestartButton onClick={restart} />
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
