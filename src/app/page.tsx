'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="h-[600px] w-[1080px] bg-slate-300 relative">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50">
        <Link
          href="/stage"
          className="bg-slate-100/50 rounded px-4 py-2 font-semibold text-lg relative top-7"
        >
          시작하기
        </Link>
      </div>

      <Image
        src="/images/main.png"
        alt="main"
        quality={100}
        width={1080}
        height={600}
      />
    </div>
  );
}
