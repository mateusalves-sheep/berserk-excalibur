import { Scene, Vector, Engine, Actor, Color, CollisionType } from "excalibur";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { Config } from "./config";
import { CollisionGroups } from "./collisions";

export class EnemyTestScene extends Scene {
  override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    // Adiciona uma parede de teste no cenário para validar a colisão física
    const wall = new Actor({
      pos: new Vector(200, 200),
      width: 64,
      height: 64,
      color: Color.Gray,
      collisionType: CollisionType.Fixed, // Fixa no lugar, não se move
      collisionGroup: CollisionGroups.Wall // Grupo correspondente de paredes
    });
    this.add(wall);

    // 1. Adiciona o Player na cena
    const player = new Player();
    player.pos = new Vector(Config.ScreenWidth / 4, Config.ScreenHeight / 2);
    this.add(player);

    // 2. Lista de posições de nascimento (Spawn Points) para vários inimigos
    const spawnPositions = [
      new Vector(Config.ScreenWidth * 0.75, Config.ScreenHeight * 0.2),
      new Vector(Config.ScreenWidth * 0.75, Config.ScreenHeight * 0.5),
      new Vector(Config.ScreenWidth * 0.75, Config.ScreenHeight * 0.8),
      new Vector(Config.ScreenWidth * 0.6, Config.ScreenHeight * 0.35)
    ];

    // 3. Instancia e adiciona cada inimigo na tela
    spawnPositions.forEach(pos => {
      const enemy = new Enemy();
      enemy.pos = pos;
      this.add(enemy);
    });

    // 4. Escuta o evento enemyDied para registrar a pontuação no console
    this.events.on("enemyDied", (data: { points: number }) => {
      console.log(`Inimigo eliminado! +${data.points} pontos contabilizados.`);
    });
  }
}