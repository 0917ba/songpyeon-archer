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
  password: string;
  blocks: BlockInfo[] = [];
  targets: TargetInfo[] = [];

  constructor(
    name: string,
    author: string,
    password: string,
    blocks?: BlockInfo[],
    targets?: TargetInfo[]
  ) {
    this.name = name;
    this.author = author;
    this.password = password;
    this.blocks = blocks || [];
    this.targets = targets || [];
  }
}
