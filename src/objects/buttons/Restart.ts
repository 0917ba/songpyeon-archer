import { Engine, Events, Render, Runner, World } from 'matter-js';
import Button from './Button';
import { BUTTON_X, BUTTON_Y } from '@/constants/button';
import engine from '@/lib/engine';

export default class Restart extends Button {
  onClick: () => void;

  constructor(
    render: Render,
    runner: Runner,
    init: () => void,
    setScore: (score: number) => void
  ) {
    super(BUTTON_X[1], BUTTON_Y, '/images/restart.png', 'restart');
    this.onClick = () => {
      World.clear(engine.world, false);
      Engine.clear(engine);
      Events.off(engine, undefined as any, undefined as any);
      Render.stop(render);
      Runner.stop(runner);
      setScore(0);
      init();
    };
  }
}
