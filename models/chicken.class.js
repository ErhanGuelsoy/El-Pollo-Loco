class Chicken extends MovableObject {

    width = 60;
    height = 60;
    y = 360;

    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    deathSoundIndex = 0;

    constructor(x = 400 + Math.random() * 1600) {
        super();

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        // =========================
        // FRÜHERE SPAWN-ZONE + MEHR RANDOM
        // =========================
        let minX = 400;   // früher als vorher
        let maxX = 2400;  // weiter weg vom Endboss

        this.x = x;

        if (!x) {
            this.x = minX + Math.random() * (maxX - minX);
        }

        this.speed = 0.5 + Math.random();

        this.canMove = false;
        this.startDelay = 200 + Math.random() * 1000;

        setTimeout(() => {
            this.canMove = true;
        }, this.startDelay);

        this.animate();
    }

    animate() {

        setInterval(() => {

            if (!this.canMove) return;
            if (this.isDead()) return;

            this.speed = 0.4 + Math.random() * 0.7;
            this.moveLeft();
            this.otherDirection = false;

        }, 1000 / 60);

        setInterval(() => {

            if (!this.canMove) return;
            if (this.isDead()) return;

            this.playAnimation(this.IMAGES_WALKING);

        }, 200);
    }

    hit() {
        this.energy = 0;
        this.die();
    }

    die() {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.speed = 0;

        if (window.gameAudio) {
            gameAudio.play(this.deathSoundIndex);
        }

        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }

    isDead() {
        return this.energy <= 0;
    }
}