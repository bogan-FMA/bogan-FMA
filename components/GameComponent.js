import { useEffect, useState } from 'react';

const GameComponent = () => {
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    // 这里放置所有使用浏览器API的游戏逻辑
    // 由于使用useEffect，这段代码只会在客户端执行，不会在服务器端运行
    
    // 示例游戏初始化代码
    const initGame = () => {
      // 游戏初始化逻辑
      console.log("游戏已初始化");
      setGameLoaded(true);
    };
    
    initGame();
    
    // 清理函数
    return () => {
      // 清理游戏资源
    };
  }, []);

  return (
    <div className="game-container">
      {gameLoaded ? (
        <p>游戏已加载</p>
      ) : (
        <p>正在加载游戏...</p>
      )}
      {/* 游戏界面元素 */}
    </div>
  );
};

export default GameComponent; 