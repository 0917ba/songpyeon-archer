import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import Button from './Button';

export default class Pause extends Button {
  constructor() {
    super(BUTTON_X[0], BUTTON_Y, '/images/pause.png', 'pause');
  }
}
