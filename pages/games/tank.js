import dynamic from 'next/dynamic';

// 使用动态导入且禁用SSR
const TankGame = dynamic(() => import('../../components/TankGame'), {
  ssr: false,
});

const TankGamePage = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <TankGame />
    </div>
  );
};

export default TankGamePage; 