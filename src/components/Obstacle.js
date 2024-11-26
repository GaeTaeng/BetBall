// src/components/Obstacle.js
class Obstacle {

    constructor(x, y, width, height, color, type, rotationSpeed = 0, angle = 0, radius = null) {
        this.x = x;  // 장애물의 x 위치
        this.y = y;  // 장애물의 y 위치
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;  // 장애물 타입 ('rotating', 'circular' 등)
        this.rotationSpeed = rotationSpeed;  // 회전 속도 (회전 장애물에만 필요)
        this.angle = angle; // 장애물 회전 각도
        this.radius = radius; // 원형 장애물의 radius 속성 추가
        this.oscillationAmplitude = 50; // 진동 폭
        this.oscillationSpeed = 0.03;   // 진동 속도
        this.initialX = x;              // 초기 X 위치 저장
        this.initialY = y;              // 초기 Y 위치 저장
      }
    


  
    // 장애물의 회전 동작을 업데이트하는 메서드 (회전 장애물)
    move() {
      switch(this.type) {
        case 'rotating':
        case 'rotating-stick':
          this.angle += this.rotationSpeed;
          break;
        case 'oscillating-horizontal':
          this.x = this.initialX + Math.sin(Date.now() * this.oscillationSpeed) * this.oscillationAmplitude;
          break;
        case 'oscillating-vertical':
          this.y = this.initialY + Math.sin(Date.now() * this.oscillationSpeed) * this.oscillationAmplitude;
          break;
        case 'spinning-circle':
          this.angle += this.rotationSpeed;
          break;
        case 'bouncing':
          this.y = this.initialY + Math.abs(Math.sin(Date.now() * this.oscillationSpeed) * this.oscillationAmplitude);
          break;
      }
    }
  
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;

      switch(this.type) {
        case 'rotating':
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate(this.angle);
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          break;

        case 'oscillating-horizontal':
        case 'oscillating-vertical':
          ctx.fillRect(this.x, this.y, this.width, this.height);
          break;

        case 'circular':
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'spinning-circle':
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          // 원 안에 패턴 추가
          for(let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillRect(-this.radius/4, -this.radius/2, this.radius/2, this.radius/4);
          }
          break;

        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.height/2);
          ctx.lineTo(this.x - this.width/2, this.y + this.height/2);
          ctx.lineTo(this.x + this.width/2, this.y + this.height/2);
          ctx.closePath();
          ctx.fill();
          break;

        case 'bouncing':
          ctx.fillRect(this.x, this.y, this.width, this.height);
          break;

        case 'rotating-stick':
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate(this.angle);
          
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          
          ctx.beginPath();
          ctx.arc(-this.width / 2, 0, this.height / 2, 0, Math.PI * 2);
          ctx.arc(this.width / 2, 0, this.height / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
  }
  
  export default Obstacle;
  