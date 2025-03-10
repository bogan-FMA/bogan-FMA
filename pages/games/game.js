import dynamic from 'next/dynamic';

// 使用动态导入且禁用SSR
const GameComponent = dynamic(() => import('../../components/GameComponent'), {
  ssr: false,
});

const GamePage = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <GameComponent />
    </div>
  );
};

export default GamePage; 