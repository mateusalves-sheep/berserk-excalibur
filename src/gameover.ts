import { Color, Engine, Font, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { Config } from "./config";
import { Estado } from "./estado";

export class GameOverScene extends Scene {
  override onActivate(): void {
    const cx = Config.ScreenWidth / 2;
    const cy = Config.ScreenHeight / 2;

    this.add(new Label({
      text: "GAME OVER",
      pos: vec(cx, cy - 30),
      font: new Font({ size: 48, color: Color.Red, textAlign: TextAlign.Center }),
    }));
    this.add(new Label({
      text: "Pressione R para reiniciar",
      pos: vec(cx, cy + 30),
      font: new Font({ size: 20, color: Color.White, textAlign: TextAlign.Center }),
    }));
  }

  override onDeactivate(): void {
    this.clear();
  }

  override onPreUpdate(engine: Engine, _elapsedMs: number): void {
    if (engine.input.keyboard.wasPressed(Keys.R)) {
      Estado.reset();
      engine.goToScene("sala1");
    }
  }
}