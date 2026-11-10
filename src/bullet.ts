import { Actor, Engine, Color, Vector, CollisionGroup } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export class Bullet extends Actor {
  
  constructor(
    position: Vector, 
    direction: Vector, 
    collisionGroup: CollisionGroup = CollisionGroups.PlayerBullet, 
    color: Color = Color.Cyan
  ) {
    super({
      name: 'Bullet',
      pos: position,
      width: Config.PlayerBulletSize,
      height: Config.PlayerBulletSize,
      color: color,
      collisionGroup: collisionGroup
    });
    
    this.vel = direction.scale(Config.PlayerBulletSpeed);
  }

  override onInitialize(engine: Engine): void {
    // Destrói a bala ao atingir qualquer parede
    this.on("collisionstart", (evt) => {
      if (evt.other.collisionGroup === CollisionGroups.Wall) {
        this.kill();
      }
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Destrói a bala se sair dos limites da tela
    if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > Config.ScreenWidth || this.pos.y > Config.ScreenHeight) {
      this.kill();
    }
  }
}
