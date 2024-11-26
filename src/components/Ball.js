// src/components/Ball.js
class Ball {
  constructor(x, y, radius, color, name, isActive = false) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isActive = isActive;
    this.finished = false;
  }

  move() {
    if (!this.isActive) return; // 비활성화 상태면 움직이지 않음
    
    this.y += this.velocityY; // 중력 효과로 y축 방향으로 속도 증가
    this.x += this.velocityX; // 공이 좌우로 움직임
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
