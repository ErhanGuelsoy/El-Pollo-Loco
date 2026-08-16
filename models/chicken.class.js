/**
 * Represents a chicken enemy that can move,
 * be defeated and removed from the game.
 */
class Chicken extends MovableObject {
    width = 60;
    height = 60;
    y = 360;
    canMove = false;
    stopMovement = false;

    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    deathSoundIndex = 0;

    /**
     * Creates a new chicken enemy.
     * @param {number} x - The initial horizontal position.
     */
    constructor(x = 400 + Math.random() * 1600) {
        super();

        this.loadChickenImages();
        this.setStartingPosition(x);
        this.setMovement();
        this.startMovementDelay();
        this.animate();
    }

    /**
     * Loads the walking and death images.
     */
    loadChickenImages() {
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Sets the chicken's starting horizontal position.
     * @param {number} x - The initial horizontal position.
     */
    setStartingPosition(x) {
        const minX = 400;
        const maxX = 2400;

        this.x = x || minX + Math.random() * (maxX - minX);
    }

    /**
     * Sets the chicken's initial movement properties.
     */
    setMovement() {
        this.speed = 0.5 + Math.random();
        this.canMove = false;
        this.stopMovement = false;
    }

    /**
     * Delays the start of the chicken's movement.
     */
    startMovementDelay() {
        this.startDelay = 200 + Math.random() * 1000;

        setTimeout(() => {
            if (!this.stopMovement) {
                this.canMove = true;
            }
        }, this.startDelay);
    }

    /**
     * Starts the chicken's movement and walking animations.
     */
    animate() {
        this.animateMovement();
        this.animateWalking();
    }

    /**
     * Handles the chicken's movement.
     */
    animateMovement() {
        setInterval(() => {
            if (!this.canMove || this.stopMovement || this.isDead()) {
                return;
            }

            this.moveChicken();
        }, 1000 / 60);
    }

    /**
     * Moves the chicken to the left with a random speed.
     */
    moveChicken() {
        this.speed = 0.4 + Math.random() * 0.7;
        this.moveLeft();
        this.otherDirection = false;
    }

    /**
     * Handles the chicken's walking animation.
     */
    animateWalking() {
        setInterval(() => {
            if (!this.canMove || this.stopMovement || this.isDead()) {
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Defeats the chicken by reducing its energy to zero.
     */
    hit() {
        this.energy = 0;
        this.die();
    }

    /**
     * Handles the chicken's death animation, sound and removal.
     */
    die() {
        this.setDeathState();
        this.playDeathSound();
        this.removeAfterDelay();
    }

    /**
     * Stops the chicken and displays its death image.
     */
    setDeathState() {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.speed = 0;
        this.canMove = false;
        this.stopMovement = true;
    }

    /**
     * Plays the chicken's death sound.
     */
    playDeathSound() {
        if (window.gameAudio) {
            gameAudio.play(this.deathSoundIndex);
        }
    }

    /**
     * Marks the chicken for removal after its death animation.
     */
    removeAfterDelay() {
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }

    /**
     * Checks whether the chicken has been defeated.
     * @returns {boolean} True if the chicken has no remaining energy.
     */
    isDead() {
        return this.energy <= 0;
    }
}

