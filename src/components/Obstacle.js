// src/components/Obstacle.js
export class Obstacle {
    constructor(type, x, y, size) {
      this.type = type; // 'rect' 또는 'circle'
      this.x = x;
      this.y = y;
      this.size = size; // 직사각형일 때 { width, height }, 원일 때 radius
    }
  
    // 장애물 그리기
    draw(ctx) {
      ctx.fillStyle = this.type === 'rect' ? 'black' : 'orange';
  
      if (this.type === 'rect') {
        ctx.fillRect(this.x, this.y, this.size.width, this.size.height); // 직사각형
      } else if (this.type === 'circle') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size.radius, 0, Math.PI * 2); // 원
        ctx.fill();
      }
    }
  
    // 충돌 감지
    checkCollision(ball) {
      if (this.type === 'rect') {
        // 직사각형과 충돌
        return ball.x + ball.radius > this.x &&
               ball.x - ball.radius < this.x + this.size.width &&
               ball.y + ball.radius > this.y &&
               ball.y - ball.radius < this.y + this.size.height;
      } else if (this.type === 'circle') {
        // 원과 충돌
        const distX = ball.x - this.x;
        const distY = ball.y - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < ball.radius + this.size.radius;
      }
      return false;
    }
  }
  