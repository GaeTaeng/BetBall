// src/App.js
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import UserPanel from './components/UserPanel';
import Obstacle from './components/Obstacle';
import { getRandomColor } from './utils';

const createRandomObstacles = () => {
  const obstacles = [];
  const types = [
    'rotating',
    'oscillating-horizontal',
    'oscillating-vertical',
    'circular',
    'spinning-circle',
    'triangle',
    'bouncing',
    'rotating-stick'
  ];

  const horizontalSections = 3;
  const verticalSections = 10;
  const sectionWidth = 1100 / horizontalSections;
  const sectionHeight = 3000 / verticalSections;
  const exitZoneStart = 2800;

  for(let i = 0; i < horizontalSections; i++) {
    for(let j = 0; j < verticalSections; j++) {
      const sectionY = j * sectionHeight;
      
      if (sectionY > exitZoneStart) continue;

      if(Math.random() > 0.3) {
        const type = types[Math.floor(Math.random() * types.length)];
        const x = (i * sectionWidth) + Math.random() * (sectionWidth - 100);
        const y = sectionY + Math.random() * (sectionHeight - 100);
        
        const baseAngle = (Math.random() - 0.5) * 0.5;
        
        let obstacle;
        
        switch(type) {
          case 'rotating':
            obstacle = new Obstacle(
              x, y,
              20 + Math.random() * 60,
              10 + Math.random() * 40,
              getRandomColor(),
              type,
              (Math.random() - 0.5) * 0.1,
              baseAngle
            );
            break;

          case 'circular':
            obstacle = new Obstacle(
              x, y,
              0, 0,
              getRandomColor(),
              type,
              0,
              baseAngle,
              15 + Math.random() * 20
            );
            break;

          case 'spinning-circle':
            obstacle = new Obstacle(
              x, y,
              0, 0,
              getRandomColor(),
              type,
              0.05 + Math.random() * 0.1,
              baseAngle,
              20 + Math.random() * 25
            );
            break;

          case 'oscillating-horizontal':
          case 'oscillating-vertical':
            obstacle = new Obstacle(
              x, y,
              30 + Math.random() * 40,
              10 + Math.random() * 20,
              getRandomColor(),
              type,
              0,
              baseAngle
            );
            break;

          case 'triangle':
            obstacle = new Obstacle(
              x, y,
              30 + Math.random() * 40,
              30 + Math.random() * 40,
              getRandomColor(),
              type,
              0,
              baseAngle
            );
            break;

          case 'bouncing':
            obstacle = new Obstacle(
              x, y,
              40 + Math.random() * 30,
              10 + Math.random() * 20,
              getRandomColor(),
              type,
              0,
              baseAngle
            );
            break;

          case 'rotating-stick':
            obstacle = new Obstacle(
              x, y,
              150 + Math.random() * 100,
              8 + Math.random() * 4,
              getRandomColor(),
              type,
              (Math.random() - 0.5) * 0.03,
              baseAngle
            );
            break;
        }
        
        obstacles.push(obstacle);
      }
    }
  }

  return obstacles;
};

const App = () => {
  const [players, setPlayers] = useState([]);
  const [obstacles, setObstacles] = useState(() => createRandomObstacles());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleAddPlayer = (newPlayer) => {
    if (players.length < 8) {
      setPlayers(prevPlayers => {
        // 중복 이름 처리를 위한 카운터
        const nameCount = prevPlayers.filter(p => 
          p.name.startsWith(newPlayer.name)
        ).length;

        // 중복된 이름이 있는 경우 번호 추가
        const uniqueName = nameCount > 0 
          ? `${newPlayer.name}(${nameCount + 1})` 
          : newPlayer.name;

        return [...prevPlayers, {
          ...newPlayer,
          name: uniqueName
        }];
      });
    }
  };

  const handleShuffle = () => {
    if (!isGameStarted) {
      setPlayers(prevPlayers => [...prevPlayers].sort(() => Math.random() - 0.5));
    }
  };

  const handleStart = () => {
    if (players.length >= 2) { // 최소 2명 이상일 때만 시작
      setIsGameStarted(true);
      setGameResult(null);
      setPlayers(prevPlayers => {
        return prevPlayers.map(player => ({
          ...player,
          isActive: true,
          score: 0
        }));
      });
    }
  };

  const handleReset = () => {
    setIsGameStarted(false);
    setGameResult(null);
    setObstacles(createRandomObstacles());
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => ({
        ...player,
        isActive: false,
        score: 0
      }));
    });
  };

  const handleFinish = (playerName) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player => {
        if (player.name === playerName) {
          return { ...player, finished: true };
        }
        return player;
      });
      
      // 모든 플레이어가 완주했는지 확인
      const allFinished = updatedPlayers.every(player => player.finished);
      if (allFinished) {
        const lastPlayer = updatedPlayers.find(player => 
          player.finished && player.finishTime === Math.max(...updatedPlayers.map(p => p.finishTime))
        );
        setGameResult(`${lastPlayer.name}가 패배했습니다!`);
      }
      
      return updatedPlayers;
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <UserPanel 
        onAddPlayer={handleAddPlayer} 
        onShuffle={handleShuffle} 
        onStart={handleStart}
        onReset={handleReset}
        isGameStarted={isGameStarted}
        gameResult={gameResult}
        players={players}
      />
      <GameCanvas 
        players={players} 
        obstacles={obstacles}
        onFinish={handleFinish}
        isGameStarted={isGameStarted}
      />
    </div>
  );
};

export default App;
