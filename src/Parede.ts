import { Actor, Color, CollisionType, Rectangle, vec } from 'excalibur';
import { TILE } from './config';

export type TipoParede = 'solida' | 'eletrica';

export class Parede extends Actor {
  constructor(
    public coluna: number,
    public linha: number,
    public tipo: TipoParede,
    cor: Color
  ) {
    super({
      pos: vec(coluna * TILE, linha * TILE),
      width: TILE,
      height: TILE,
      collisionType: CollisionType.Fixed,
    });

    this.graphics.use(
      new Rectangle({
        width: TILE,
        height: TILE,
        color: cor,
      })
    );

    this.addTag('parede');
    if (tipo === 'eletrica') this.addTag('eletrica');
  }
}