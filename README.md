# BetBall 🎮  
A fun and interactive game platform built with React.js and Matter.js. The first game, **Pinball Challenge**, lets players compete by navigating their balls through a dynamic map filled with obstacles. The last ball to exit the map loses the game!  

## 🌟 Features  
- **Customizable Map**: Select different obstacle layouts.  
- **Player Interaction**: Add participants and shuffle their starting positions.  
- **Physics-Based Gameplay**: Uses Matter.js for realistic ball movement and collisions.  
- **Dynamic Obstacles**: Watch balls bounce and collide with various barriers.  

## 🚀 Demo  
Coming soon!  

## 🛠️ Tech Stack  
- **Frontend**: React.js  
- **Physics Engine**: Matter.js  
- **Styling**: CSS  

## 📂 Project Structure  
```plaintext
src/
├── components/
│   ├── UserPanel.js       // Player and map configuration
│   ├── GameCanvas.js      // Game rendering and mechanics
│   ├── Ball.js            // Ball rendering and movement
│   ├── Obstacle.js        // Obstacle rendering
├── physics/
│   ├── physicsEngine.js   // Physics calculations
│   └── collision.js       // Collision detection logic
├── App.js                 // Main application entry point
└── index.js               // React app bootstrap


# 핀볼 챌린지 🎮  
React.js와 Matter.js로 제작된 재미있고 인터랙티브한 게임 플랫폼입니다.  
첫 번째 게임인 **핀볼 챌린지**에서는 플레이어들이 공의 움직임을 지켜보며 가장 늦게 출구를 통과하는 공을 선택해 경쟁합니다.  

## 🌟 주요 기능  
- **맵 커스터마이징**: 다양한 장애물 레이아웃 선택 가능.  
- **참여자 추가**: 참가자 이름 추가 및 공의 초기 위치 섞기.  
- **물리 기반 게임**: Matter.js를 활용한 현실적인 공 움직임과 충돌 처리.  
- **동적 장애물**: 공이 장애물과 부딪히며 경로가 변화.  

## 🚀 데모  
준비 중입니다!  

## 🛠️ 기술 스택  
- **프론트엔드**: React.js  
- **물리 엔진**: Matter.js  
- **스타일링**: CSS  

## 📂 프로젝트 구조  
```plaintext
src/
├── components/
│   ├── UserPanel.js       // 플레이어 및 맵 설정 UI
│   ├── GameCanvas.js      // 게임 렌더링 및 메커니즘
│   ├── Ball.js            // 공 렌더링 및 움직임
│   ├── Obstacle.js        // 장애물 렌더링
├── physics/
│   ├── physicsEngine.js   // 물리 계산 처리
│   └── collision.js       // 충돌 감지 로직
├── styles/
│   ├── Global.css   // 스타일
├── App.js                 // 메인 애플리케이션 진입점
└── index.js               // React 앱 부트스트랩