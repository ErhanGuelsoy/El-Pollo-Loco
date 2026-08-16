/**
 * Represents a game level with enemies, clouds,
 * background objects, coins and collectible bottles.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2000;

    /**
     * Creates a new game level.
     * @param {Array} enemies - Enemies contained in the level.
     * @param {Array} clouds - Clouds contained in the level.
     * @param {Array} backgroundObjects - Background objects of the level.
     * @param {Array} [coins=[]] - Collectible coins in the level.
     * @param {Array} [bottles=[]] - Collectible bottles in the level.
     */
    constructor(
        enemies,
        clouds,
        backgroundObjects,
        coins = [],
        bottles = []
    ) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}