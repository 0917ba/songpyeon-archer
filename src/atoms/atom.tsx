import { atom } from 'recoil';

export interface HighScore {
  [id: string]: number;
}

export const highScoreState = atom<HighScore>({
  key: 'highScoreState',
  default: {},
});

export const gravityState = atom<number>({
  key: 'gravityState',
  default: 1,
});

export const beanWeightState = atom<number>({
  key: 'beanWeightState',
  default: 1,
});

export const beanFrictionState = atom<number>({
  key: 'beanFrictionState',
  default: 1,
});

export const beanAirResistanceState = atom<number>({
  key: 'beanAirResistanceState',
  default: 1,
});
