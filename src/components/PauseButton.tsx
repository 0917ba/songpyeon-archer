'use client';

import Image from 'next/image';

export default function PauseButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className=" w-[50px] h-[50px] rounded-[25px]">
      <Image
        src="/images/pause.png"
        alt="pause"
        width={50}
        height={50}
        quality={100}
      />
    </button>
  );
}
