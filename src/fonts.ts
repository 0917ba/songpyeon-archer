import { Hanalei_Fill, Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google';

const hanalei_fill = Hanalei_Fill({
  subsets: ['latin'],
  weight: '400',
});

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export { hanalei_fill, noto_sans_kr };
