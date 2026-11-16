import { Config } from "./config";

export const Estado = {
  vida: Config.PlayerHealth,
  pontos: 0,
  reset(): void {
    this.vida = Config.PlayerHealth;
    this.pontos = 0;
  },
};