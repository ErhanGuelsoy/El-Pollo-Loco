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
    lastBossHitTime = 0;
    bossHitCooldown = 250;

    animationSpeed = 200;
    lastAnimationTime = 0;

    deathAnimationStarted = false;
    deathAnimationFinished = false;
    deathAnimationStartTime = 0;


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


    constructor() {
        super();

        this.x = 2300;
        this.currentImage = 0;

        this.loadImage(this.IMAGES_ENDBOSS_WALK[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_ENDBOSS_WALK);
        this.loadImages(this.IMAGES_ENDBOSS_DAMAGE);
        this.loadImages(this.IMAGES_ENDBOSS_DEATH);

        this.animate();
    }


    animate() {
        setInterval(() => {

            if (this.isDead()) {
                this.handleDeathAnimation();
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

            this.isHurt()
                ? this.playDamageAnimation()
                : this.playSlowAnimation(this.IMAGES_ENDBOSS_WALK);

        }, 1000 / 60);
    }


    handleDeathAnimation() {

        this.isAttacking = false;
        this.attackDamageApplied = false;
        this.speed = 0;

        if (!this.deathAnimationStarted) {

            this.deathAnimationStarted = true;
            this.deathAnimationStartTime = Date.now();

            this.img =
                this.imageCache[this.IMAGES_ENDBOSS_DEATH[0]];

            return;
        }

        if (this.deathAnimationFinished) {

            this.img =
                this.imageCache[
                    this.IMAGES_ENDBOSS_DEATH[
                        this.IMAGES_ENDBOSS_DEATH.length - 1
                    ]
                ];

            return;
        }

        const frame =
            Math.min(
                Math.floor(
                    (Date.now() - this.deathAnimationStartTime) / 180
                ),
                this.IMAGES_ENDBOSS_DEATH.length - 1
            );

        if (frame === this.IMAGES_ENDBOSS_DEATH.length - 1) {
            this.deathAnimationFinished = true;
        }

        this.img =
            this.imageCache[this.IMAGES_ENDBOSS_DEATH[frame]];
    }


    playDamageAnimation() {

        const frame =
            Math.min(
                Math.floor((Date.now() - this.lastHit) / 80),
                this.IMAGES_ENDBOSS_DAMAGE.length - 1
            );

        this.img =
            this.imageCache[this.IMAGES_ENDBOSS_DAMAGE[frame]];
    }


    playSlowAnimation(images) {

        if (Date.now() - this.lastAnimationTime >= this.animationSpeed) {

            this.currentImage++;

            if (this.currentImage >= images.length) {
                this.currentImage = 0;
            }

            this.lastAnimationTime = Date.now();
        }

        this.img =
            this.imageCache[images[this.currentImage]];
    }


    isCharacterInAttackRange() {

        const character = this.world.character;

        const distance =
            Math.abs(
                (character.x + character.width / 2) -
                (this.x + this.width / 2)
            );

        return distance <= 140;
    }


    followCharacter() {

        const character = this.world.character;

        const distance =
            (character.x + character.width / 2) -
            (this.x + this.width / 2);


        if (distance < -50) {
            this.moveLeft();
            this.otherDirection = false;
        }

        if (distance > 50) {
            this.moveRight();
            this.otherDirection = true;
        }
    }


    startAttack() {

        if (this.isAttacking || this.isDead()) {
            return;
        }

        if (Date.now() - this.lastAttackTime < 800) {
            return;
        }

        this.isAttacking = true;
        this.attackDamageApplied = false;

        this.playAnimation(this.IMAGES_ATTACK);

        setTimeout(() => {

            this.isAttacking = false;
            this.lastAttackTime = Date.now();

        }, 800);
    }


    hit() {

        if (this.isDead()) {
            return;
        }

        if (Date.now() - this.lastBossHitTime < this.bossHitCooldown) {
            return;
        }

        this.lastBossHitTime = Date.now();

        this.energy -= 10;

        if (this.energy < 0) {
            this.energy = 0;
        }

        this.lastHit = Date.now();

        this.isAttacking = false;

        this.deathAnimationStarted = false;
        this.deathAnimationFinished = false;

        if (window.gameAudio) {
            window.gameAudio.play(4);
        }
    }


    moveRight() {

        if (!this.isDead()) {
            this.x += this.speed;
        }
    }


    moveLeft() {

        if (!this.isDead()) {
            this.x -= this.speed;
        }
    }


    isDead() {
        return this.energy <= 0;
    }
}