// src/components/GameCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import Ball from './Ball';
import Obstacle from './Obstacle';
import { setupWorld, setupCollisionEvents } from '../physics/physicsEngine';

const ballColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700']; // 공 색상 배열

const GameCanvas = ({ players = [], obstacles = [] }) => {
  const canvasRef = useRef(null);
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    if (players.length > 0) {
      const newBalls = players.map((player, index) => {
        const ballColor = ballColors[index % ballColors.length];
        return new Ball(100 + index * 100, 0, 20, ballColor, player.name);
      });
      setBalls(newBalls);
    }
  }, [players]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const intervalId = setInterval(() => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      balls.forEach(ball => {
        ball.move();
        ball.draw(ctx);
      });

      obstacles.forEach(obstacle => {
        obstacle.draw(ctx);
      });

      setupCollisionEvents(balls, obstacles); // 충돌 처리
      setupWorld(balls, obstacles); // 물리 엔진 처리

    }, 1000 / 60); // 60 FPS

    return () => clearInterval(intervalId);
  }, [balls, obstacles]);

  return (
    <div>
      <canvas ref={canvasRef} width="1100" height="600"></canvas>
    </div>
  );
};

export default GameCanvas;
