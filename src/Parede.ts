import { Actor, CollisionType, Color, Engine, Rectangle, vec } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export class Parede extends Actor {
  readonly eletrica: boolean;

  constructor(coluna: number, linha: number, eletrica = false) {
    const T = Config.TileSize;
    super({
      // +0.5 porque o anchor do Actor é o centro
      pos: vec((coluna + 0.5) * T, (linha + 0.5) * T),
      width: T,
      height: T,
      collisionType: CollisionType.Fixed,
      collisionGroup: CollisionGroups.Wall,
      z: 1,
    });

    this.eletrica = eletrica;
    this.addTag("parede");
    if (eletrica) this.addTag("eletrica");

    this.graphics.use(
      new Rectangle({ width: T, height: T, color: eletrica ? Color.Yellow : Color.Gray })
    );
  }

  override onPreUpdate(_engine: Engine, _delta: number): void {
    if (this.eletrica) {
      // Efeito de "faísca"
      this.graphics.opacity = 0.6 + 0.4 * Math.abs(Math.sin(performance.now() / 120));
    }
  }
}