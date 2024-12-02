// src/components/GameCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import map1 from './map/map1.png';
import map2 from './map/map2.png';
import map3 from './map/map3.png';
import Ball from './Ball'; 
import { setupWorld, setupCollisionEvents } from '../physics/physicsEngine';
import { getRandomColor } from '../utils';
 
const GameCanvas = ({ players = [], obstacles = [], isGameStarted }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [balls, setBalls] = useState([]);
  const cameraYRef = useRef(0);
  const [mapImage, setMapImage] = useState(null);
  const [mapHeight, setMapHeight] = useState(0);
  
  const CANVAS_WIDTH = 1100;
  const VIEWPORT_HEIGHT = window.innerHeight;
  const MAX_VELOCITY = 15; // 최대 속도 제한

  useEffect(() => {
    console.log('Creating balls for players:', players); // 디버깅용
    
    const newBalls = players.map((player, index) => {
      return new Ball(
        50 + (index * 60),
        50,
        10,
        getRandomColor(),
        player.name,
        player.isActive
      );
    });
    
    setBalls(newBalls);
  }, [players]);

  // 맵 이미지 로드 및 높이 설정
  useEffect(() => {
    const img = new Image();
    const randomMap = [map1, map2, map3][Math.floor(Math.random() * 3)];
    
    img.onload = () => {
      setMapImage(img);
      setMapHeight(img.height);
      
      // 캔버스 크기 조정
      if (canvasRef.current) {
        canvasRef.current.height = img.height;
      }
    };
    
    img.src = randomMap;
  }, []);

  // 게임 렌더링
  useEffect(() => {
    if (!mapImage || !isGameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = mapHeight;

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, mapHeight);
      
      // 배경 이미지 그리기
      ctx.save();
      ctx.translate(0, -cameraYRef.current);
      ctx.drawImage(mapImage, 0, 0);

      // 물리 엔진 업데이트
      if (isGameStarted) {
        setupWorld(balls, obstacles, mapHeight);
        setupCollisionEvents(balls, obstacles);
      }

      // 장애물 그리기
      obstacles.forEach(obstacle => {
        obstacle.move();
        obstacle.draw(ctx);
      });

      // 공 그리기
      balls.forEach(ball => {
        if (ball && ball.draw) {
          ball.draw(ctx);
        }
      });

      // 카메라 포커싱
      const activeBalls = balls.filter(ball => ball.isActive && !ball.finished);
      if (activeBalls.length > 0) {
        const lowestBall = activeBalls.reduce((lowest, current) => 
          current.y > lowest.y ? current : lowest
        , activeBalls[0]);

        const targetY = Math.max(0, 
          Math.min(lowestBall.y - (VIEWPORT_HEIGHT / 3), 
          mapHeight - VIEWPORT_HEIGHT)
        );

        cameraYRef.current += (targetY - cameraYRef.current) * 0.05;
      }

      ctx.restore();

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [balls, obstacles, mapImage, isGameStarted]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '1100px',
        height: `${window.innerHeight}px`,
        overflow: 'hidden',
        position: 'relative'
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
