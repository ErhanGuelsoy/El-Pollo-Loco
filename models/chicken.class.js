class Chicken extends MovableObject {

    height = 100;
    x = 100;
    y = 330;

    currentImage = 0;

    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    constructor(){
        super();
        this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);

        // ✅ weiter weg spawnen
        this.x = 800 + Math.random() * 1000;

        this.speed = 0.20 + Math.random() * 0.25;

        // ✅ verzögerter Start
        setTimeout(() => {
            this.animate();
        }, Math.random() * 3000); // 0–3 Sekunden Delay
    }

    animate(){

        // ⏱️ Startverzögerung
        setTimeout(() => {
    
            setInterval(() => {
                this.moveLeft();
            }, 1000 / 60);
    
            setInterval(() => {
                this.playAnimation(this.IMAGES_WALKING)
            }, 200);
    
        }, Math.random() * 3000); // 0–3 Sekunden Delay
    }
    }
