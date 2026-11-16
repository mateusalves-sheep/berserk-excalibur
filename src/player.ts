import { Actor, Collider, CollisionContact, CollisionType, Engine, Keys, Side, vec, Vector, Rectangle, Color} from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Bullet } from "./bullet";
import { CollisionGroups } from "./collisions";
import { Estado } from "./estado"

export class Player extends Actor {
  lastDirection = vec(1,0);  
  cooldown = 0;
  invincibleTimer = 0;
  inDamage = false;

  readonly max_health = Config.PlayerHealth;

  private speedMultiplier = 1;
  private readonly playerWidth = Config.TileSize*0.7;
  private readonly playerHeight = Config.TileSize*0.9;

   private readonly spriteNormal = new Rectangle({
    width: this.playerWidth,
    height: this.playerHeight,
    color: Color.Blue,
  });

  // <- do Jogador.ts: flash vermelho ao levar dano
  private readonly spriteDano = new Rectangle({
    width: this.playerWidth,
    height: this.playerHeight,
    color: Color.Red,
  });


  constructor(pos: Vector) {
    
    super({
      name: 'Player',
      pos,
      width: Config.TileSize*0.7,
      height: Config.TileSize*0.9,
      collisionType : CollisionType.Active,
      collisionGroup : CollisionGroups.Player,
      z : 3  
    });
    
    this.addTag("jogador");
    this.graphics.use(this.spriteNormal);
  }

  override onInitialize() {
    
  }

  get health() : number {
    return Estado.vida
  }

  takeDamage(amount: number) : void {
    if(this.invincibleTimer > 0 || this.isKilled()){
      return;
    }
    
    Estado.vida = Math.max(0, Estado.vida - amount);
    console.log(`Jogador recebeu ${amount} de dano. Vida: ${this.health}`);
    this.invincibleTimer = Config.PlayerInvincibleTime;
    this.graphics.use(this.spriteDano);
    this.inDamage = true;

    if(Estado.vida <= 0){
      const scene = this.scene;
      this.kill();
      if (scene) {
        scene.engine.clock.schedule(() => scene.engine.goToScene("gameover"), 800);
      }
    }
  }


  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    let direction = vec(0, 0);
    this.cooldown -= elapsedMs;
    this.invincibleTimer -= elapsedMs;

    if(this.inDamage && this.invincibleTimer <= 0){
      this.graphics.use(this.spriteNormal);
      this.inDamage = false;
    }

    const tecla = engine.input.keyboard;
    
    if(tecla.isHeld(Keys.A) || tecla.isHeld(Keys.Left)){
      direction.x = direction.x - 1;
    }

    if(tecla.isHeld(Keys.D) || tecla.isHeld(Keys.Right)){
      direction.x = direction.x + 1;
    }

    if(tecla.isHeld(Keys.W) || tecla.isHeld(Keys.Up)){
      direction.y = direction.y - 1;
    }

    if(tecla.isHeld(Keys.S) || tecla.isHeld(Keys.Down)){
      direction.y = direction.y + 1; 
    }
    if(direction.distance() !== 0){
      direction = direction.normalize();
      this.lastDirection = direction;
    }
    this.vel = direction.scale(Config.PlayerSpeed);

    if(tecla.isHeld(Keys.Space) && this.cooldown <= 0){
      const origem = this.pos.add(this.lastDirection.scale(Config.TileSize*0.6))
      this.scene?.add(new Bullet(origem, this.lastDirection, "jogador"));
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
    if (other.owner.hasTag("eletrica")) {
      this.takeDamage(Config.TrapDamage);
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
  
}
