// src/App.js
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import UserPanel from './components/UserPanel';
import Obstacle from './components/Obstacle';
import { getRandomColor } from './utils';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [obstacles, setObstacles] = useState([
    new Obstacle(300, 300, 10, 100,getRandomColor(), 'rotating', 0.05), // 회전 장애물 예시
    new Obstacle(500, 400, 50, 10, getRandomColor(),'rotating', -0.01), // 반시계방향 회전 장애물
    new Obstacle(500, 300, 50, 10, getRandomColor(),'rotating', -0.01), // 반시계방향 회전 장애물
    new Obstacle(500, 500, 30, 10, getRandomColor(),'circular'),
  ]);

  const handleAddPlayer = (newPlayers) => {
    setPlayers(newPlayers);
  };

  const handleShuffle = () => {
    setPlayers(prevPlayers => [...prevPlayers].sort(() => Math.random() - 0.5));
  };

  const handleStart = () => {
    // 시작 버튼이 눌렸을 때 게임 시작
    console.log("게임 시작!");
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <UserPanel onAddPlayer={handleAddPlayer} onShuffle={handleShuffle} onStart={handleStart} />
      <GameCanvas players={players} obstacles={obstacles} />
    </div>
  );
};

export default App;
