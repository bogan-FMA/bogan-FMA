import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/TankGame.module.css';

export default function TankGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小为窗口大小
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 20;
    canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight - 150;
    
    // 游戏变量
    let animationFrameId;
    let enemies = [];
    let bullets = [];
    let stars = [];
    
    // 创建玩家坦克
    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 80,
      width: 50,
      height: 50,
      color: '#4CAF50',
      speed: 5,
      direction: { left: false, right: false, up: false, down: false },
      shootCooldown: 0
    };
    
    // 创建初始星星
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1
      });
    }
    
    // 处理触摸控制
    const touchControls = document.querySelectorAll(`.${styles.control}`);
    
    const touchStartHandlers = {};
    const touchEndHandlers = {};
    
    touchControls.forEach(control => {
      const direction = control.getAttribute('data-direction');
      
      // 为每个按钮创建独立的处理函数
      touchStartHandlers[direction] = (e) => {
        e.preventDefault();
        if (direction === 'fire') {
          shoot();
        } else {
          player.direction[direction] = true;
        }
      };
      
      touchEndHandlers[direction] = (e) => {
        e.preventDefault();
        if (direction !== 'fire') {
          player.direction[direction] = false;
        }
      };
      
      // 添加事件监听器
      control.addEventListener('touchstart', touchStartHandlers[direction]);
      control.addEventListener('mousedown', touchStartHandlers[direction]);
      
      if (direction !== 'fire') {
        control.addEventListener('touchend', touchEndHandlers[direction]);
        control.addEventListener('mouseup', touchEndHandlers[direction]);
        control.addEventListener('mouseleave', touchEndHandlers[direction]);
      }
    });
    
    // 处理键盘控制
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          player.direction.left = true;
          break;
        case 'ArrowRight':
          player.direction.right = true;
          break;
        case 'ArrowUp':
          player.direction.up = true;
          break;
        case 'ArrowDown':
          player.direction.down = true;
          break;
        case ' ':
          shoot();
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          player.direction.left = false;
          break;
        case 'ArrowRight':
          player.direction.right = false;
          break;
        case 'ArrowUp':
          player.direction.up = false;
          break;
        case 'ArrowDown':
          player.direction.down = false;
          break;
      }
    });
    
    // 射击函数
    function shoot() {
      if (player.shootCooldown <= 0) {
        bullets.push({
          x: player.x + player.width / 2 - 5,
          y: player.y,
          width: 10,
          height: 20,
          color: '#FFC107',
          speed: 10
        });
        player.shootCooldown = 20;
      }
    }
    
    // 生成敌人
    function spawnEnemy() {
      if (Math.random() < 0.02) {
        const size = Math.random() * 20 + 30;
        enemies.push({
          x: Math.random() * (canvas.width - size),
          y: -size,
          width: size,
          height: size,
          color: '#F44336',
          speed: Math.random() * 2 + 1
        });
      }
    }
    
    // 更新游戏状态
    function update() {
      // 更新玩家位置
      if (player.direction.left && player.x > 0) {
        player.x -= player.speed;
      }
      if (player.direction.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }
      if (player.direction.up && player.y > 0) {
        player.y -= player.speed;
      }
      if (player.direction.down && player.y < canvas.height - player.height) {
        player.y += player.speed;
      }
      
      // 更新射击冷却
      if (player.shootCooldown > 0) {
        player.shootCooldown--;
      }
      
      // 更新子弹位置
      bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        
        // 移除超出屏幕的子弹
        if (bullet.y < -bullet.height) {
          bullets.splice(index, 1);
        }
      });
      
      // 更新敌人位置
      enemies.forEach((enemy, enemyIndex) => {
        enemy.y += enemy.speed;
        
        // 检测子弹和敌人的碰撞
        bullets.forEach((bullet, bulletIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            // 碰撞发生，移除子弹和敌人
            bullets.splice(bulletIndex, 1);
            enemies.splice(enemyIndex, 1);
            setScore(prevScore => prevScore + 10);
          }
        });
        
        // 检测玩家和敌人的碰撞
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          // 游戏结束
          setGameOver(true);
          cancelAnimationFrame(animationFrameId);
          
          // 移除事件监听器
          touchControls.forEach(control => {
            const direction = control.getAttribute('data-direction');
            control.removeEventListener('touchstart', touchStartHandlers[direction]);
            control.removeEventListener('mousedown', touchStartHandlers[direction]);
            
            if (direction !== 'fire') {
              control.removeEventListener('touchend', touchEndHandlers[direction]);
              control.removeEventListener('mouseup', touchEndHandlers[direction]);
              control.removeEventListener('mouseleave', touchEndHandlers[direction]);
            }
          });
          return;
        }
        
        // 移除超出屏幕的敌人
        if (enemy.y > canvas.height) {
          enemies.splice(enemyIndex, 1);
        }
      });
      
      // 更新星星位置
      stars.forEach((star, index) => {
        star.y += star.speed;
        
        // 重置超出屏幕的星星
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      // 生成新敌人
      spawnEnemy();
    }
    
    // 绘制游戏
    function draw() {
      // 清空画布
      ctx.fillStyle = '#000033';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      stars.forEach(star => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
      
      // 绘制玩家坦克
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // 绘制坦克炮塔
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(player.x + player.width / 2 - 5, player.y - 10, 10, 20);
      
      // 绘制子弹
      bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
      
      // 绘制敌人
      enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    }
    
    // 游戏循环
    function gameLoop() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // 开始游戏循环
    gameLoop();
    
    // 清理函数
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      // 移除事件监听器
      touchControls.forEach(control => {
        const direction = control.getAttribute('data-direction');
        control.removeEventListener('touchstart', touchStartHandlers[direction]);
        control.removeEventListener('mousedown', touchStartHandlers[direction]);
        
        if (direction !== 'fire') {
          control.removeEventListener('touchend', touchEndHandlers[direction]);
          control.removeEventListener('mouseup', touchEndHandlers[direction]);
          control.removeEventListener('mouseleave', touchEndHandlers[direction]);
        }
      });
    };
  }, [gameStarted]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>坦克传奇之战争机器</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <h1 className={styles.title}>坦克传奇之战争机器</h1>
      
      {!gameStarted && !gameOver && (
        <div className={styles.menu}>
          <h2>欢迎来到坦克世界！</h2>
          <p>驾驶你的坦克消灭敌人！</p>
          <button className={styles.button} onClick={startGame}>开始游戏</button>
        </div>
      )}
      
      {gameOver && (
        <div className={styles.menu}>
          <h2>游戏结束</h2>
          <p>你的得分: {score}</p>
          <button className={styles.button} onClick={startGame}>再玩一次</button>
        </div>
      )}
      
      {gameStarted && !gameOver && (
        <>
          <div className={styles.scoreBoard}>
            <p>得分: {score}</p>
          </div>
          
          <canvas ref={canvasRef} className={styles.canvas}></canvas>
          
          <div className={styles.controls}>
            <div className={styles.directionControls}>
              <button className={styles.control} data-direction="up">↑</button>
              <div className={styles.horizontalControls}>
                <button className={styles.control} data-direction="left">←</button>
                <button className={styles.control} data-direction="right">→</button>
              </div>
              <button className={styles.control} data-direction="down">↓</button>
            </div>
            
            <button className={`${styles.control} ${styles.fireButton}`} data-direction="fire">发射</button>
          </div>
        </>
      )}
    </div>
  );
} 