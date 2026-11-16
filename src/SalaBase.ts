import { Scene, SceneActivationContext, Vector, vec } from "excalibur";
import { Config } from "./config";
import { Parede } from "./Parede";
import { Porta } from "./porta";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { Hud } from "./hud";

export type Lado = "norte" | "sul" | "leste" | "oeste";

export interface DadosAtivacao {
  spawn?: Lado; // por qual lado da sala o jogador está entrando
}

const OPOSTO: Record<Lado, Lado> = { norte: "sul", sul: "norte", leste: "oeste", oeste: "leste" };

// Direção "para dentro" da sala a partir de cada porta
const PARA_DENTRO: Record<Lado, Vector> = {
  norte: vec(0, 1),
  sul: vec(0, -1),
  leste: vec(-1, 0),
  oeste: vec(1, 0),
};

const CHAR_PORTA: Record<string, Lado> = {
  [Config.TILE_PORTA_NORTE]: "norte",
  [Config.TILE_PORTA_SUL]: "sul",
  [Config.TILE_PORTA_LESTE]: "leste",
  [Config.TILE_PORTA_OESTE]: "oeste",
};

export abstract class SalaBase extends Scene<DadosAtivacao> {
  private trocando = false;

  constructor(
    private readonly mapa: string[],
    private readonly vizinhas: Partial<Record<Lado, string>>
  ) {
    super();
  }

  // onInitialize roda só 1x; onActivate roda a cada entrada na sala -> reconstrói tudo
  override onActivate(ctx: SceneActivationContext<DadosAtivacao>): void {
    this.trocando = false;
    this.construir(ctx.data?.spawn);
  }

  override onDeactivate(): void {
    this.clear();
  }

  private construir(spawn?: Lado): void {
    const T = Config.TileSize;
    const centro = (c: number, l: number) => vec((c + 0.5) * T, (l + 0.5) * T);

    let spawnPadrao = centro(2, 2);
    const inimigos: Vector[] = [];
    const portas: Record<Lado, Vector[]> = { norte: [], sul: [], leste: [], oeste: [] };

    for (let linha = 0; linha < this.mapa.length; linha++) {
      for (let coluna = 0; coluna < this.mapa[linha].length; coluna++) {
        const char = this.mapa[linha][coluna];

        if (char === Config.TILE_PAREDE) {
          this.add(new Parede(coluna, linha, false));
        } else if (char === Config.TILE_ELETRICA) {
          this.add(new Parede(coluna, linha, true));
        } else if (char === Config.TILE_JOGADOR) {
          spawnPadrao = centro(coluna, linha);
        } else if (char === Config.TILE_INIMIGO) {
          inimigos.push(centro(coluna, linha));
        } else if (char in CHAR_PORTA) {
          const lado = CHAR_PORTA[char];
          portas[lado].push(centro(coluna, linha));
          const destino = this.vizinhas[lado];
          if (destino) {
            this.add(new Porta(coluna, linha, () => this.trocarSala(destino, OPOSTO[lado])));
          } else {
            this.add(new Parede(coluna, linha, false)); // sem vizinha = parede
          }
        }
      }
    }

    // Posição inicial: no J do mapa, ou logo dentro da porta por onde entrou
    let posicao = spawnPadrao;
    if (spawn && portas[spawn].length > 0) {
      const soma = portas[spawn].reduce((a, b) => a.add(b), vec(0, 0));
      const media = soma.scale(1 / portas[spawn].length);
      posicao = media.add(PARA_DENTRO[spawn].scale(T * 2));
    }

    const player = new Player(posicao);
    this.add(player);
    inimigos.slice(0, Config.MaxEnemiesPerRoom).forEach((p) => this.add(new Enemy(p, player)));
    this.add(new Hud());
  }

  private trocarSala(destino: string, entrandoPor: Lado): void {
    if (this.trocando) return;
    this.trocando = true;
    this.engine.goToScene(destino, { sceneActivationData: { spawn: entrandoPor } });
  }
}