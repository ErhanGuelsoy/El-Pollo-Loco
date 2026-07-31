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
     * Checks whether this object is colliding with another movable object.
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
     * Reduces the object's energy and applies knockback after taking damage.
     */
    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit =
                new Date().getTime();
        }

        if (this.otherDirection) {
            this.x += 30;
        } else {
            this.x -= 30;
        }
    }

    /**
     * Checks whether the object was hurt within the last second.
     * @returns {boolean} True if the object is currently hurt.
     */
    isHurt() {
        let timepassed =
            (
                new Date().getTime() -
                this.lastHit
            ) / 1000;

        return timepassed < 1;
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