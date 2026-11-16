import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader, Resources } from "./resources";
import { Sala1, Sala2, Sala3, Sala4 } from "./Salas";
import { GameOverScene } from "./gameover";
import { Config } from "./config";

const game = new Engine({
  width: Config.ScreenWidth,
  height: Config.ScreenHeight,
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  backgroundColor: Color.fromHex("#101820"),
  scenes: {
    sala1: Sala1,
    sala2: Sala2,
    sala3: Sala3,
    sala4: Sala4,
    gameover: GameOverScene,
  },
});

game
  .start("sala1", {
    loader,
    inTransition: new FadeInOut({
      duration: 1000,
      direction: "in",
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    Resources.Musica.loop = true;
    Resources.Musica.volume = 0.3;
    Resources.Musica.play();
  });