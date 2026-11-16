import { Actor, Engine, Color, Vector, CollisionGroup, CollisionType } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export interface Danificavel {
  takeDamage(quantidade: number): void;
}

function isDanificavel(x: unknown): x is Danificavel {
  return typeof (x as { takeDamage?: unknown } | undefined)?.takeDamage === "function";
}

export type DonoDoTiro = "jogador" | "inimigo";

export class Bullet extends Actor {
  
  private readonly dano: number;

  constructor(position: Vector,  direction: Vector, dono: DonoDoTiro) {
    super({
      name: 'Bullet',
      pos: position,
      width: dono === "jogador" ? Config.PlayerBulletSize : Config.EnemyBulletSize,
      height: dono === "jogador" ? Config.PlayerBulletSize : Config.EnemyBulletSize,
      color: dono === "jogador" ? Color.Cyan : Color.Orange,
      collisionType: CollisionType.Passive,
      collisionGroup: dono === "jogador"? CollisionGroups.PlayerBullet : CollisionGroups.EnemyBullet,
      z : 5
    });
    
    this.dano = dono === "jogador" ? Config.PlayerBulletDamage : Config.EnemyBulletDamage;
    const velocidade = dono === "jogador" ? Config.PlayerBulletSpeed : Config.EnemyBulletSpeed;
    this.vel = direction.normalize().scale(velocidade);
  }

  override onInitialize(engine: Engine): void {
    this.on("collisionstart", (evt) => {
      if(this.isKilled()){
        return;
      }
      const other = evt.other.owner;
      if (isDanificavel(other)) {
        other.takeDamage(this.dano);
      }
      this.kill();
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Destrói a bala se sair dos limites da tela
    if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > Config.ScreenWidth || this.pos.y > Config.ScreenHeight) {
      this.kill();
    }
  }
}
