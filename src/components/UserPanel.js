// src/components/UserPanel.js
import React, { useState } from 'react';

const UserPanel = ({ onAddPlayer, onShuffle, onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  const handleAddPlayer = () => {
    if (playerName.trim() !== '') {
      setPlayers([...players, { name: playerName }]);
      onAddPlayer([...players, { name: playerName }]);
      setPlayerName('');
    }
  };

  const handleShuffle = () => {
    onShuffle();
  };

  const handleStart = () => {
    onStart();
  };

  return (
    <div>
      <h3>BetBall 설정</h3>
      <input
        type="text"
        placeholder="참여자 이름"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleAddPlayer}>참여자 추가</button>
      <br />
      <button onClick={handleShuffle}>섞기</button>
      <button onClick={handleStart}>시작</button>

      <div>
        <h4>참여자 목록</h4>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
