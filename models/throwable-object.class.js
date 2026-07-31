/**
 * Represents a throwable bottle that moves forward and is affected by gravity.
 */
class ThrowableObject extends MovableObject {

    /**
     * Creates a new throwable bottle.
     * @param {number} x - The horizontal starting position of the bottle.
     * @param {number} y - The vertical starting position of the bottle.
     * @param {World} world - The current game world.
     */
    constructor(x, y, world) {
        super();
        this.world = world;
        this.loadImage(
            "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
        );
        this.x = x;
        this.y = y;
        this.height = 70;
        this.width = 60;
        this.throw();
    }

    /**
     * Throws the bottle forward and applies gravity.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}