import { Scene, Vector, Engine } from "excalibur";
import { Enemy } from "./enemy";
import { Config } from "./config";

export class EnemyTestScene extends Scene {
     override onInitialize(engine: Engine): void {
        super.onInitialize(engine);

        const enemy = new Enemy();
        enemy.pos = new Vector(Config.ScreenWidth / 2, Config.ScreenHeight / 2);

        this.add(enemy);
    }
}