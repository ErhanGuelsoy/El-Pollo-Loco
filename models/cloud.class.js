/**
 * Represents a cloud that moves continuously across the game background.
 */
class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 400;
    speed = 0.2;

    /**
     * Creates a new cloud with a random starting position.
     */
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/2.png");

        this.x = 50 + Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the cloud's movement.
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    moveLeft() {
        setInterval(() => {
            this.x -= 0.2;
        }, 1000 / 60);
    }
}