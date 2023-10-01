'use client';

import { RecoilRoot } from 'recoil';

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
