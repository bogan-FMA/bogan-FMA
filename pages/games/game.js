// 游戏状态
const gameState = {
    playerX: window.innerWidth / 2,
    playerY: window.innerHeight - 100,
    playerSpeed: 5,
    playerDirection: 0, // 角度，0表示向上
    score: 0,
    bullets: [],
    enemies: [],
    lastBulletTime: 0,
    bulletInterval: 500, // 每0.5秒发射一颗子弹
    gameOver: false
};

// 获取DOM元素
const playerTank = document.getElementById('player-tank');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');

// 设置玩家坦克位置
function updatePlayerPosition() {
    playerTank.style.left = `${gameState.playerX}px`;
    playerTank.style.transform = `rotate(${gameState.playerDirection}deg)`;
}

// 自动发射子弹
function fireBullet() {
    const now = Date.now();
    if (now - gameState.lastBulletTime > gameState.bulletInterval) {
        gameState.lastBulletTime = now;
        
        // 计算子弹发射位置和方向
        const angleRad = gameState.playerDirection * Math.PI / 180;
        const bulletX = gameState.playerX;
        const bulletY = gameState.playerY - 40;
        
        // 创建子弹元素
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = `${bulletX}px`;
        bullet.style.top = `${bulletY}px`;
        
        // 添加到游戏容器
        gameContainer.appendChild(bullet);
        
        // 添加到子弹数组
        gameState.bullets.push({
            element: bullet,
            x: bulletX,
            y: bulletY,
            speedX: Math.sin(angleRad) * 10,
            speedY: -Math.cos(angleRad) * 10
        });
    }
}

// 更新子弹位置
function updateBullets() {
    for (let i = 0; i < gameState.bullets.length; i++) {
        const bullet = gameState.bullets[i];
        
        // 更新子弹位置
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;
        
        // 更新DOM元素位置
        bullet.element.style.left = `${bullet.x}px`;
        bullet.element.style.top = `${bullet.y}px`;
        
        // 检查子弹是否超出屏幕
        if (bullet.y < 0 || bullet.y > window.innerHeight || 
            bullet.x < 0 || bullet.x > window.innerWidth) {
            // 移除子弹
            bullet.element.remove();
            gameState.bullets.splice(i, 1);
            i--;
            continue;
        }
        
        // 检查子弹是否击中敌人
        for (let j = 0; j < gameState.enemies.length; j++) {
            const enemy = gameState.enemies[j];
            
            // 简单碰撞检测
            if (bullet.x > enemy.x - 35 && bullet.x < enemy.x + 35 &&
                bullet.y > enemy.y - 20 && bullet.y < enemy.y + 20) {
                // 创建爆炸效果
                createExplosion(enemy.x, enemy.y);
                
                // 移除敌人
                enemy.element.remove();
                gameState.enemies.splice(j, 1);
                
                // 移除子弹
                bullet.element.remove();
                gameState.bullets.splice(i, 1);
                i--;
                
                // 增加分数
                gameState.score += 10;
                scoreElement.textContent = gameState.score;
                
                break;
            }
        }
    }
}

// 创建爆炸效果
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    
    gameContainer.appendChild(explosion);
    
    // 爆炸动画结束后移除元素
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

// 随机生成敌人
function spawnEnemy() {
    if (gameState.enemies.length < 5) {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * 200;
        
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;
        
        gameContainer.appendChild(enemy);
        
        gameState.enemies.push({
            element: enemy,
            x: x,
            y: y,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 1 + 0.5
        });
    }
}

// 更新敌人位置
function updateEnemies() {
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        
        // 更新敌人位置
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        
        // 边界检查，反弹
        if (enemy.x < 0 || enemy.x > window.innerWidth - 70) {
            enemy.speedX *= -1;
        }
        
        // 超出底部边界
        if (enemy.y > window.innerHeight) {
            enemy.element.remove();
            gameState.enemies.splice(i, 1);
            i--;
            continue;
        }
        
        // 更新DOM元素位置
        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
    }
}

// 键盘控制
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// 根据按键更新玩家状态
function handlePlayerMovement() {
    // 左右移动控制
    if (keys.ArrowLeft) {
        gameState.playerX -= gameState.playerSpeed;
        gameState.playerDirection = -90;
    }
    if (keys.ArrowRight) {
        gameState.playerX += gameState.playerSpeed;
        gameState.playerDirection = 90;
    }
    
    // 上下移动控制（如果需要）
    if (keys.ArrowUp) {
        gameState.playerDirection = 0;
    }
    if (keys.ArrowDown) {
        gameState.playerDirection = 180;
    }
    
    // 限制玩家不超出屏幕
    if (gameState.playerX < 40) {
        gameState.playerX = 40;
    }
    if (gameState.playerX > window.innerWidth - 40) {
        gameState.playerX = window.innerWidth - 40;
    }
    
    updatePlayerPosition();
}

// 游戏主循环
function gameLoop() {
    if (!gameState.gameOver) {
        handlePlayerMovement();
        fireBullet();  // 自动发射子弹
        updateBullets();
        updateEnemies();
        
        // 随机生成敌人
        if (Math.random() < 0.01) {
            spawnEnemy();
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// 初始化游戏
function initGame() {
    updatePlayerPosition();
    gameLoop();
}

// 启动游戏
window.addEventListener('load', initGame);

// 窗口大小变化时调整
window.addEventListener('resize', () => {
    gameState.playerY = window.innerHeight - 100;
    updatePlayerPosition();
}); 