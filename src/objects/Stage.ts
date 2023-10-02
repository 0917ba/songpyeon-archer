export interface BlockInfo {
  x: number;
  y: number;
}

export interface TargetInfo {
  x: number;
  y: number;
  color: 'pink' | 'green' | 'white';
}

export default class Stage {
  name: string;
  author: string;
  lifeCount: number = 3;
  blocks: BlockInfo[] = [];
  targets: TargetInfo[] = [];

  constructor(
    name: string,
    author: string,
    blocks?: BlockInfo[],
    targets?: TargetInfo[]
  ) {
    this.name = name;
    this.author = author;
    this.blocks = blocks || [];
    this.targets = targets || [];
  }
}
