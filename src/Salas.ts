import { SalaBase, Lado } from "./SalaBase";
import { Config } from "./config";

const COLUNAS = Config.ScreenWidth / Config.TileSize; // 32
const LINHAS = Config.ScreenHeight / Config.TileSize; // 18

type Pos = [number, number]; // [coluna, linha]

// Gera uma lista de tiles em linha reta (horizontal ou vertical)
function seg(x1: number, y1: number, x2: number, y2: number): Pos[] {
  const r: Pos[] = [];
  for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) r.push([x, y]);
  return r;
}

interface Layout {
  portas: Lado[];
  inimigos: Pos[];
  eletricas?: Pos[];
  pilares?: Pos[];
  jogador?: Pos;
}

function criarMapa(l: Layout): string[] {
  const g: string[][] = [];
  for (let y = 0; y < LINHAS; y++) {
    g.push([]);
    for (let x = 0; x < COLUNAS; x++) {
      const borda = x === 0 || y === 0 || x === COLUNAS - 1 || y === LINHAS - 1;
      g[y].push(borda ? Config.TILE_PAREDE : Config.TILE_VAZIO);
    }
  }

  const set = ([x, y]: Pos, ch: string) => { g[y][x] = ch; };

  const meio = COLUNAS / 2; // 16
  const metade = LINHAS / 2; // 9
  if (l.portas.includes("norte")) { set([meio - 1, 0], Config.TILE_PORTA_NORTE); set([meio, 0], Config.TILE_PORTA_NORTE); }
  if (l.portas.includes("sul")) { set([meio - 1, LINHAS - 1], Config.TILE_PORTA_SUL); set([meio, LINHAS - 1], Config.TILE_PORTA_SUL); }
  if (l.portas.includes("oeste")) { set([0, metade - 1], Config.TILE_PORTA_OESTE); set([0, metade], Config.TILE_PORTA_OESTE); }
  if (l.portas.includes("leste")) { set([COLUNAS - 1, metade - 1], Config.TILE_PORTA_LESTE); set([COLUNAS - 1, metade], Config.TILE_PORTA_LESTE); }

  l.pilares?.forEach((p) => set(p, Config.TILE_PAREDE));
  l.eletricas?.forEach((p) => set(p, Config.TILE_ELETRICA));
  l.inimigos.forEach((p) => set(p, Config.TILE_INIMIGO));
  if (l.jogador) set(l.jogador, Config.TILE_JOGADOR);

  return g.map((linha) => linha.join(""));
}

export class Sala1 extends SalaBase {
  constructor() {
    super(
      criarMapa({
        portas: ["leste"],
        jogador: [3, 9],
        eletricas: [...seg(10, 2, 10, 6), ...seg(10, 11, 10, 15)],
        pilares: seg(20, 7, 20, 10),
        inimigos: [[24, 4], [24, 13], [18, 9]],
      }),
      { leste: "sala2" }
    );
  }
}

export class Sala2 extends SalaBase {
  constructor() {
    super(
      criarMapa({
        portas: ["oeste", "leste", "sul"],
        eletricas: [...seg(12, 5, 19, 5), ...seg(12, 12, 19, 12)],
        pilares: seg(15, 8, 16, 9),
        inimigos: [[6, 4], [26, 4], [6, 14], [26, 14]],
      }),
      { oeste: "sala1", leste: "sala3", sul: "sala4" }
    );
  }
}

export class Sala3 extends SalaBase {
  constructor() {
    super(
      criarMapa({
        portas: ["oeste"],
        eletricas: [...seg(16, 2, 16, 7), ...seg(16, 10, 16, 15)],
        pilares: [...seg(8, 4, 12, 4), ...seg(8, 13, 12, 13)],
        inimigos: [[24, 5], [24, 9], [24, 13], [20, 9], [27, 9]],
      }),
      { oeste: "sala2" }
    );
  }
}

export class Sala4 extends SalaBase {
  constructor() {
    super(
      criarMapa({
        portas: ["norte"],
        eletricas: [...seg(5, 8, 12, 8), ...seg(19, 8, 26, 8)],
        pilares: [...seg(8, 12, 8, 15), ...seg(23, 12, 23, 15)],
        inimigos: [[5, 4], [26, 4], [5, 14], [26, 14], [15, 14], [16, 5]],
      }),
      { norte: "sala2" }
    );
  }
}