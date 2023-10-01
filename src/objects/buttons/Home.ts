import Button from './Button';
import engine from '@/lib/engine';
import { BUTTON_X, BUTTON_Y } from '@/constants/button';

export default class Home extends Button {
  onClick: () => void;

  constructor() {
    super(BUTTON_X[2], BUTTON_Y, '/images/home.png', 'home');
    this.onClick = () => {};
  }
}
