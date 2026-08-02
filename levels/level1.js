/**
 * Initializes the first game level with enemies, clouds,
 * background objects, coins and collectible bottles.
 */
function initLevel() {
    level1 = new Level(
    
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

        [
            new Cloud()
        ],

        
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

[
        new CollectBottle(200, 340),
        new CollectBottle(350, 180),
        new CollectBottle(500, 310),
        new CollectBottle(650, 230),
        new CollectBottle(800, 360),
        new CollectBottle(950, 200),
        new CollectBottle(1100, 320),
        new CollectBottle(1250, 170),
        new CollectBottle(1400, 290),
        new CollectBottle(1550, 240),
        new CollectBottle(1700, 350),
        new CollectBottle(1850, 190),
        new CollectBottle(2000, 280),
]
    );
}