import { Body } from 'matter-js';

class Stage {
  name: string;
  lifeCount: number = 3;
  blocks: Body[] = [];
  targets: Body[] = [];

  constructor(
    name: string,
    lifeCount: number,
    blocks?: Body[],
    targets?: Body[]
  ) {
    this.name = name;
    this.lifeCount = lifeCount;
    this.blocks = blocks || [];
    this.targets = targets || [];
  }
}

export default Stage;
