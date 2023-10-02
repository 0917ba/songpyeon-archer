import { Hanalei_Fill, Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google';

const hanalei_fill = Hanalei_Fill({
  subsets: ['latin'],
  weight: '400',
});

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const noto_serif_kr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '900'],
});

export { hanalei_fill, noto_serif_kr, noto_sans_kr };
