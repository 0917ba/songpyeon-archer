'use client';

import Image from 'next/image';

export default function StartButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className=" w-[50px] h-[50px] rounded-[25px]">
      <Image
        src="/images/start.png"
        alt="start"
        width={50}
        height={50}
        unoptimized={true}
      />
    </button>
  );
}
