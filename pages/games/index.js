import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Games.module.css';

export default function Games() {
  return (
    <div className={styles.container}>
      <Head>
        <title>小游戏中心</title>
        <meta name="description" content="适合儿童的简单网页游戏" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>小游戏中心</h1>
        
        <div className={styles.grid}>
          <Link href="/games/tank" className={styles.card}>
            <h2>坦克传奇之战争机器 &rarr;</h2>
            <p>驾驶你的坦克消灭敌人！适合6岁以上小朋友。</p>
          </Link>
        </div>
        
        <div className={styles.backLink}>
          <Link href="/">返回博客首页</Link>
        </div>
      </main>
    </div>
  );
} 