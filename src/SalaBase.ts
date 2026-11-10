import { Color, Engine, Scene, vec, Actor, CollisionType, Rectangle } from 'excalibur';
import { Parede, TipoParede } from './Parede';
import { TILE, TILE_VAZIO, TILE_PAREDE, TILE_ELETRICA, TILE_JOGADOR } from './config';
import { Mateus } from './Mateus';

export abstract class SalaBase extends Scene {
  protected jogador!: Mateus;

  constructor(protected mapa: string[]) {
    super();
  }

  onInitialize(engine: Engine) {
    this.construirParedes(engine);
    this.spawnarJogador(engine);
    this.configurarCamera(engine);
  }

  private construirParedes(engine: Engine) {
    for (let linha = 0; linha < this.mapa.length; linha++) {
      const linhaTexto = this.mapa[linha];

      for (let coluna = 0; coluna < linhaTexto.length; coluna++) {
        const char = linhaTexto[coluna];

        if (char === TILE_PAREDE) {
          this.add(new Parede(coluna, linha, 'solida', Color.Gray));
        } else if (char === TILE_ELETRICA) {
          const paredeEletrica = new Parede(coluna, linha, 'eletrica', Color.Yellow);

          paredeEletrica.on('collisionstart', (evt) => {
            if (evt.other.owner === this.jogador) {
              this.jogador.receberDano(10);
            }
          });

          this.add(paredeEletrica);
        } else if (char === TILE_JOGADOR) {
          this.jogador = new Mateus(vec(coluna * TILE, linha * TILE));
        }
      }
    }
  }

  private spawnarJogador(engine: Engine) {
    if (!this.jogador) {
      throw new Error('O mapa precisa de um "P" para o jogador!');
    }
    this.add(this.jogador);
  }

  private configurarCamera(engine: Engine) {
    this.camera.pos = this.jogador.pos.clone();
    this.camera.strategy.lockToActor(this.jogador);
    this.camera.zoom = 1.5;
  }
}