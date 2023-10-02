import { atom } from 'recoil';

export interface HighScore {
  [id: string]: number;
}

export const highScoreState = atom<HighScore>({
  key: 'highScoreState',
  default: {},
});
