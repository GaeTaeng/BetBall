import React, { useState } from 'react';
import UserPanel from './components/UserPanel';
import GameCanvas from './components/GameCanvas';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState(""); // 입력된 플레이어 이름
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 상태

  // 플레이어 이름 추가
  const addPlayer = () => {
    if (!playerName.trim()) return; // 공백 입력 방지
    setPlayers((prevPlayers) => [...prevPlayers, playerName]);
    setPlayerName(""); // 입력 필드 초기화
  };

  // 참여자 이름 업데이트
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const shufflePlayers = () => {
    setPlayers((prevPlayers) => [...prevPlayers].sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setGameStarted(true); // 게임 시작 상태로 변경
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <UserPanel
        playerName={playerName}
        handleNameChange={handleNameChange}
        addPlayer={addPlayer}
        players={players}
        onShuffle={shufflePlayers}
        onStart={startGame}
      />
      <GameCanvas players={players} gameStarted={gameStarted} />
    </div>
  );
};

export default App;
