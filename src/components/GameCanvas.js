// src/components/GameCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import Ball from './Ball'; 
import { setupWorld, setupCollisionEvents } from '../physics/physicsEngine';
import { getRandomColor } from '../utils';
 
const GameCanvas = ({ players = [], obstacles = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [balls, setBalls] = useState([]);
  const cameraYRef = useRef(0);
  
  const CANVAS_WIDTH = 1100;
  const CANVAS_HEIGHT = 3000;
  const VIEWPORT_HEIGHT = window.innerHeight;
  const MAX_VELOCITY = 15; // 최대 속도 제한

  useEffect(() => {
    if (players.length > 0) {
      const newBalls = players.map((player, index) => {
        return new Ball(
          50 + (index * 60),  // x 위치
          50,                 // y 위치
          10,                // 반지름
          getRandomColor(),  // 색상
          player.name,       // 플레이어 이름
          player.isActive    // 활성화 상태
        );
      });
      
      setBalls(newBalls);
    }
  }, [players]);  // players가 변경될 때만 실행

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let animationFrameId;

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 그리드 그리기
      drawGrid(ctx);
      
      // 공 그리기 (중복 체크)
      const drawnNames = new Set();
      balls.forEach(ball => {
        if (!drawnNames.has(ball.name)) {
          ball.draw(ctx);
          drawnNames.add(ball.name);
        }
      });

      // 물리 엔진 업데이트
      setupWorld(balls, obstacles, CANVAS_HEIGHT);
      setupCollisionEvents(balls, obstacles);

      // 카메라 추적 로직
      const activeBalls = balls.filter(ball => ball.isActive && !ball.finished);
      
      if (activeBalls.length > 0) {
        const lowestBall = activeBalls.reduce((lowest, current) => 
          current.y > lowest.y ? current : lowest
        , activeBalls[0]);

        const targetY = Math.max(0, 
          Math.min(lowestBall.y - (VIEWPORT_HEIGHT / 3), 
          CANVAS_HEIGHT - VIEWPORT_HEIGHT)
        );

        cameraYRef.current += (targetY - cameraYRef.current) * 0.05;
      }

      // 렌더링
      ctx.save();
      ctx.translate(0, -cameraYRef.current);

      // 배경 그리드
      drawGrid(ctx);

      // 장애물 그리기
      obstacles.forEach(obstacle => {
        obstacle.move();
        obstacle.draw(ctx);
      });

      // 공 그리기
      balls.forEach(ball => {
        if (ball && ball.draw) {
          ball.draw(ctx);
          // 디버깅용 로그
          console.log(`Ball ${ball.name}: x=${ball.x}, y=${ball.y}, active=${ball.isActive}`);
        }
      });

      // 출구 그리기
      drawExit(ctx);

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [balls, obstacles]);  // balls와 obstacles가 변경될 때마다 실행

  // 출구 그리기 함수
  const drawExit = (ctx) => {
    const exitWidth = 100;
    const exitHeight = 20;
    const exitX = (1100 - exitWidth) / 2;
    const exitY = 2950;  // CANVAS_HEIGHT - 50

    ctx.fillStyle = 'green';
    ctx.fillRect(exitX, exitY, exitWidth, exitHeight);
  };

  // 그리드 그리기 함수
  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    
    // 세로선
    for (let x = 0; x < 1100; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 3000);
      ctx.stroke();
    }
    
    // 가로선
    for (let y = 0; y < 3000; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1100, y);
      ctx.stroke();
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${VIEWPORT_HEIGHT}px`,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          transform: `translateY(-${cameraYRef.current}px)`,
          top: 0,
          left: 0
        }}
      />
    </div>
  );
};

export default GameCanvas;
