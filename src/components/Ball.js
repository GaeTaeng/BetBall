// src/components/Ball.js
export default class Ball {
  constructor(x, y, radius, color, name, isActive) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.name = name;
    this.isActive = isActive;
    this.velocityX = 0;
    this.velocityY = 0;
    this.finished = false;
    this.initialX = x;
    this.initialY = y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // 이름 표시
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(this.name, this.x - this.radius, this.y - this.radius - 5);
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.finished = false;
    this.isActive = false;
  }
}
