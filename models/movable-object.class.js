
/**
 * Represents a movable game object with movement, gravity, collision and health functionality.
 */
class MovableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.6;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the movable object.
     */
    applyGravity() {
        setInterval(() => {
            if (
                this.isAboveGround() ||
                this.speedY > 0
            ) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                /**
                 * Keeps the character exactly on the ground.
                 */
                if (
                    this instanceof Character &&
                    this.y >= this.groundY
                ) {
                    this.y = this.groundY;
                    this.speedY = 0;
                    this.isJumping = false;
                }
            }
        }, 1000 / 60);
    }

    /**
     * Checks whether the object is currently above the ground.
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        if (
            this instanceof ThrowableObject
        ) {
            return true;
        }

        if (
            this instanceof Character
        ) {
            return this.y < this.groundY;
        }

        return this.y < 180;
    }

    /**
     * Plays an animation using the provided image sequence.
     * @param {string[]} images - An array containing the image paths.
     */
    playAnimation(images) {
        let i =
            this.currentImage %
            images.length;

        let path = images[i];

        this.img =
            this.imageCache[path];

        this.currentImage++;
    }

    /**
     * Standard collision detection.
     * Used for general collisions.
     *
     * @param {MovableObject} mo - The object to check for collision.
     * @returns {boolean} True if the objects are colliding.
     */
    isColliding(mo) {
        return (
            this.x <
                mo.x + mo.width &&
            this.x + this.width >
                mo.x &&
            this.y <
                mo.y + mo.height &&
            this.y + this.height >
                mo.y
        );
    }

    /**
     * Precise collision detection for collectible objects.
     *
     * The collision area of the character is reduced so that
     * coins and bottles are only collected when the character
     * is actually close to the object.
     *
     * @param {MovableObject} mo - The collectible object.
     * @returns {boolean} True if the object is precisely touched.
     */
 /**
 * Precise collision detection for collectible objects.
 *
 * The collision area of the character is reduced so that
 * coins and bottles are only collected when the character
 * actually touches them.
 *
 * @param {MovableObject} mo - The collectible object.
 * @returns {boolean} True if the object is touched.
 */
isCollecting(mo) {
    const characterOffsetLeft = 55;
    const characterOffsetRight = 55;
    const characterOffsetTop = 45;
    const characterOffsetBottom = 45;

    const characterLeft = this.x + characterOffsetLeft;
    const characterRight = this.x + this.width - characterOffsetRight;
    const characterTop = this.y + characterOffsetTop;
    const characterBottom = this.y + this.height - characterOffsetBottom;

    const objectOffsetLeft = 18;
    const objectOffsetRight = 18;
    const objectOffsetTop = 18;
    const objectOffsetBottom = 18;

    const objectLeft = mo.x + objectOffsetLeft;
    const objectRight = mo.x + mo.width - objectOffsetRight;
    const objectTop = mo.y + objectOffsetTop;
    const objectBottom = mo.y + mo.height - objectOffsetBottom;

    return (
        characterLeft < objectRight &&
        characterRight > objectLeft &&
        characterTop < objectBottom &&
        characterBottom > objectTop
    );
}

    /**
     * Precise collision detection for enemies.
     *
     * The character must actually land on the enemy.
     * Small side overlaps are not enough.
     *
     * @param {MovableObject} mo - The enemy object.
     * @returns {boolean} True if the character hits the enemy.
     */
    isEnemyCollision(mo) {
        const characterOffsetX = 40;
        const characterOffsetTop = 20;
        const characterOffsetBottom = 5;

        const characterLeft =
            this.x + characterOffsetX;

        const characterRight =
            this.x +
            this.width -
            characterOffsetX;

        const characterTop =
            this.y + characterOffsetTop;

        const characterBottom =
            this.y +
            this.height -
            characterOffsetBottom;

        const enemyOffsetX = 10;
        const enemyOffsetY = 5;

        const enemyLeft =
            mo.x + enemyOffsetX;

        const enemyRight =
            mo.x +
            mo.width -
            enemyOffsetX;

        const enemyTop =
            mo.y + enemyOffsetY;

        const enemyBottom =
            mo.y +
            mo.height -
            enemyOffsetY;

        return (
            characterLeft < enemyRight &&
            characterRight > enemyLeft &&
            characterTop < enemyBottom &&
            characterBottom > enemyTop
        );
    }

    /**
     * Reduces the object's energy and applies knockback after taking damage.
     */
    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = Date.now();

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
        const timePassed =
            Date.now() - this.lastHit;

        return timePassed < 250;
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

