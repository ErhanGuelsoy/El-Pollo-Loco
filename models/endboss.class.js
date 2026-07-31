class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 50;
    energy = 100;
    speed = 2;
    hadFirstContact = false;
    isAttacking = false;
    attackDamageApplied = false;
    lastAttackTime = 0;
    animationSpeed = 200;
    lastAnimationTime = 0;

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png"
    ];

    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    IMAGES_ENDBOSS_WALK = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_ENDBOSS_DAMAGE = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_ENDBOSS_DEATH = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    /**
     * Creates a new endboss and loads its images.
     */
    constructor() {
        super();

        this.x = 2300;
        this.y = 50;
        this.currentImage = 0;

        this.loadImage(this.IMAGES_ENDBOSS_WALK[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_ENDBOSS_WALK);
        this.loadImages(this.IMAGES_ENDBOSS_DAMAGE);
        this.loadImages(this.IMAGES_ENDBOSS_DEATH);

        this.animate();
    }

    /**
     * Controls endboss movement and animations.
     */
    animate() {
        setInterval(() => {

            if (this.isDead()) {
                this.isAttacking = false;
                this.playAnimation(this.IMAGES_ENDBOSS_DEATH);
                return;
            }

            if (!this.world || !this.world.character || this.world.gameEnded) {
                return;
            }

            if (!this.hadFirstContact) {
                this.img = this.imageCache[this.IMAGES_ENDBOSS_WALK[0]];
                return;
            }

            if (this.isAttacking) {
                return;
            }

            if (this.isCharacterInAttackRange()) {
                this.startAttack();
                return;
            }

            this.followCharacter();

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_ENDBOSS_DAMAGE);
            } else {
                this.playSlowAnimation(this.IMAGES_ENDBOSS_WALK);
            }

        }, 1000 / 60);
    }

    /**
     * Plays the endboss walking animation.
     * @param {Array} images - Animation images.
     */
    playSlowAnimation(images) {
        const now = Date.now();

        if (now - this.lastAnimationTime >= this.animationSpeed) {
            this.currentImage++;

            if (this.currentImage >= images.length) {
                this.currentImage = 0;
            }

            this.lastAnimationTime = now;
        }

        this.img = this.imageCache[images[this.currentImage]];
    }

    /**
     * Checks whether the character is within attack range.
     * @returns {boolean} True if the character is close enough.
     */
    isCharacterInAttackRange() {
        const character = this.world.character;

        const bossCenter =
            this.x +
            this.width / 2;

        const characterCenter =
            character.x +
            character.width / 2;

        const distance =
            Math.abs(
                characterCenter -
                bossCenter
            );

        return distance <= 140;
    }

    /**
     * Moves the boss towards the character.
     */
    followCharacter() {
        const character =
            this.world.character;

        const bossCenter =
            this.x +
            this.width / 2;

        const characterCenter =
            character.x +
            character.width / 2;

        const distance =
            characterCenter -
            bossCenter;

        if (distance < -50) {
            this.moveLeft();
            this.otherDirection = false;
            return;
        }

        if (distance > 50) {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Starts the endboss attack animation.
     */
    startAttack() {
        if (
            this.isAttacking ||
            this.isDead()
        ) {
            return;
        }

        const now = Date.now();

        if (
            now - this.lastAttackTime <
            800
        ) {
            return;
        }

        this.isAttacking = true;
        this.attackDamageApplied = false;

        this.currentImage = 0;

        this.playAnimation(
            this.IMAGES_ATTACK
        );

        setTimeout(() => {
            this.isAttacking = false;
            this.attackDamageApplied = false;
            this.lastAttackTime = Date.now();
        }, 800);
    }

    /**
     * Reduces endboss energy by 20.
     */
    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();
        }

        if (window.gameAudio) {
            window.gameAudio.play(4);
        }
    }

    /**
     * Moves the boss to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the boss to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Checks whether the endboss is dead.
     * @returns {boolean} True if the endboss has no energy left.
     */
    isDead() {
        return this.energy <= 0;
    }
}