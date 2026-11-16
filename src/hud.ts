import { Canvas, ScreenElement, Vector } from "excalibur";
import { Config } from "./config";
import { Estado } from "./estado";

function desenharCoracao(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, cheio: boolean) {
  ctx.beginPath();
  ctx.moveTo(x + s / 2, y + s);
  ctx.bezierCurveTo(x - s * 0.1, y + s * 0.55, x + s * 0.05, y, x + s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x + s * 0.95, y, x + s * 1.1, y + s * 0.55, x + s / 2, y + s);
  ctx.closePath();

  if (cheio) {
    ctx.fillStyle = "#e53935";
    ctx.fill();
  } else {
    ctx.fillStyle = "#3a3a3a";
    ctx.fill();
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

export class Hud extends ScreenElement {
  constructor() {
    super({
      pos: new Vector(Config.HudMargin, Config.HudMargin),
      anchor: Vector.Zero,
      z: 100,
    });
  }

  override onInitialize(): void {
    const tam = 24;
    const gap = 6;
    const total = Config.PlayerHealth;

    this.graphics.use(
      new Canvas({
        width: total * (tam + gap),
        height: tam + 4,
        cache: false, // redesenha todo frame para refletir a vida atual
        draw: (ctx: CanvasRenderingContext2D) => {
          for (let i = 0; i < total; i++) {
            desenharCoracao(ctx, i * (tam + gap) + 2, 2, tam, i < Estado.vida);
          }
        },
      })
    );
  }
}
