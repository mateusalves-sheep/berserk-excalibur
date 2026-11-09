import { Actor, Engine, Color } from "excalibur";
import { Config, player } from "./config";
import { CollisionGroups } from "./collisions";

export class Enemy extends Actor {
  health: number;

  constructor() {
    super({
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red,
      collisionGroup: CollisionGroups.Enemy
      onPostUpdate(engine: Engine, delta: number): void {
      const direction = player.pos.sub(this.pos);
    });
    this.health = Config.EnemyHealth;
  }
}