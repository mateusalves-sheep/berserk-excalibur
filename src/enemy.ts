import { Actor, Engine, Color } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";
import { Player } from "./player";

export class Enemy extends Actor {
  health: number;
  private fireTimer: number = 0;

  constructor() {
    super({
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red,
      collisionGroup: CollisionGroups.Enemy
    });
    this.health = Config.EnemyHealth;

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

    // Perseguição
    const direction = player.pos.sub(this.pos);
    this.vel = direction.normalize().scale(Config.EnemySpeed);

    // Sistema de Disparo
    this.fireTimer += delta;
    const shootInterval = Config.EnemyShootCooldown ?? 2000;

    if (this.fireTimer >= shootInterval) {
      this.fireTimer = 0;
      this.shootAtPlayer(player, engine);
    }
  }

  private shootAtPlayer(player: Player, engine: Engine): void {
    const bullet = new Actor({
      pos: this.pos.clone(),
      width: 8,
      height: 8,
      color: Color.Yellow,
      collisionGroup: CollisionGroups.EnemyBullet
    });

    const shootDir = player.pos.sub(this.pos).normalize();
    bullet.vel = shootDir.scale(200);

    engine.currentScene.add(bullet);

    setTimeout(() => {
      if (!bullet.isKilled()) {
        bullet.kill();
      }
    }, 3000);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.kill();
    }
  }
}