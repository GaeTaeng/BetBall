// src/components/Obstacle.js
class Obstacle {
    constructor(x, y, width, height, color, rotationSpeed = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.rotationSpeed = rotationSpeed; // 회전 속도
      this.angle = 0; // 장애물 회전 각도
    }
  
    move() {
      this.angle += this.rotationSpeed; // 장애물 회전
    }
  
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }
  
  export default Obstacle;
  