// src/components/UserPanel.js
import React, { useState } from 'react';

const UserPanel = ({ 
  onAddPlayer, 
  onShuffle, 
  onStart, 
  onReset, 
  isGameStarted, 
  gameResult,
  players 
}) => {
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (playerName.trim() !== '' && !isGameStarted && players.length < 8) {
      const newPlayer = { 
        name: playerName.trim(),
        id: Date.now(),
        score: 0,
        isActive: false,
        finished: false
      };
      
      onAddPlayer(newPlayer);
      setPlayerName('');
    }
  };

  return (
    <div className="user-panel">
      <h3>BetBall 설정</h3>
      {!isGameStarted && (
        <>
          <input
            type="text"
            placeholder="참여자 이름 (2-8명)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
            disabled={players.length >= 8}
          />
          <button 
            onClick={handleAddPlayer}
            disabled={players.length >= 8}
          >
            참여자 추가
          </button>
          <button 
            onClick={onShuffle}
            disabled={players.length < 2}
          >
            섞기
          </button>
        </>
      )}
      
      <button 
        onClick={isGameStarted ? onReset : onStart}
        disabled={!isGameStarted && players.length < 2}
        className={isGameStarted ? 'reset-btn' : 'start-btn'}
      >
        {isGameStarted ? '초기화' : '시작'}
      </button>

      {gameResult && (
        <div className="game-result">
          {gameResult}
        </div>
      )}

      <div className="players-list">
        <h4>참여자 목록</h4>
        <ul>
          {players.map((player, index) => (
            <li key={index} className={player.finished ? 'finished' : ''}>
              {player.name} {player.finished && '(완주)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
