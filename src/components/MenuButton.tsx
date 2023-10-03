'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MenuButton() {
  return (
    <Link href="/stage" className=" w-[50px] h-[50px] rounded-[25px]">
      <Image
        src="/images/menu.png"
        alt="home"
        width={50}
        height={50}
        quality={100}
      />
    </Link>
  );
}
