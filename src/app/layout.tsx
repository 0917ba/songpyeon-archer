import Wrapper from '@/components/Wrapper';
import './globals.css';
import { noto_sans_kr } from '@/fonts';
import { Metadata } from 'next';

// title
export const metadata: Metadata = {
  title: '송편 터뜨리기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="w-full h-full">
      <body className={`w-full h-full ${noto_sans_kr.className}`}>
        <div className="flex justify-center items-center h-full">
          <Wrapper>{children}</Wrapper>
        </div>
      </body>
    </html>
  );
}
