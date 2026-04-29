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

        this.x = 200 + Math.random() * 500; // Zahl zwischen 200 und 700
        this.speed = 0.20 + Math.random() * 0.25;

        this.animate();
    }



    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING)
        }, 200);
    }
}