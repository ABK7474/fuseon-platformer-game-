class Collectible {
    constructor(x, y, type = 'coin') {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.collected = false;
        this.bobOffset = 0;
        this.rotation = 0;
    }

    update() {
        // Yüzen animasyon
        this.bobOffset += 0.1;
        this.rotation += 0.1;
    }

    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2 + Math.sin(this.bobOffset) * 3);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = '#F1C40F';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        ctx.fillStyle = '#F39C12';
        ctx.fillRect(-this.width/2 + 3, -this.height/2 + 3, this.width - 6, this.height - 6);
        
        ctx.restore();
    }

    checkCollision(player) {
        if (this.collected) return false;
        
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }

    collect() {
        this.collected = true;
        return this.type === 'coin' ? 10 : 50;
    }
}
