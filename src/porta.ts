import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export class Porta extends Actor {
  constructor(coluna: number, linha: number, private readonly aoEntrar: () => void) {
    super({
      pos: vec((coluna + 0.5) * Config.TileSize, (linha + 0.5) * Config.TileSize),
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.fromHex("#4fc3f7"),
      collisionType: CollisionType.Passive,
      collisionGroup: CollisionGroups.Door,
      z: 0,
    });
    this.addTag("porta");
  }

  override onCollisionStart(_self: Collider, other: Collider, _side: Side, _contact: CollisionContact): void {
    if (other.owner.hasTag("jogador")) {
      this.aoEntrar();
    }
  }
}