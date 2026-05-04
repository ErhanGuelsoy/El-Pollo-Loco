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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 300 + Math.random() * 1000;
        this.speed = 0.5 + Math.random();

        this.animate();
    }

    animate() {

        // 🐔 Bewegung
        setInterval(() => {
            this.moveLeft();

            // ✅ FIX: NICHT spiegeln
            this.otherDirection = false;

        }, 1000 / 60);

        // 🎞️ Animation
        setInterval(() => {
            if (!this.isDead()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    // 💥 Wird von Flasche getroffen
    hit() {
        this.energy = 0;
        this.die();
    }

    // ☠️ Tod
    die() {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.speed = 0;

        // 🧹 nach 1 Sekunde entfernen
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }
}