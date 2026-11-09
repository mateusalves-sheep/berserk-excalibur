import { Actor, Engine, Color } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";
import { Player } from "./player"; // Ajuste o import do player se necessário

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

  onPostUpdate(engine: Engine, delta: number): void {
    // Busca o jogador dinamicamente na cena atual
    const player = this.scene?.actors.find(a => a instanceof Player);
    if (!player) return;

    // Calcula a direção, normaliza e aplica a velocidade
    const direction = player.pos.sub(this.pos);
    this.vel = direction.normalize().scale(Config.EnemySpeed);
  }
}