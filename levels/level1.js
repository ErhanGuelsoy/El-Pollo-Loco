/**
 * Initializes the first game level with enemies, clouds,
 * background objects, coins and collectible bottles.
 */
function initLevel() {
    level1 = new Level(
        // Enemies
        [
            new Chicken(600),
            new Chicken(1100),
            new Chicken(1700),
            new Chicken(2400),
            new Chicken(3200),
            new Chicken(4100),
            new Chicken(5000),
            new Endboss()
        ],

        // Clouds
        [
            new Cloud()
        ],

        // BackgroundObjects
        [
            new BackgroundObject("img/5_background/layers/air.png", -719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

            new BackgroundObject("img/5_background/layers/air.png", 0),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

            new BackgroundObject("img/5_background/layers/air.png", 719),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

            new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
            new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),

            new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
            new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3)
        ],

        // Coins
        [
            new Coin(1800, 50),
            new Coin(1400, 100),
            new Coin(1500, 200),
            new Coin(200, 300),
            new Coin(400, 80),
            new Coin(600, 350),
            new Coin(800, 200),
            new Coin(1200, 300)
        ],

        // Collectible bottles
        [
            new CollectBottle(320, 400),
            new CollectBottle(290, 700),
            new CollectBottle(400, 350),
            new CollectBottle(800, 350),
            new CollectBottle(1000, 280),
            new CollectBottle(1150, 360),
            new CollectBottle(1300, 220),
            new CollectBottle(1450, 330),
            new CollectBottle(1600, 180),
            new CollectBottle(1750, 300),
            new CollectBottle(1900, 150),
            new CollectBottle(2050, 350)
        ]
    );
}