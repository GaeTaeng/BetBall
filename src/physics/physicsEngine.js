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
        // 장애물 종류에 따라 충돌 처리 다르게 적용
        if (obstacle.type === 'rotating') {
          handleRotatingObstacleCollision(ball, obstacle);  // 회전 장애물과 충돌 처리
        } else if (obstacle.type === 'circular') {
          handleCircularObstacleCollision(ball, obstacle);  // 원형 장애물과 충돌 처리
        }
      }
    });
  });
};

// 원형 장애물과 공의 충돌 처리
const handleCircularObstacleCollision = (ball, obstacle) => {
  const distX = ball.x - obstacle.x;
  const distY = ball.y - obstacle.y;
  const distance = Math.sqrt(distX * distX + distY * distY);
  
  if (distance < ball.radius + obstacle.radius) {
    // 충돌 시 각도 계산 (공과 장애물의 벡터 차이)
    const angle = Math.atan2(distY, distX);
    const speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
    
    // 공의 속도를 반사시키는 방식
    const reflectAngle = 2 * angle - Math.atan2(ball.velocityY, ball.velocityX);
    ball.velocityX = speed * Math.cos(reflectAngle);
    ball.velocityY = speed * Math.sin(reflectAngle);
    
    // 튕겨나가는 방향에 속도 감소 적용
    ball.velocityX *= 0.9;  // 튕길 때 속도 약간 감소
    ball.velocityY *= 0.9;
  }
};

// 회전하는 장애물과 공의 충돌 처리
const handleRotatingObstacleCollision = (ball, obstacle) => {
  const distX = ball.x - obstacle.x;
  const distY = ball.y - obstacle.y;
  const distance = Math.sqrt(distX * distX + distY * distY);
  
  if (distance < ball.radius + obstacle.radius) {
    // 장애물의 회전 각도와 공의 충돌 각도 계산
    const angle = Math.atan2(distY, distX);
    const speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
    
    // 공의 속도를 반사시키는 방식 (회전하는 장애물의 각도에 맞게 반사)
    const reflectAngle = 2 * angle - Math.atan2(ball.velocityY, ball.velocityX);
    
    // 장애물의 회전 속도 영향을 고려하여 공의 속도를 조정
    const adjustedSpeed = speed * 0.9;  // 속도 감소
    ball.velocityX = adjustedSpeed * Math.cos(reflectAngle + obstacle.rotationSpeed);
    ball.velocityY = adjustedSpeed * Math.sin(reflectAngle + obstacle.rotationSpeed);
    
    // 튕길 때 속도 감소
    ball.velocityX *= 0.9;
    ball.velocityY *= 0.9;
  }
};

// 공과 장애물의 충돌 여부를 판단하는 함수 (직선 거리 기준)
const isCollision = (ball, obstacle) => {
  const distX = Math.abs(ball.x - obstacle.x);
  const distY = Math.abs(ball.y - obstacle.y);

  // 장애물과 공의 크기를 고려한 충돌 감지 (원형 장애물에 대해 공이 겹치는지 확인)
  if (distX > (obstacle.radius + ball.radius)) return false;
  if (distY > (obstacle.radius + ball.radius)) return false;

  // 원형 장애물과 공의 충돌 감지 (원형과 원형이 겹치는지 확인)
  const distance = Math.sqrt(distX * distX + distY * distY);
  if (distance < ball.radius + obstacle.radius) return true;

  return false;
};
