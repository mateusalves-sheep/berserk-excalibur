import { SalaBase } from './SalaBase';
import {
  TILE_VAZIO, TILE_PAREDE, TILE_ELETRICA, TILE_JOGADOR
} from './config';

const V = TILE_VAZIO;
const P = TILE_PAREDE;
const E = TILE_ELETRICA;
const J = TILE_JOGADOR;

export class Sala1 extends SalaBase {
  constructor() {
    super([
      P + P + P + P + P + P + P,
      P + J + V + V + V + V + P,
      P + P + E + P + E + P + P,
      P + V + V + V + V + V + P,
      P + E + P + V + P + E + P,
      P + V + V + V + V + V + P,
      P + P + P + P + P + P + P,
    ]);
  }
}

export class Sala2 extends SalaBase {
  constructor() {
    super([
      P + P + P + P + P,
      P + J + V + V + P,
      P + V + E + V + P,
      P + V + V + V + P,
      P + P + P + P + P,
    ]);
  }
}