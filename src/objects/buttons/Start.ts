import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import Button from './Button';
import engine from '@/lib/engine';

export default class Start extends Button {
  constructor() {
    super(BUTTON_X[0], BUTTON_Y, '/images/start.png', 'start');
  }
}
