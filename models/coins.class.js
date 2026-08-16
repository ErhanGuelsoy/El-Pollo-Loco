/**
 * Represents a collectible coin in the game.
 */
class Coin extends MovableObject {
    width = 150;
    height = 150;

    /**
     * Creates a new coin at the given position.
     * @param {number} x - Horizontal position of the coin.
     * @param {number} y - Vertical position of the coin.
     */
    constructor(x, y) {
        super();

        this.loadImage("img/8_coin/coin_1.png");

        this.x = x;
        this.y = y;
    }
}