import { ImageSource, Loader, Sprite, Sound } from "excalibur";
import floorPath from "./images/floor.png";
import paredePath from "./images/parede.png";
import playerPath from "./images/jogador.png";
import inimigoPath from "./images/inimigo.png";
import eletricaPath from "./images/eletrica.png";
import musicaPath from "./sounds/musica.mp3";
import tiroPath from "./sounds/tiro.mp3";
import mortePath from "./sounds/morte.mp3";

export const Resources = {
  Floor: new ImageSource(floorPath),
  Parede: new ImageSource(paredePath),
  Player: new ImageSource(playerPath),
  Inimigo: new ImageSource(inimigoPath),
  Eletrica: new ImageSource(eletricaPath),
  Musica: new Sound(musicaPath),
  Tiro: new Sound(tiroPath),
  Morte: new Sound(mortePath),
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}

// Cria um sprite novo já no tamanho desejado (só chame depois do jogo carregar)
export function criarSprite(img: ImageSource, largura: number, altura: number): Sprite {
  const s = img.toSprite();
  s.destSize = { width: largura, height: altura };
  return s;
}