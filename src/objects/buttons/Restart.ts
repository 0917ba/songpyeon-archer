import Button from './Button';
import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import engine from '@/lib/engine';

export default class Restart extends Button {
  onClick: () => void;

  constructor() {
    super(BUTTON_X[1], BUTTON_Y, '/images/restart.png', 'restart');
    this.onClick = () => {};
  }
}
