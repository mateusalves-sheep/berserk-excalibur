import { Engine, DisplayMode } from 'excalibur';
import { Sala1 } from './Salas';

const game = new Engine({
  width: 800,
  height: 600,
  displayMode: DisplayMode.FitScreen,
});

game.start().then(() => {
  game.addScene('sala1', new Sala1());
  game.goToScene('sala1');

});