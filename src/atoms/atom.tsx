import { atom } from 'recoil';

export interface HighScore {
  [id: number]: number;
}

export const highScoreState = atom<HighScore>({
  key: 'highScoreState',
  default: {},
});
