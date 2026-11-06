import { Actor, Color, CollisionType, Rectangle, vec, Vector } from 'excalibur';
import { TILE } from './config';

export class Jogador extends Actor {
  vida = 100;
  private invencivel = false;

  constructor(pos: Vector) {
    super({
      pos,
      width: TILE * 0.7,
      height: TILE * 0.9,
      collisionType: CollisionType.Active,
    });

    this.graphics.use(
      new Rectangle({ width: TILE * 0.7, height: TILE * 0.9, color: Color.Blue })
    );
  }

  onPreUpdate(engine: any) {
    const vel = 150;
    let dx = 0;
    let dy = 0;

    if (engine.input.keyboard.isHeld('ArrowLeft'))  dx -= 1;
    if (engine.input.keyboard.isHeld('ArrowRight')) dx += 1;
    if (engine.input.keyboard.isHeld('ArrowUp'))    dy -= 1;
    if (engine.input.keyboard.isHeld('ArrowDown'))  dy += 1;

    const dir = vec(dx, dy);
    if (dir.size > 0) dir.normalize();
    this.vel = dir.scale(vel);
  }

  receberDano(quantidade: number) {
    if (this.invencivel) return;

    this.vida -= quantidade;
    console.log(`Jogador levou ${quantidade} de dano! Vida: ${this.vida}`);

    this.invencivel = true;
    this.graphics.current!.color = Color.Red;
    setTimeout(() => {
      this.graphics.current!.color = Color.Blue;
      this.invencivel = false;
    }, 500);

    if (this.vida <= 0) {
      console.log('Jogador morreu!');
      this.kill();
    }
  }
}