import Wrapper from '@/components/Wrapper';
import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

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
