import { Actor, Color } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export class Enemy extends Actor {
  health: number;

  constructor() {
    super({
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red,
      collisionGroup: CollisionGroups.Enemy
    });
    this.health = Config.EnemyHealth;
  }
}