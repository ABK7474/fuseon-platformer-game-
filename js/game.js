// Oyun değişkenleri
let canvas, ctx;
let player;
let enemies = [];
let collectibles = [];
let keys = {};
let score = 0;
let lives = 3;
let gameState = 'menu'; // 'menu', 'playing', 'skinSelector'

// Oyun başlatma
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    player = new Player(50, 400);
    
    // Düşmanları oluştur
    enemies = [
        new Enemy(200, 510),
        new Enemy(400, 510),
        new Enemy(600, 510)
    ];
    
    // Coinleri oluştur
    collectibles = [
        new Collectible(150, 450),
        new Collectible(300, 350),
        new Collectible(500, 400),
        new Collectible(700, 300)
    ];
    
    setupEventListeners();
    setupSkinSelector();
    gameLoop();
}

function setupEventListeners() {
    // Klavye kontrolleri
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // Menü butonları
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('skinButton').addEventListener('click', showSkinSelector);
    document.getElementById('backButton').addEventListener('click', showMenu);
}

function setupSkinSelector() {
    const skins = ['default', 'ninja', 'robot', 'fire', 'ice', 'forest'];
    const skinOptions = document.getElementById('skinOptions');
    
    skins.forEach(skin => {
        const div = document.createElement('div');
        div.className = 'skin-option';
        div.dataset.skin = skin;
        
        // Skin önizlemesi için canvas
        const preview = document.createElement('canvas');
        preview.width = 80;
        preview.height = 80;
        const previewCtx = preview.getContext('2d');
        
        // Mini karakter çiz
        drawSkinPreview(previewCtx, skin);
        div.appendChild(preview);
        
        div.addEventListener('click', () => {
            document.querySelectorAll('.skin-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            player.setSkin(skin);
        });
        
        skinOptions.appendChild(div);
    });
}

function drawSkinPreview(ctx, skinName) {
    const skins = {
        'default': { body: '#4ECDC4', clothes: '#FF6B6B' },
        'ninja': { body: '#2C3E50', clothes: '#34495E' },
        'robot': { body: '#95A5A6', clothes: '#3498DB' },
        'fire': { body: '#E74C3C', clothes: '#F39C12' },
        'ice': { body: '#3498DB', clothes: '#ECF0F1' },
        'forest': { body: '#27AE60', clothes: '#2ECC71' }
    };
    
    const skin = skins[skinName];
    
    // Mini karakter çiz
    ctx.fillStyle = skin.body;
    ctx.fillRect(20, 30, 40, 45);
    ctx.fillRect(25, 10, 30, 25);
    
    ctx.fillStyle = skin.clothes;
    ctx.fillRect(25, 35, 30, 15);
    
    // Gözler
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(28, 15, 8, 8);
    ctx.fillRect(44, 15, 8, 8);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(30, 17, 4, 4);
    ctx.fillRect(46, 17, 4, 4);
}

function startGame() {
    gameState = 'playing';
    document.getElementById('menu').classList.add('hidden');
    score = 0;
    lives = 3;
    updateUI();
}

function showSkinSelector() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('skinSelector').classList.remove('hidden');
}

function showMenu() {
    document.getElementById('skinSelector').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (gameState !== 'playing') return;
    
    player.update();
    
    enemies.forEach(enemy => {
        enemy.update();
        
        if (enemy.checkCollision(player)) {
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                // Karakteri başlangıç pozisyonuna geri gönder
                player.x = 50;
                player.y = 400;
            }
            updateUI();
        }
    });
    
    collectibles.forEach(collectible => {
        collectible.update();
        
        if (collectible.checkCollision(player)) {
            score += collectible.collect();
            updateUI();
        }
    });
}

function draw() {
    // Arka planı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState !== 'playing') return;
    
    // Platform çiz
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 540, 800, 60);
    
    // Nesneleri çiz
    collectibles.forEach(collectible => collectible.draw(ctx));
    enemies.forEach(enemy => enemy.draw(ctx));
    player.draw(ctx);
}

function updateUI() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
}

function gameOver() {
    alert(`Oyun Bitti! Skorun: ${score}`);
    showMenu();
    gameState = 'menu';
}

// Oyunu başlat
window.addEventListener('load', init);
