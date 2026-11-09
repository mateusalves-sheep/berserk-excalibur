import { Actor, Collider, CollisionContact, Engine, Keys, Side, vec, Color} from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Bullet } from "./bullet";

export class Player extends Actor {
  
  lastDirection = vec(1,0);  
  cooldown = 0;
  health = Config.PlayerHealth;
  invincibleTimer = 0;

  constructor() {
    
    super({
      name: 'Player',
      pos: vec((Config.ScreenWidth)/2, (Config.ScreenHeight)/2),
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Blue
    });
    
  }

  override onInitialize() {
    
  }

  takeDamage(amount: number) : void {
    if(this.invincibleTimer > 0){
      return;
    }
    this.health -= amount;
    this.invincibleTimer = Config.PlayerInvincibleTime;
    if(this.health <= 0){
      this.kill();
    }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    let direction = vec(0, 0);
    this.cooldown -= elapsedMs;
    this.invincibleTimer -= elapsedMs;
    if(engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)){
      direction.x = direction.x - 1;
    }

    if(engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)){
      direction.x = direction.x + 1;
    }

    if(engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)){
      direction.y = direction.y - 1;
    }

    if(engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)){
      direction.y = direction.y + 1; 
    }
    if(direction.distance() !== 0){
      direction = direction.normalize();
      this.lastDirection = direction;
    }
    this.vel = direction.scale(Config.PlayerSpeed);
    if(engine.input.keyboard.isHeld(Keys.Space) && this.cooldown <= 0){
      const bullet = new Bullet(this.lastDirection, this.pos);
      this.scene?.add(bullet);
      this.cooldown = Config.PlayerShootCooldown;

    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
  
}
