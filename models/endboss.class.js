class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 50;

    energy = 100;

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png"
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
        super().loadImage(this.IMAGES_WALKING[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ENDBOSS_DAMAGE);
        this.loadImages(this.IMAGES_ENDBOSS_DEATH);

        this.x = 2300;
        this.animate();
    }

    animate() {

        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_ENDBOSS_DEATH);
            } 
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_ENDBOSS_DAMAGE);
            } 
            else {
                this.playAnimation(this.IMAGES_WALKING);
            }

        }, 150);
    }

    hit() {
        this.energy -= 20;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }

        // =========================
        // 🔊 ENDBOSS SOUND FIX
        // =========================
        if (window.gameAudio) {
            window.gameAudio.play(4);
        }
    }
}