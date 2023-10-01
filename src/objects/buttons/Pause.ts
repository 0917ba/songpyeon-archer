import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import Button from './Button';
import engine from '@/lib/engine';
import Start from './Start';
import { Events, MouseConstraint, World } from 'matter-js';
import Restart from './Restart';

export default class Pause extends Button {
  constructor() {
    super(BUTTON_X[0], BUTTON_Y, '/images/pause.png', 'pause');
  }
}
