'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Stage from '@/objects/Stage';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';

interface StageData {
  stage: Stage;
  _id: string;
}

function StageCard({ stage, id }: { stage: Stage; id: string }) {
  return (
    <div className="w-full h-16 flex-shrink-0 bg-slate-100/30 rounded-md px-9 py-1 flex justify-between">
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-bold">{stage.name}</h1>
        <p className="text-sm">제작자: {stage.author}</p>
      </div>
      <div className="flex gap-3 justify-center items-center">
        <Link
          href={`/stage/${id}`}
          className=" w-[45px] h-[45px] rounded-[25px]"
        >
          <Image
            src="/images/start.png"
            alt="start"
            width={45}
            height={45}
            quality={100}
          />
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  const [stages, setStages] = useState<StageData[]>([]);

  useEffect(() => {
    const fetchStages = async () => {
      const res = await fetch('/api/stages');
      const data: StageData[] = await res.json();
      setStages(data);
    };
    fetchStages();
  }, []);

  return (
    <div className="h-[600px] w-[1080px] relative">
      <div className="absolute top-5 left-5 z-50">
        <HomeButton />
      </div>
      <div className="w-full h-full absolute py-16 px-56">
        <h1 className="text-4xl font-bold mb-10 text-center">
          스테이지를 선택하세요.
        </h1>
        <div className="flex flex-col gap-2 h-[280px] overflow-y-auto scrolls mb-10">
          {stages.map((stage) => (
            <StageCard key={stage._id} stage={stage.stage} id={stage._id} />
          ))}
        </div>
        <div className="flex w-full justify-center gap-3">
          <Link
            href="/create"
            className="flex justify-center items-center w-28 h-9 text-base font-bold bg-yellow-400 rounded"
          >
            맵 제작하기
          </Link>
          <Link
            href="/setting"
            className="flex justify-center items-center w-16 h-9 text-base font-bold bg-orange-400 rounded"
          >
            설정
          </Link>
        </div>
      </div>
      <Image
        src="/images/layout.png"
        alt="main"
        quality={100}
        width={1080}
        height={600}
      />
    </div>
  );
}
