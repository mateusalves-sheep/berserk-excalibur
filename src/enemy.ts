import { Actor, Engine, Color, Vector, CollisionType } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";
import { Player } from "./player";
import { Bullet } from "./bullet";

export class Enemy extends Actor {
  health: number;
  private fireTimer: number = 0;

  constructor() {
    super({
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red,
      collisionType: CollisionType.Active, // <-- Essencial para sofrer bloqueio físico
      collisionGroup: CollisionGroups.Enemy
    });
    
    this.health = Config.EnemyHealth;
    this.collider.useBoxCollider(Config.TileSize, Config.TileSize);
  }

  onInitialize(engine: Engine): void {
    this.on("collisionstart", (evt) => {
      // Colisão com a bala do jogador
      if (evt.other instanceof Bullet && evt.other.collisionGroup === CollisionGroups.PlayerBullet) {
        this.takeDamage(1);
        evt.other.kill();
      }
    });
  }

  onPostUpdate(engine: Engine, delta: number): void {
    const player = this.scene?.actors.find(a => a instanceof Player) as Player;
    if (!player) return;

    // Movimento em direção ao player
    const direction = player.pos.sub(this.pos);
    if (direction.distance() > 5) {
      const normalizedDir = direction.normalize();
      this.vel = normalizedDir.scale(Config.EnemySpeed);
    } else {
      this.vel = Vector.Zero;
    }

    // Cooldown de tiro
    this.fireTimer += delta;
    if (this.fireTimer >= Config.EnemyShootCooldown) {
      this.fireTimer = 0;
      this.shootAtPlayer(player);
    }
  }

  private shootAtPlayer(player: Player): void {
    const direction = player.pos.sub(this.pos).normalize();
    const bullet = new Bullet(this.pos, direction, CollisionGroups.EnemyBullet);
    this.scene?.add(bullet);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.scene?.events.emit("enemyDied", { points: 100 });
      this.kill();
    }
  }
}