class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 1;
        this.direction = 1;
        this.type = type;
        this.startX = x;
        this.patrolDistance = 100;
    }

    update() {
        // Devriye hareketi
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX - this.patrolDistance) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Gözler
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 5, this.y + 5, 5, 5);
        ctx.fillRect(this.x + 20, this.y + 5, 5, 5);
    }

    checkCollision(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}
