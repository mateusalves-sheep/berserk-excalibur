import { Actor, Collider, CollisionContact, Engine, Keys, Side, vec, Color} from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Bullet } from "./bullet";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

export class Player extends Actor {
  
  lastDirection = vec(1,0);  
  cooldown = 0;
  constructor() {
    
    super({
      // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
      // https://github.com/excaliburjs/excalibur-extension/
      // Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
      // Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
      name: 'Player',
      pos: vec((Config.ScreenWidth)/2, (Config.ScreenHeight)/2),
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Blue
      // anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
    });
    
  }

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation

    // Actions are useful for scripting common behavior, for example patrolling enemies
  

    // Sometimes you want to click on an actor!
    
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    let direction = vec(0, 0);
    this.cooldown -= elapsedMs;
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
