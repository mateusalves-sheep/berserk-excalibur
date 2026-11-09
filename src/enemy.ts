import { Actor, Engine, Color } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";
import { Player } from "./player";

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

    // Detecta colisão com a bala do player
    this.on('collisionstart', (evt) => {
      if (evt.other.group === CollisionGroups.PlayerBullet) {
        this.takeDamage(1);
        evt.other.kill();
      }
    });
  }

  onPostUpdate(engine: Engine, delta: number): void {
    const player = this.scene?.actors.find(a => a instanceof Player);
    if (!player) return;

    const direction = player.pos.sub(this.pos);
    this.vel = direction.normalize().scale(Config.EnemySpeed);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.kill();
    }
  }
}