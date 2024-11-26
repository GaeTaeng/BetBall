// src/components/Obstacle.js
class Obstacle {

    constructor(x, y, width, height, color, type, rotationSpeed = 0, angle = 0) {
        this.x = x;  // 장애물의 x 위치
        this.y = y;  // 장애물의 y 위치
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;  // 장애물 타입 ('rotating', 'circular' 등)
        this.rotationSpeed = rotationSpeed;  // 회전 속도 (회전 장애물에만 필요)
        this.angle = angle; // 장애물 회전 각도
      }
    


  
    // 장애물의 회전 동작을 업데이트하는 메서드 (회전 장애물)
    move() {
      if (this.type === 'rotating') {
        // 회전하는 장애물의 회전 속도에 맞게 회전 각도 업데이트
        this.angle = (this.angle || 0) + this.rotationSpeed;
      }
    }
  
    draw(ctx) {
      // 회전하는 장애물 그리기
      if (this.type === 'rotating') {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle || 0);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
      // 원형 장애물 그리기
      else if (this.type === 'circular') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    }
  }
  
  export default Obstacle;
  