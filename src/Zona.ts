import { Actor, CollisionType, vec, Engine, Scene } from 'excalibur';
import { TILE } from '../config';
import { sprites } from '../sprites';
import { Player } from './Player';

export type TipoZona = 'agua' | 'espinho' | 'erva' | 'porta';

export interface OpcoesZona {
  tipo: TipoZona;
  coluna: number;
  linha: number;
  destino?: string;
  spawn?: 'norte' | 'sul' | 'leste' | 'oeste';
  aoEntrar?: (jogador: Player, scene: Scene) => void;
}

export class Zona extends Actor {
  private timerDano = 0;
  private dentro = false;

  constructor(private cfg: OpcoesZona) {
    super({
      pos: vec(cfg.coluna * TILE, cfg.linha * TILE),
      width: TILE,
      height: TILE,
      collisionType: CollisionType.Passive,
      z: cfg.tipo === 'porta' ? 5 : 3,
    });

    this.addTag('zona');
    this.addTag(`zona:${cfg.tipo}`);

    const chaveVisual = cfg.tipo === 'porta' ? 'flor' : cfg.tipo;
    this.graphics.use(sprites.obter('zona', chaveVisual));

    this.on('collisionstart', (evt) => {
      if (!(evt.other.owner instanceof Player)) return;
      this.dentro = true;
      this.aoEntrar(evt.other.owner, evt.other.owner.scene as Scene);
    });

    this.on('collisionend', (evt) => {
      if (!(evt.other.owner instanceof Player)) return;
      this.dentro = false;
      this.aoSair(evt.other.owner);
    });
  }

  private aoEntrar(jogador: Player, scene: Scene) {
    switch (this.cfg.tipo) {
      case 'agua':
        jogador.aplicarLentidao(0.5);
        break;
      case 'erva':
        jogador.curar(10);
        this.kill(); // erva some
        break;
      case 'espinho':
        this.timerDano = 0;
        break;
      case 'porta':
        if (this.cfg.destino) {
          this.trocarSala(scene.engine, scene, this.cfg.destino, this.cfg.spawn);
        }
        break;
    }
    this.cfg.aoEntrar?.(jogador, scene);
  }

  private aoSair(jogador: Player) {
    if (this.cfg.tipo === 'agua') jogador.removerLentidao();
  }

  onPostUpdate(_engine: Engine, delta: number) {
    if (this.cfg.tipo !== 'espinho' || !this.dentro) return;
    this.timerDano += delta;
    if (this.timerDano >= 500) {
      this.timerDano = 0;
      const jogador = this.scene?.actors.find(a => a instanceof Player) as Player | undefined;
      jogador?.receberDano(5, this.scene?.engine);
    }
  }

  private trocarSala(engine: Engine, scene: Scene, destino: string, spawn?: string) {
    if ((scene as any).__trocandoSala) return;
    (scene as any).__trocandoSala = true;

    console.log(`[Zona] trocando para sala "${destino}" (spawn ${spawn})`);

    const SalaCls = (globalThis as any).__registroSalas?.[destino];
    if (!SalaCls) {
      console.warn(`[Zona] sala "${destino}" não registrada.`);
      (scene as any).__trocandoSala = false;
      return;
    }

    const novaSala = new SalaCls();
    (novaSala as any).__spawnLado = spawn;

    const chave = `sala:${destino}:${Date.now()}`;
    engine.addScene(chave, novaSala);
    engine.goToScene(chave);
  }
}