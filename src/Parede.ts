import {
  Actor,
  Color,
  CollisionType,
  Rectangle,
  vec,
  Sprite,
  SpriteSheet,
  Vector,
} from 'excalibur';
import { TILE } from './config';

export type TipoParede = 'arvore' | 'pedra' | 'eletrica';

export interface ConfigParede {
  coluna: number;
  linha: number;
  tipo: TipoParede;
  sheet?: SpriteSheet;
}

const SPRITE_INDEX: Record<TipoParede, { x: number; y: number }> = {
  arvore:   { x: 0, y: 0 },
  pedra:    { x: 1, y: 0 },
  eletrica: { x: 2, y: 0 },
};

const FALLBACK_COR: Record<TipoParede, Color> = {
  arvore:   Color.fromHex('#2e7d32'),
  pedra:    Color.fromHex('#757575'),
  eletrica: Color.fromHex('#f9a825'),
};

export class Parede extends Actor {
  public readonly tipo: TipoParede;
  public readonly coluna: number;
  public readonly linha: number;

  private _ultimoDanoMs = 0;
  private static readonly COOLDOWN_DANO_MS = 500;

  constructor(cfg: ConfigParede) {
    super({
      pos: vec(cfg.coluna * TILE, cfg.linha * TILE),
      width: TILE,
      height: TILE,
      collisionType: CollisionType.Fixed,
      z: 10,
    });

    this.tipo   = cfg.tipo;
    this.coluna = cfg.coluna;
    this.linha  = cfg.linha;

    this.addTag('parede');
    this.addTag(`parede:${cfg.tipo}`);
    if (cfg.tipo === 'eletrica') this.addTag('armadilha');

    this.aplicarVisual(cfg);
  }

  private aplicarVisual(cfg: ConfigParede) {
    const idx = SPRITE_INDEX[cfg.tipo];

    if (cfg.sheet) {
      const sprite = cfg.sheet.getSprite(idx.x, idx.y);
      if (sprite) {
        sprite.scale = vec(2, 2); // ajuste ao seu tileset
        this.graphics.use(sprite);
        return;
      }
    }

    this.graphics.use(
      new Rectangle({ width: TILE, height: TILE, color: FALLBACK_COR[cfg.tipo] })
    );
  }

  public get fazDano(): boolean {
    return this.tipo === 'eletrica';
  }

  public podeAplicarDano(): boolean {
    const agora = performance.now();
    if (agora - this._ultimoDanoMs < Parede.COOLDOWN_DANO_MS) return false;
    this._ultimoDanoMs = agora;
    return true;
  }

  public piscarDano() {
    if (this.tipo !== 'eletrica') return;
    const original = this.graphics.current!.color;
    this.graphics.current!.color = Color.White;
    setTimeout(() => {
      if (this.graphics.current) this.graphics.current.color = original;
    }, 100);
  }
}