// src/components/Ball.js
export class Ball {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = 20;
      this.color = color;
      this.velocity = { dx: 0, dy: 0 };
    }
  
    // 공 그리기
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.stroke();
    }
  
    // 공 위치 업데이트
    update() {
      this.y += this.velocity.dy;
      this.x += this.velocity.dx;
    }
  
    // 중력 적용
    applyGravity(gravity) {
      this.velocity.dy += gravity;
    }
  
    // 바닥에 닿았을 때
    handleFloorCollision(canvasHeight) {
      if (this.y >= canvasHeight - this.radius) {
        this.y = canvasHeight - this.radius; // 바닥에 닿으면 위치 고정
        this.velocity.dy = 0; // 속도 초기화
      }
    }
  
    // 공 위에 이름 그리기
    drawName(ctx, name) {
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(name, this.x - 20, this.y - 30); // 공 위에 이름
    }
  }
  