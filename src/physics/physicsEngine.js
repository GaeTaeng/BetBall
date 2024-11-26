// src/physics/physicsEngine.js
export const setupWorld = (balls, obstacles) => {
  balls.forEach(ball => {
    ball.velocityY += 0.2; // 중력 (y 방향 속도 증가)
  });

  obstacles.forEach(obstacle => {
    obstacle.move(); // 장애물 회전
  });
};

// 공과 장애물 간의 충돌 감지 및 처리
export const setupCollisionEvents = (balls, obstacles) => {
  balls.forEach(ball => {
    obstacles.forEach(obstacle => {
      if (isCollision(ball, obstacle)) {
        // 공이 장애물에 충돌했을 때 반사되는 효과를 적용
        ball.velocityY = -ball.velocityY; // y 방향 속도 반전 (위로 튕기기)
        ball.velocityX = -ball.velocityX; // x 방향 속도 반전 (좌우 튕기기)
        
        // 장애물 회전 속도를 고려한 처리 추가 가능
      }
    });
  });
};

// 공과 장애물의 충돌 여부를 판단하는 함수 (직선 거리 기준)
const isCollision = (ball, obstacle) => {
  const distX = Math.abs(ball.x - obstacle.x - obstacle.width / 2);
  const distY = Math.abs(ball.y - obstacle.y - obstacle.height / 2);

  // 장애물과 공의 크기를 고려한 충돌 감지 (사각형 장애물에 대해 공이 겹치는지 확인)
  if (distX > (obstacle.width / 2 + ball.radius)) return false;
  if (distY > (obstacle.height / 2 + ball.radius)) return false;

  return true;
};
