/**
 * Represents a collectible bottle in the game.
 */
class CollectBottle extends MovableObject {
    width = 80;
    height = 80;

    /**
     * Creates a new collectible bottle at the given position.
     * @param {number} x - Horizontal position of the bottle.
     * @param {number} y - Vertical position of the bottle.
     */
    constructor(x, y) {
        super();

        this.loadImage("img/6_salsa_bottle/salsa_bottle.png");

        this.x = x;
        this.y = y;
    }
}