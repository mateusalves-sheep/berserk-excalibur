import { Actor, Collider, CollisionContact, Engine, Keys, Side, vec, Color, Vector} from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";

export class Bullet extends Actor {
  
  constructor(direction : Vector, position : Vector) {
    
    super({
      name: 'Bullet',
      pos: position,
      width: Config.PlayerBulletSize,
      height: Config.PlayerBulletSize,
      color: Color.Cyan

    });
    this.vel = direction.scale(Config.PlayerBulletSpeed);
  }

  override onInitialize() {
    
    
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if(this.pos.x < 0 || this.pos.y < 0 || this.pos.x > Config.ScreenWidth || this.pos.y > Config.ScreenHeight){
        this.kill();
    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {

  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {

  }
  
}
