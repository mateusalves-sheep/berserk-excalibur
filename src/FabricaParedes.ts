import { Engine, SpriteSheet, ImageSource } from 'excalibur';
import { Parede, TipoParede } from './Parede';
import { TILE_PAREDE, TILE_ELETRICA, TILE } from './config';
import type { Jogador } from './Jogador';

export async function carregarSheetTiles(): Promise<SpriteSheet> {
  const imagem = new ImageSource('/assets/tiles.png');
  await imagem.load();
  return SpriteSheet.fromImageSource({
    image: imagem,
    grid: {
      spriteWidth: TILE,
      spriteHeight: TILE,
      rows: 4,
      columns: 4,
    },
  });
}

function criarParedeDoChar(
  char: string,
  coluna: number,
  linha: number,
  sheet?: SpriteSheet
): Parede | null {
  let tipo: TipoParede | null = null;

  if (char === TILE_PAREDE) {
    tipo = (coluna + linha) % 2 === 0 ? 'arvore' : 'pedra';
  } else if (char === TILE_ELETRICA) {
    tipo = 'eletrica';
  }

  if (!tipo) return null;
  return new Parede({ coluna, linha, tipo, sheet });
}

export function construirParedes(
  mapa: string[],
  jogador: Jogador,
  sheet?: SpriteSheet
): Parede[] {
  const paredes: Parede[] = [];

  for (let linha = 0; linha < mapa.length; linha++) {
    for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
      const parede = criarParedeDoChar(
        mapa[linha][coluna],
        coluna,
        linha,
        sheet
      );
      if (!parede) continue;

      if (parede.fazDano) {
        parede.on('collisionstart', (evt) => {
          if (evt.other.owner !== jogador) return;
          if (!parede.podeAplicarDano()) return;

          jogador.receberDano(10);
          parede.piscarDano();
        });
      }

      paredes.push(parede);
    }
  }

  return paredes;
}