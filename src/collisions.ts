import { CollisionGroup, CollisionGroupManager } from 'excalibur';

const collisor = {
  Player: 0b000001,
  Enemy: 0b000010,
  PlayerBullet: 0b000100,
  EnemyBullet: 0b001000,
  Wall: 0b010000,
  Door: 0b100000,
};


export const CollisionGroups = {
  Player: new CollisionGroup("player", collisor.Player, collisor.Enemy | collisor.EnemyBullet | collisor.Door | collisor.Wall),
  Enemy: new CollisionGroup("enemy", collisor.Enemy, collisor.Player | collisor.PlayerBullet | collisor.Wall | collisor.Enemy),
  PlayerBullet: new CollisionGroup("playerBullet", collisor.PlayerBullet, collisor.Enemy | collisor.Wall),
  EnemyBullet: new CollisionGroup("enemyBullet", collisor.EnemyBullet, collisor.Player | collisor.Wall),
  Wall: new CollisionGroup("wall", collisor.Wall, collisor.Enemy | collisor.Player | collisor.EnemyBullet | collisor.PlayerBullet),
  Door : new CollisionGroup("door", collisor.Wall, collisor.Player),
};