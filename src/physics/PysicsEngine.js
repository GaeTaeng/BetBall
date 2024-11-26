// src/physics/PhysicsEngine.js
import { Ball } from '../components/Ball';
import { Obstacle } from '../components/Obstacle';

export class PhysicsEngine {
  constructor(gravity = 0.1) {
    this.gravity = gravity;
    this.ballVelocities = [];
  }

  // 중력 적용
  applyGravity(balls) {
    balls.forEach(ball => {
      ball.applyGravity(this.gravity);
    });
  }

  // 충돌 처리 (공과 장애물)
  handleCollisions(balls, obstacles) {
    balls.forEach((ball, ballIndex) => {
      obstacles.forEach(obstacle => {
        if (obstacle.checkCollision(ball)) {
          // 공 튕기기
          ball.velocity.dy = -ball.velocity.dy;
          ball.handleFloorCollision(600); // 바닥에 닿았을 때 처리
        }
      });
    });
  }

  // 물리 엔진 업데이트
  updatePhysics(balls) {
    balls.forEach(ball => {
      ball.update();
      ball.handleFloorCollision(600);
    });
  }
}
