class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.onGround = false;
        this.skin = 'default';
        this.direction = 1; // 1: sağ, -1: sol
        
        // Animasyon için
        this.frame = 0;
        this.frameTimer = 0;
        this.isMoving = false;
    }

    update() {
        // Hareket kontrolü
        this.handleInput();
        
        // Fizik
        this.velocityY += 0.8; // Yerçekimi
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Zemin kontrolü
        if (this.y > 540 - this.height) {
            this.y = 540 - this.height;
            this.velocityY = 0;
            this.onGround = true;
        }
        
        // Ekran sınırları
        if (this.x < 0) this.x = 0;
        if (this.x > 800 - this.width) this.x = 800 - this.width;
        
        // Animasyon güncelleme
        this.updateAnimation();
    }

    handleInput() {
        this.velocityX = 0;
        this.isMoving = false;
        
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocityX = -this.speed;
            this.direction = -1;
            this.isMoving = true;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocityX = this.speed;
            this.direction = 1;
            this.isMoving = true;
        }
        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }
    }

    updateAnimation() {
        this.frameTimer++;
        if (this.frameTimer > 10) {
            this.frame = this.isMoving ? (this.frame + 1) % 4 : 0;
            this.frameTimer = 0;
        }
    }

    draw(ctx) {
        // Karakteri çiz (skin'e göre farklı renkler)
        ctx.save();
        
        // Yön değiştirme için flip
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, 0);
        } else {
            ctx.translate(this.x, 0);
        }
        
        this.drawSkin(ctx);
        ctx.restore();
    }

    drawSkin(ctx) {
        const skins = {
            'default': { body: '#4ECDC4', clothes: '#FF6B6B' },
            'ninja': { body: '#2C3E50', clothes: '#34495E' },
            'robot': { body: '#95A5A6', clothes: '#3498DB' },
            'fire': { body: '#E74C3C', clothes: '#F39C12' },
            'ice': { body: '#3498DB', clothes: '#ECF0F1' },
            'forest': { body: '#27AE60', clothes: '#2ECC71' }
        };
        
        const currentSkin = skins[this.skin] || skins['default'];
        
        // Vücut
        ctx.fillStyle = currentSkin.body;
        ctx.fillRect(0, this.y + 20, this.width, this.height - 20);
        
        // Kafa
        ctx.fillRect(5, this.y, this.width - 10, 25);
        
        // Kıyafet detayları
        ctx.fillStyle = currentSkin.clothes;
        ctx.fillRect(5, this.y + 25, this.width - 10, 15);
        
        // Gözler
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(8, this.y + 5, 6, 6);
        ctx.fillRect(this.width - 14, this.y + 5, 6, 6);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(10, this.y + 7, 2, 2);
        ctx.fillRect(this.width - 12, this.y + 7, 2, 2);
        
        // Animasyon efekti (zıplama sırasında)
        if (!this.onGround) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(-2, this.y + this.height, this.width + 4, 5);
        }
    }

    setSkin(skinName) {
        this.skin = skinName;
    }
}
