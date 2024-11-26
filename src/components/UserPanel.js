import React from 'react';

const UserPanel = ({ playerName, handleNameChange, addPlayer, players, onShuffle, onStart }) => {
  return (
    <div style={{ padding: '20px', width: '300px', borderRight: '1px solid rgb(204, 204, 204)' }}>
      <h3>BetBall 설정</h3>
      
      {/* 참여자 이름 입력 필드 */}
      <input
        type="text"
        placeholder="참여자 이름"
        value={playerName}
        onChange={handleNameChange}
      />
      
      {/* 참여자 추가 버튼 */}
      <button onClick={addPlayer}>참여자 추가</button><br />
      
      {/* 플레이어 리스트 렌더링 */}
      <div>
        <h4>참여자 목록</h4>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>

      {/* 섞기 및 시작 버튼 */}
      <button onClick={onShuffle}>섞기</button>
      <button onClick={onStart}>시작</button>
    </div>
  );
};

export default UserPanel;
