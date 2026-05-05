class Chicken extends MovableObject {
    width = 60;
    height = 60;
    y = 360;

    // Animationen
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    // 🔊 Sound-Index für GameAudio (Auto-Crash)
    deathSoundIndex = 0;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 300 + Math.random() * 1000; // zufällige Startposition
        this.speed = 0.5 + Math.random();    // zufällige Geschwindigkeit

        this.animate();
    }

    animate() {
        // Bewegung nach links
        setInterval(() => {
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);

        // Animationswechsel
        setInterval(() => {
            if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    // Trefferfunktion
    hit() {
        this.energy = 0;
        this.die();
    }

    // Tod
    die() {
        this.loadImage(this.IMAGES_DEAD[0]);
        this.speed = 0;

        // 🔊 Auto-Crash Sound abspielen
        if (gameAudio) gameAudio.play(this.deathSoundIndex);

        // Chicken nach 1 Sekunde löschen
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }

    // Prüfen ob Chicken tot ist
    isDead() {
        return this.energy <= 0;
    }
}