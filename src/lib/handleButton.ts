import Home from '@/objects/buttons/Home';
import Pause from '@/objects/buttons/Pause';
import Restart from '@/objects/buttons/Restart';
import Start from '@/objects/buttons/Start';
import { Events, MouseConstraint, Runner, World } from 'matter-js';
import engine from './engine';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let pause: Pause;
let start: Start;
let restart: Restart;
let home: Home;

export function init(
  mouseConstraint: MouseConstraint,
  router: AppRouterInstance
) {
  pause = new Pause();
  start = new Start();
  restart = new Restart();
  home = new Home(router);

  World.add(engine.world, pause.body);

  Events.on(mouseConstraint, 'mousedown', (event) => {
    const clickedObject = event.source.body;
    const label = clickedObject?.label;

    if (label === 'pause') {
      setPaused();
    } else if (label === 'start') {
      setUnpaused();
    } else if (label === 'restart') {
      setUnpaused();
      restart.onClick();
    }
    // home의 경우 초기화를 안 시켜줘도 된다.
    else if (label === 'home') {
      home.onClick();
    }
  });
}

export function setPaused() {
  World.add(engine.world, start.body);
  World.add(engine.world, restart.body);
  World.add(engine.world, home.body);
  World.remove(engine.world, pause.body);
}

export function setUnpaused() {
  World.remove(engine.world, start.body);
  World.remove(engine.world, restart.body);
  World.remove(engine.world, home.body);
  World.add(engine.world, pause.body);
}
