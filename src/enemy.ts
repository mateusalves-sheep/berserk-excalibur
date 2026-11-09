import { Actor, Color } from "excalibur";
import { Config } from "./config";

export class Enemy extends Actor {
  health: number;

  constructor() {
    super({
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red
    });
    this.health = Config.EnemyHealth;
  }
}