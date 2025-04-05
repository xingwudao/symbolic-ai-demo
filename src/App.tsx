import React from 'react';
import GameBoard from './components/GameBoard';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>家庭关系推理游戏</h1>
        <p>通过符号推理来理解家庭成员之间的关系</p>
      </header>
      <main>
        <GameBoard />
      </main>
    </div>
  );
};

export default App; 