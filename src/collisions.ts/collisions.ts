import { CollisionGroupManager } from 'excalibur';

export const CollisionGroups = {
  Player: CollisionGroupManager.create('player'),
  Enemy: CollisionGroupManager.create('enemy'),
  PlayerBullet: CollisionGroupManager.create('playerBullet'),
  EnemyBullet: CollisionGroupManager.create('enemyBullet'),
  Wall: CollisionGroupManager.create('wall'),
  Trap: CollisionGroupManager.create('trap')
};