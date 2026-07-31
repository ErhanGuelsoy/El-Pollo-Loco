/**
 * Represents the playable character and controls movement, animation and health.
 */
class Character extends MovableObject {
    height = 280;
    y = 180;
    speed = 3;

    /**
     * Exact Y position where the character stands on the ground.
     */
    groundY = 180;

    /**
     * Stores whether the character is currently jumping.
     */
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

        this.loadImage(this.IMAGES_IDLE[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);

        this.applyGravity();
        this.animate();
    }

    /**
     * Handles character movement, jumping, camera position
     * and animations.
     */
    animate() {

        /**
         * Character movement.
         */
        setInterval(() => {

            if (!this.world) return;

            if (this.world.gameEnded) {
                this.world.keyboard.LEFT = false;
                this.world.keyboard.RIGHT = false;
                this.world.keyboard.UP = false;
                this.world.keyboard.DOWN = false;
                this.world.keyboard.SPACE = false;
                this.world.keyboard.D = false;

                return;
            }

            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (
                this.world.keyboard.LEFT &&
                this.x > 0
            ) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (
                this.world.keyboard.UP &&
                !this.isJumping &&
                this.y >= this.groundY
            ) {
                this.jump();
            }

            this.world.camera_x =
                -this.x + this.world.canvas.width / 4;

        }, 1000 / 60);

        /**
         * Character animations.
         */
        setInterval(() => {

            if (!this.world) return;

            /**
             * Completely freeze the character animation
             * when the game has ended.
             */
            if (this.world.gameEnded) {
                return;
            }

            /**
             * Death animation.
             */
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }

            /**
             * Hurt animation.
             */
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }

            /**
             * Jump animation.
             */
            if (this.isJumping) {
                this.playAnimation(this.IMAGES_JUMPING);
                return;
            }

            /**
             * Walking animation.
             */
            if (
                this.world.keyboard.LEFT ||
                this.world.keyboard.RIGHT
            ) {
                this.playAnimation(this.IMAGES_WALKING);
                return;
            }

            /**
             * Idle animation.
             */
            this.playAnimation(this.IMAGES_IDLE);

        }, 100);
    }

    /**
     * Reduces the character's energy by 20 and applies knockback after taking damage.
     */
    hit() {
        if (this.world && this.world.gameEnded) {
            return;
        }

        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }

        if (this.otherDirection) {
            this.x += 30;
        } else {
            this.x -= 30;
        }
    }

    /**
     * Checks whether the character was hurt within the last second.
     * @returns {boolean} True if the character is currently hurt.
     */
    isHurt() {
        let timepassed =
            (new Date().getTime() - this.lastHit) / 1000;

        return timepassed < 1;
    }

    /**
     * Checks whether the character has no remaining energy.
     * @returns {boolean} True if the character is dead.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        if (this.world && this.world.gameEnded) {
            return;
        }

        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        if (this.world && this.world.gameEnded) {
            return;
        }

        this.x -= this.speed;
        this.otherDirection = true;
    }

    /**
     * Makes the character jump.
     */
    jump() {
        if (this.world && this.world.gameEnded) {
            return;
        }

        if (this.isJumping) {
            return;
        }

        this.isJumping = true;
        this.speedY = 30;
    }
}