/**
 * Represents the playable character and controls movement,
 * animation and health.
 */
class Character extends MovableObject {
    height = 280;
    y = 360;
    speed = 4.2;
    groundY = 150;
    isJumping = false;

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/idle_1.png",
        "img/2_character_pepe/1_idle/idle/idle_2.png",
        "img/2_character_pepe/1_idle/idle/idle_3.png",
        "img/2_character_pepe/1_idle/idle/idle_4.png",
        "img/2_character_pepe/1_idle/idle/idle_5.png",
        "img/2_character_pepe/1_idle/idle/idle_6.png",
        "img/2_character_pepe/1_idle/idle/idle_7.png",
        "img/2_character_pepe/1_idle/idle/idle_8.png",
        "img/2_character_pepe/1_idle/idle/idle_9.png",
        "img/2_character_pepe/1_idle/idle/idle_10.png"
    ];

    IMAGE_LOST_GAME = [
        "img/You won, you lost/You lost.png"
    ];

    currentImage = 0;
    world;

    /**
     * Creates a new character and initializes its images,
     * gravity and animations.
     */
    constructor() {
        super();
        this.x = 150;
        this.y = this.groundY;
        this.speedY = 0;
        this.isJumping = false;

        this.loadCharacterImages();
        this.applyGravity();
        this.animate();
    }

    /**
     * Loads all character animation image sets.
     */
    loadCharacterImages() {
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
    }

    /**
     * Starts the movement and animation intervals.
     */
    animate() {
        this.animateMovement();
        this.animateCharacter();
    }

    /**
     * Handles character movement and camera position.
     */
    animateMovement() {
        setInterval(() => {
            if (!this.world) return;
            if (this.world.gameEnded) {
                this.resetControls();
                return;
            }

            this.handleMovement();
            this.updateCamera();
        }, 1000 / 60);
    }

    /**
     * Resets all keyboard controls when the game ends.
     */
    resetControls() {
        const keyboard = this.world.keyboard;

        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.UP = false;
        keyboard.DOWN = false;
        keyboard.SPACE = false;
        keyboard.D = false;
    }

    /**
     * Handles horizontal movement and jumping.
     */
    handleMovement() {
        this.handleRightMovement();
        this.handleLeftMovement();
        this.handleJump();
    }

    /**
     * Moves the character to the right when possible.
     */
    handleRightMovement() {
        if (this.world.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
    }

    /**
     * Moves the character to the left when possible.
     */
    handleLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
        }
    }

    /**
     * Starts a jump when the character is on the ground.
     */
    handleJump() {
        if (this.world.keyboard.UP &&
            !this.isJumping &&
            this.y >= this.groundY) {
            this.jump();
        }
    }

    /**
     * Updates the camera position based on the character.
     */
    updateCamera() {
        this.world.camera_x =
            -this.x + this.world.canvas.width / 4;
    }

    /**
     * Handles the character animation states.
     */
    animateCharacter() {
        setInterval(() => {
            if (!this.world || this.world.gameEnded) return;
            this.playCurrentAnimation();
        }, 100);
    }

    /**
     * Selects the correct animation based on the character state.
     */
    playCurrentAnimation() {
        if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.isJumping) return this.playAnimation(this.IMAGES_JUMPING);
        if (this.isWalking()) return this.playAnimation(this.IMAGES_WALKING);

        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Checks whether the character is currently walking.
     * @returns {boolean} True if the character is walking.
     */
    isWalking() {
        return this.world.keyboard.LEFT ||
            this.world.keyboard.RIGHT;
    }

    /**
     * Reduces the character's energy and applies knockback.
     */
    hit() {
        if (this.world?.gameEnded) return;

        this.reduceEnergy();
        this.lastHit = Date.now();
        this.applyKnockback();
    }

    /**
     * Reduces the character's energy by exactly 10 points.
     */
    reduceEnergy() {
        this.energy = Math.max(this.energy - 10, 0);
    }

    /**
     * Applies knockback after the character is hit.
     */
    applyKnockback() {
        if (this.otherDirection) {
            this.x += 30;
        } else {
            this.x -= 30;
        }
    }

    /**
     * Checks whether the character was hurt within the last second.
     *
     * @returns {boolean} True if the character is currently hurt.
     */
    isHurt() {
        const timePassed = (Date.now() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * Checks whether the character has no remaining energy.
     *
     * @returns {boolean} True if the character is dead.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        if (this.world?.gameEnded) return;

        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        if (this.world?.gameEnded) return;

        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Makes the character jump.
     */
    jump() {
        if (this.world?.gameEnded || this.isJumping) return;

        this.isJumping = true;
        this.speedY = 30;
    }
}

