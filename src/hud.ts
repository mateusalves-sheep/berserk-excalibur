import { Actor, Collider, CollisionContact, Engine, Keys, Side, vec, Color, Vector, Label, Font} from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Player } from "./player";

export class Hud extends Label {
  
  constructor(direction : Vector, position : Vector) {
    
    super({
      pos: position,
      text: "",
      color: Color.Cyan

    });
    
  }

  override onInitialize() {
    
    
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {

  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {

  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {

  }
  
}
