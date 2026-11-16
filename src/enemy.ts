import { Actor, Engine, Color, Vector, CollisionType } from "excalibur";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";
import { Player } from "./player";
import { Bullet, Danificavel } from "./bullet";
import { Estado } from "./estado";
import { Resources, criarSprite } from "./resources";

export class Enemy extends Actor implements Danificavel {
  private health = Config.EnemyHealth;
  private fireTimer: number = 0;
  private flashTimer: number = 0;
  private readonly sprite = criarSprite(Resources.Inimigo, Config.TileSize, Config.TileSize);

  constructor(pos: Vector, private readonly alvo: Player) {
    super({
      name: "Enemy",
      pos,
      width: Config.TileSize,
      height: Config.TileSize,
      color: Color.Red,
      collisionType: CollisionType.Active, 
      collisionGroup: CollisionGroups.Enemy,
      z: 2
    });
    
    this.addTag("inimigo");
    this.graphics.use(this.sprite);
    this.fireTimer = Math.random() * Config.EnemyShootCooldown;
  }

  onPreUpdate(engine: Engine, delta: number): void {
    if(this.flashTimer > 0){
      this.flashTimer -= delta;
      if(this.flashTimer <= 0){
        this.sprite.tint = Color.White;
      }
    }

    if(this.alvo.isKilled()){
      this.vel = Vector.Zero;
      return;
    }

    const direction = this.alvo.pos.sub(this.pos);
    this.sprite.rotation = direction.toAngle();
    if(direction.distance() > 5){
      this.vel = direction.normalize().scale(Config.EnemySpeed); 
    } else {
      this.vel = Vector.Zero;
    }

    this.fireTimer += delta;
    if(this.fireTimer >= Config.EnemyShootCooldown){
      this.fireTimer = 0;
      const dir = direction.normalize();
      const origem = this.pos.add(dir.scale(Config.TileSize*0.7));
      this.scene?.add(new Bullet(origem, dir, "inimigo"));
      Resources.Tiro.play(0.4);
    }
  }

  override onPostUpdate(_engine: Engine, _delta: number): void {
    // Impede o inimigo de sair da tela pelas portas
    const m = Config.TileSize / 2;
    this.pos.x = Math.min(Math.max(this.pos.x, m), Config.ScreenWidth - m);
    this.pos.y = Math.min(Math.max(this.pos.y, m), Config.ScreenHeight - m);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.sprite.tint = Color.Red;
    this.flashTimer = 120;
    if (this.health <= 0 && !this.isKilled()) {
      Resources.Morte.play(0.5);
      Estado.pontos += Config.EnemyScore;
      this.kill();
    }
  }
}