'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Stage from '@/objects/Stage';
import Link from 'next/link';
import HomeButton from '@/components/HomeButton';
import { useRouter } from 'next/navigation';

interface StageData {
  stage: Stage;
  _id: string;
}

function StageCard({ stage, id }: { stage: Stage; id: string }) {
  const [value, setValue] = useState<string>('');
  const [willDelete, setWillDelete] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  const onClick = async () => {
    if (value === stage.password) {
      const res = await fetch(`/api/stage/${id}`, {
        method: 'DELETE',
      });
      await res.json();
      alert('삭제되었습니다.');
      setWillDelete(false);

      window.location.reload();
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="w-full h-fit">
      <div className="w-full h-16 flex justify-between flex-shrink-0 bg-slate-100/30 rounded-md px-9 py-1">
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold">{stage.name}</h1>
          <p className="text-sm">제작자: {stage.author}</p>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={() => setWillDelete(true)}
            className="w-[42px] h-[42px] rounded-[25px]"
          >
            <Image
              src="/images/trash.png"
              alt="start"
              width={42}
              height={42}
              quality={100}
            />
          </button>
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
      {willDelete && (
        <div className="mt-2 w-full h-10 flex justify-between items-center flex-shrink-0 bg-slate-100/50 rounded px-9 py-1">
          <h1 className="font-medium">비밀번호를 입력하세요.</h1>
          <div className="w-fit flex gap-2 justify-center items-center">
            <input
              className="h-8 w-24 pl-2 rounded bg-slate-100/30 shadow text-sm"
              value={value}
              type="password"
              onChange={onChange}
              name="password"
            />
            <button
              onClick={onClick}
              className="flex justify-center items-center w-10 h-8 text-sm font-semibold bg-orange-400 rounded"
            >
              삭제
            </button>
            <button
              onClick={() => setWillDelete(false)}
              className="flex justify-center items-center w-10 h-8 text-sm font-semibold bg-yellow-400 rounded"
            >
              취소
            </button>
          </div>
        </div>
      )}
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
