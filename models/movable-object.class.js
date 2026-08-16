/**
 * Represents a movable game object with movement,
 * gravity, collision and health functionality.
 */
class MovableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.6;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity and keeps the character on the ground.
     */
    applyGravity() {
        setInterval(() => {
            if (!this.isAboveGround() && this.speedY <= 0) return;

            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.keepCharacterOnGround();
        }, 1000 / 60);
    }

    /**
     * Keeps the character exactly on the ground.
     */
    keepCharacterOnGround() {
        if (!(this instanceof Character)) return;
        if (this.y < this.groundY) return;

        this.y = this.groundY;
        this.speedY = 0;
        this.isJumping = false;
    }

    /**
     * Checks whether the object is currently above the ground.
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) return true;
        if (this instanceof Character) return this.y < this.groundY;
        if (this instanceof Endboss) return this.y < this.groundY;

        return this.y < 180;
    }

    /**
     * Plays an animation using the provided image sequence.
     * @param {string[]} images - The animation image paths.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Checks whether two objects are colliding.
     * @param {MovableObject} mo - The object to check.
     * @returns {boolean} True if the objects collide.
     */
    isColliding(mo) {
        return this.x < mo.x + mo.width &&
            this.x + this.width > mo.x &&
            this.y < mo.y + mo.height &&
            this.y + this.height > mo.y;
    }

    /**
     * Checks precise collision with a collectible object.
     * @param {MovableObject} mo - The collectible object.
     * @returns {boolean} True if the objects are touching.
     */
    isCollecting(mo) {
        const character = this.getCharacterBounds();
        const object = this.getObjectBounds(mo);

        return character.left < object.right &&
            character.right > object.left &&
            character.top < object.bottom &&
            character.bottom > object.top;
    }

    /**
     * Creates a reduced collision box for the character.
     * @returns {Object} The character collision boundaries.
     */
    getCharacterBounds() {
        return {
            left: this.x + 40,
            right: this.x + this.width - 40,
            top: this.y + 35,
            bottom: this.y + this.height - 35
        };
    }

    /**
     * Creates a reduced collision box for a collectible.
     * @param {MovableObject} mo - The collectible object.
     * @returns {Object} The collectible collision boundaries.
     */
    getObjectBounds(mo) {
        return {
            left: mo.x + 18,
            right: mo.x + mo.width - 18,
            top: mo.y + 18,
            bottom: mo.y + mo.height - 18
        };
    }

    /**
     * Checks precise collision with an enemy.
     * @param {MovableObject} mo - The enemy object.
     * @returns {boolean} True if the objects collide.
     */
    isEnemyCollision(mo) {
        const character = this.getEnemyCharacterBounds();
        const enemy = this.getEnemyBounds(mo);

        return character.left < enemy.right &&
            character.right > enemy.left &&
            character.top < enemy.bottom &&
            character.bottom > enemy.top;
    }

    /**
     * Creates a reduced collision box for enemy collisions.
     * @returns {Object} The character collision boundaries.
     */
    getEnemyCharacterBounds() {
        return {
            left: this.x + 25,
            right: this.x + this.width - 25,
            top: this.y + 30,
            bottom: this.y + this.height - 20
        };
    }

    /**
     * Creates a reduced collision box for an enemy.
     * @param {MovableObject} mo - The enemy object.
     * @returns {Object} The enemy collision boundaries.
     */
    getEnemyBounds(mo) {
        return {
            left: mo.x + 8,
            right: mo.x + mo.width - 8,
            top: mo.y + 5,
            bottom: mo.y + mo.height - 5
        };
    }

    /**
     * Reduces energy and applies knockback after damage.
     */
    hit() {
        this.energy = Math.max(this.energy - 5, 0);
        this.lastHit = Date.now();
        this.applyKnockback();
    }

    /**
     * Applies knockback based on the object's direction.
     */
    applyKnockback() {
        if (this.otherDirection) {
            this.x += 30;
        } else {
            this.x -= 30;
        }
    }

    /**
     * Checks whether the object was hurt recently.
     * @returns {boolean} True if the object is currently hurt.
     */
    isHurt() {
        return Date.now() - this.lastHit < 250;
    }

    /**
     * Checks whether the object's energy has reached zero.
     * @returns {boolean} True if the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Makes the object jump by applying upward velocity.
     */
    jump() {
        this.speedY = 30;
    }
}

