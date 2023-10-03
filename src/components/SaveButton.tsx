'use client';

import Image from 'next/image';

export default function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className=" w-[50px] h-[50px] rounded-[25px]">
      <Image
        src="/images/save.png"
        alt="save"
        width={50}
        height={50}
        quality={100}
      />
    </button>
  );
}
