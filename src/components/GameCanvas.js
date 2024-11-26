// src/components/GameCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import { Ball } from './Ball';
import { Obstacle } from './Obstacle';
import { PhysicsEngine } from '../physics/PysicsEngine';

const GameCanvas = ({ players, gameStarted }) => {
  const canvasRef = useRef(null);
  const [obstacles, setObstacles] = useState([]);
  const [balls, setBalls] = useState([]);
  const [ballColors, setBallColors] = useState([]);
  const physicsEngine = new PhysicsEngine();

  // 장애물 초기화
  const initializeObstacles = () => {
    const newObstacles = [
      new Obstacle('rect', 100, 150, { width: 50, height: 10 }),
      new Obstacle('circle', 250, 250, { radius: 25 }),
      new Obstacle('rect', 400, 350, { width: 80, height: 15 }),
      new Obstacle('circle', 600, 400, { radius: 30 }),
    ];
    setObstacles(newObstacles);
  };

  // 공 초기화
  const initializeBalls = () => {
    const initialBalls = players.map((_, index) => new Ball(50 + index * 100, 100, ballColors[index]));
    setBalls(initialBalls);
  };

  // 게임 시작 시 공 및 장애물 초기화
  useEffect(() => {
    if (gameStarted) {
      initializeBalls();
      initializeObstacles();
    }
  }, [gameStarted, players, ballColors]);

  // 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지운다

      // 장애물 그리기
      obstacles.forEach(obstacle => obstacle.draw(ctx));

      // 공 그리기
      balls.forEach((ball, index) => {
        ball.draw(ctx);
        ball.drawName(ctx, players[index]); // 공 위에 이름 표시
      });

      // 물리 엔진 업데이트 및 충돌 처리
      physicsEngine.applyGravity(balls);
      physicsEngine.handleCollisions(balls, obstacles);
      physicsEngine.updatePhysics(balls);
    };

    const gameInterval = setInterval(drawGame, 16); // 60fps로 게임을 그리기

    return () => clearInterval(gameInterval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [players, gameStarted, obstacles, balls]);

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="600" style={{ background: 'rgb(240, 240, 240)' }} />
    </div>
  );
};

export default GameCanvas;
