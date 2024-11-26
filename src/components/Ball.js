// src/components/Ball.js
class Ball {
  constructor(x, y, radius, color, name) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.velocityX = 2;  // 공의 x축 속도 (초기값)
    this.velocityY = 1;  // 공의 y축 속도 (초기값)
  }

  move() {
    this.y += this.velocityY; // 중력 효과로 y축 방향으로 속도 증가
    this.x += this.velocityX; // 공이 좌우로 움직임

    // 바닥에 부딪히면 반사되도록 (예시로 바닥 위치 600px로 설정)
    if (this.y + this.radius >= 600) {
      this.velocityY = -Math.abs(this.velocityY); // 아래로 튕겨나가도록 반사
    }

    // 왼쪽, 오른쪽 벽에 부딪히면 반사되도록 (가로 1100px 설정)
    if (this.x - this.radius <= 0 || this.x + this.radius >= 1100) {
      this.velocityX = -this.velocityX;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // 공 위에 이름을 표시
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(this.name, this.x - this.radius, this.y - this.radius - 5);
  }
}

export default Ball;
