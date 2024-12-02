// src/physics/physicsEngine.js

// 전역 상수 정의
const PHYSICS_CONSTANTS = {
  GRAVITY: 0.3,
  AIR_RESISTANCE: 0.99,
  RESTITUTION: 0.7,
  MAX_SPEED: 15
};

// 공과 장애물 간의 충돌 감지 및 처리
export const setupCollisionEvents = (balls, obstacles) => {
  balls.forEach(ball => {
    if (!ball.isActive) return;
    
    obstacles.forEach(obstacle => {
      switch(obstacle.type) {
        case 'oscillating-horizontal':
        case 'oscillating-vertical':
        case 'bouncing':
        case 'rectangle':
          handleRectangleObstacleCollision(ball, obstacle);
          break;
          
        case 'triangle':
          handleTriangleObstacleCollision(ball, obstacle);
          break;
          
        case 'circular':
        case 'spinning-circle':
          handleCircularObstacleCollision(ball, obstacle);
          break;
          
        case 'rotating':
        case 'rotating-stick':
          handleRotatingObstacleCollision(ball, obstacle);
          break;
      }
    });
  });
};

// 회전하는 장애물과의 충돌 처리
const handleRotatingObstacleCollision = (ball, obstacle) => {
  // 회전된 좌표계로 변환
  const cos = Math.cos(-obstacle.angle);
  const sin = Math.sin(-obstacle.angle);
  
  const relativeX = ball.x - (obstacle.x + obstacle.width/2);
  const relativeY = ball.y - (obstacle.y + obstacle.height/2);
  
  const rotatedX = relativeX * cos - relativeY * sin;
  const rotatedY = relativeX * sin + relativeY * cos;

  // 회전된 좌표계에서 충돌 검사
  const halfWidth = obstacle.width / 2;
  const halfHeight = obstacle.height / 2;
  
  if (Math.abs(rotatedX) < halfWidth + ball.radius &&
      Math.abs(rotatedY) < halfHeight + ball.radius) {
    
    // 충돌 응답
    const restitution = 0.7;
    
    // 충돌 법선 벡터 계산
    let normalX = 0;
    let normalY = 0;
    
    if (Math.abs(rotatedX) / halfWidth > Math.abs(rotatedY) / halfHeight) {
      normalX = rotatedX > 0 ? 1 : -1;
    } else {
      normalY = rotatedY > 0 ? 1 : -1;
    }
    
    // 회전된 법선 벡터를 원래 좌표계로 변환
    const worldNormalX = normalX * cos + normalY * sin;
    const worldNormalY = -normalX * sin + normalY * cos;
    
    // 속도 업데이트
    const dotProduct = (ball.velocityX * worldNormalX + ball.velocityY * worldNormalY);
    
    ball.velocityX = ball.velocityX - (1 + restitution) * dotProduct * worldNormalX;
    ball.velocityY = ball.velocityY - (1 + restitution) * dotProduct * worldNormalY;
    
    // 장애물의 회전 효과 추가
    const rotationalEffect = obstacle.rotationSpeed * 5;
    ball.velocityX += rotationalEffect * -worldNormalY;
    ball.velocityY += rotationalEffect * worldNormalX;
  }
};

// 진동하는 장애물 충돌 처리
const handleOscillatingObstacleCollision = (ball, obstacle) => {
  // 장애물의 현재 위치 기준으로 충돌 박스 계산
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleTop = obstacle.y;
  const obstacleBottom = obstacle.y + obstacle.height;
  
  // 공의 경계 계산
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;

  // 충돌 감지
  if (ballRight > obstacleLeft && 
      ballLeft < obstacleRight && 
      ballBottom > obstacleTop && 
      ballTop < obstacleBottom) {
    
    // 충돌 방향 결정
    const overlapX = Math.min(ballRight - obstacleLeft, obstacleRight - ballLeft);
    const overlapY = Math.min(ballBottom - obstacleTop, obstacleBottom - ballTop);

    // 더 작은 겹침을 기준으로 충돌 방향 결정
    if (overlapX < overlapY) {
      // 수평 충돌
      if (ball.x < obstacle.x + obstacle.width / 2) {
        ball.x = obstacleLeft - ball.radius;
        ball.velocityX = -Math.abs(ball.velocityX) * 0.8;
      } else {
        ball.x = obstacleRight + ball.radius;
        ball.velocityX = Math.abs(ball.velocityX) * 0.8;
      }
    } else {
      // 수직 충돌
      if (ball.y < obstacle.y + obstacle.height / 2) {
        ball.y = obstacleTop - ball.radius;
        ball.velocityY = -Math.abs(ball.velocityY) * 0.8;
      } else {
        ball.y = obstacleBottom + ball.radius;
        ball.velocityY = Math.abs(ball.velocityY) * 0.8;
      }
    }

    // 장애물의 움직임을 공의 속도에 추가
    if (obstacle.type === 'oscillating-vertical') {
      ball.velocityY += obstacle.velocityY;
    } else if (obstacle.type === 'oscillating-horizontal') {
      ball.velocityX += obstacle.velocityX;
    }
  }
};

// 원형 장애물 충돌 처리
const handleCircularObstacleCollision = (ball, obstacle) => {
  const dx = ball.x - obstacle.x;
  const dy = ball.y - obstacle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = ball.radius + obstacle.radius;

  if (distance < minDistance) {
    // 충돌 발생
    const overlap = minDistance - distance;
    const normal = {
      x: dx / distance,
      y: dy / distance
    };

    // 위치 보정
    ball.x += overlap * normal.x;
    ball.y += overlap * normal.y;

    // 속도 반사
    const dotProduct = 
      ball.velocityX * normal.x + 
      ball.velocityY * normal.y;

    ball.velocityX = ball.velocityX - (1 + PHYSICS_CONSTANTS.RESTITUTION) * dotProduct * normal.x;
    ball.velocityY = ball.velocityY - (1 + PHYSICS_CONSTANTS.RESTITUTION) * dotProduct * normal.y;
  }
};

// 사각형 장애물 충돌 처리
const handleRectangleObstacleCollision = (ball, obstacle) => {
  // 사각형의 가장자리 좌표 계산
  const left = obstacle.x - obstacle.width / 2;
  const right = obstacle.x + obstacle.width / 2;
  const top = obstacle.y - obstacle.height / 2;
  const bottom = obstacle.y + obstacle.height / 2;

  // 공의 가장 가까운 점 찾기
  const closestX = Math.max(left, Math.min(ball.x, right));
  const closestY = Math.max(top, Math.min(ball.y, bottom));

  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ball.radius) {
    // 충돌 발생
    const overlap = ball.radius - distance;
    const normal = {
      x: dx / (distance || 1), // 0으로 나누기 방지
      y: dy / (distance || 1)
    };

    // 위치 보정
    ball.x += overlap * normal.x;
    ball.y += overlap * normal.y;

    // 속도 반사
    const dotProduct = 
      ball.velocityX * normal.x + 
      ball.velocityY * normal.y;

    ball.velocityX = ball.velocityX - (1 + PHYSICS_CONSTANTS.RESTITUTION) * dotProduct * normal.x;
    ball.velocityY = ball.velocityY - (1 + PHYSICS_CONSTANTS.RESTITUTION) * dotProduct * normal.y;
  }
};

// 삼각형 장애물 충돌 처리
const handleTriangleObstacleCollision = (ball, obstacle) => {
  // 삼각형의 세 점 계산
  const topPoint = { x: obstacle.x, y: obstacle.y - obstacle.height/2 };
  const leftPoint = { x: obstacle.x - obstacle.width/2, y: obstacle.y + obstacle.height/2 };
  const rightPoint = { x: obstacle.x + obstacle.width/2, y: obstacle.y + obstacle.height/2 };

  // 삼각형의 세 변에 대한 충돌 검사
  const edges = [
    { start: topPoint, end: leftPoint },
    { start: leftPoint, end: rightPoint },
    { start: rightPoint, end: topPoint }
  ];

  for (const edge of edges) {
    // 선분과 공 사이의 최단 거리 계산
    const edgeVector = {
      x: edge.end.x - edge.start.x,
      y: edge.end.y - edge.start.y
    };
    
    const ballToStart = {
      x: ball.x - edge.start.x,
      y: ball.y - edge.start.y
    };

    const edgeLength = Math.sqrt(edgeVector.x * edgeVector.x + edgeVector.y * edgeVector.y);
    const normalizedEdge = {
      x: edgeVector.x / edgeLength,
      y: edgeVector.y / edgeLength
    };

    const projection = ballToStart.x * normalizedEdge.x + ballToStart.y * normalizedEdge.y;
    const projectionPoint = {
      x: edge.start.x + normalizedEdge.x * Math.max(0, Math.min(edgeLength, projection)),
      y: edge.start.y + normalizedEdge.y * Math.max(0, Math.min(edgeLength, projection))
    };

    const distance = Math.sqrt(
      Math.pow(ball.x - projectionPoint.x, 2) + 
      Math.pow(ball.y - projectionPoint.y, 2)
    );

    if (distance < ball.radius) {
      // 충돌 발생
      const overlap = ball.radius - distance;
      const normal = {
        x: (ball.x - projectionPoint.x) / distance,
        y: (ball.y - projectionPoint.y) / distance
      };

      // 공의 위치 조정
      ball.x += overlap * normal.x;
      ball.y += overlap * normal.y;

      // 반사 벡터 계산
      const dotProduct = 
        ball.velocityX * normal.x + 
        ball.velocityY * normal.y;

      const restitution = PHYSICS_CONSTANTS.RESTITUTION;

      // 속도 업데이트
      ball.velocityX = ball.velocityX - (1 + restitution) * dotProduct * normal.x;
      ball.velocityY = ball.velocityY - (1 + restitution) * dotProduct * normal.y;

      // 마찰 효과 추가
      const friction = 0.8;
      ball.velocityX *= friction;
      ball.velocityY *= friction;
    }
  }
};

// 공과 장애물의 충돌 여부를 판단하는 함수 (직선 거리 기준)
const isCollision = (ball, obstacle) => {
  if (obstacle.type === 'rotating') {
    // 회전된 좌표계로 변환
    const rotatedX = Math.cos(-obstacle.angle) * (ball.x - obstacle.x) - 
                     Math.sin(-obstacle.angle) * (ball.y - obstacle.y) + obstacle.x;
    const rotatedY = Math.sin(-obstacle.angle) * (ball.x - obstacle.x) + 
                     Math.cos(-obstacle.angle) * (ball.y - obstacle.y) + obstacle.y;

    // 회전된 좌표계에서 충돌 검사
    const halfWidth = obstacle.width / 2;
    const halfHeight = obstacle.height / 2;
    
    return rotatedX >= obstacle.x - halfWidth &&
           rotatedX <= obstacle.x + halfWidth &&
           rotatedY >= obstacle.y - halfHeight &&
           rotatedY <= obstacle.y + halfHeight;
  }
  // 원형 장애물과 공의 충돌 감지
  if (obstacle.type === 'circular') {
    const distX = Math.abs(ball.x - obstacle.x);
    const distY = Math.abs(ball.y - obstacle.y);
    
    if (distX > (obstacle.radius + ball.radius)) return false;
    if (distY > (obstacle.radius + ball.radius)) return false;
    
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < ball.radius + obstacle.radius;
  }

  return false;
};


// 물리 엔진 설정: 중력 적용 및 장애물 이동
export const setupWorld = (balls, obstacles, canvasHeight) => {
  const { GRAVITY, AIR_RESISTANCE, MAX_SPEED } = PHYSICS_CONSTANTS;

  balls.forEach(ball => {
    if (!ball.isActive) return;  // 비활성화된 공은 처리하지 않음

    // 중력 적용
    ball.velocityY += GRAVITY;

    // 속도 제한
    ball.velocityX = Math.min(Math.max(ball.velocityX, -MAX_SPEED), MAX_SPEED);
    ball.velocityY = Math.min(Math.max(ball.velocityY, -MAX_SPEED), MAX_SPEED);

    // 공기 저항
    ball.velocityX *= AIR_RESISTANCE;
    ball.velocityY *= AIR_RESISTANCE;

    // 위치 업데이트
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // 화면 경계 충돌 처리
    if (ball.y + ball.radius > canvasHeight) {
      ball.y = canvasHeight - ball.radius;
      ball.velocityY = -ball.velocityY * PHYSICS_CONSTANTS.RESTITUTION;
    }

    if (ball.x + ball.radius > 1100) {
      ball.x = 1100 - ball.radius;
      ball.velocityX = -ball.velocityX * PHYSICS_CONSTANTS.RESTITUTION;
    } else if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.velocityX = -ball.velocityX * PHYSICS_CONSTANTS.RESTITUTION;
    }
  });

  obstacles.forEach(obstacle => {
    obstacle.move();
  });
};

// Obstacle 클래스에 속도 정보 추가
class Obstacle {
  constructor(x, y, width, height, color, type, speed = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.speed = speed;
    this.angle = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.originalY = y;
    this.originalX = x;
  }

  move() {
    switch(this.type) {
      case 'oscillating-vertical':
        this.y = this.originalY + Math.sin(Date.now() * 0.003) * 50;
        this.velocityY = Math.cos(Date.now() * 0.003) * 50 * 0.003;
        break;
        
      case 'oscillating-horizontal':
        this.x = this.originalX + Math.sin(Date.now() * 0.003) * 50;
        this.velocityX = Math.cos(Date.now() * 0.003) * 50 * 0.003;
        break;
        
      case 'rotating':
      case 'rotating-stick':
        this.angle += this.speed;
        break;
    }
  }
}
