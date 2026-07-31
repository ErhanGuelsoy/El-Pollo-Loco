/**
 * Represents a status bar for health, bottles, coins or the endboss.
 */
class StatusBar extends DrawableObject {

    IMAGES_Statusbar_Health = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
    ];

    IMAGES_Statusbar_Bottle = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    IMAGES_Statusbar_Coins = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png"
    ];

    IMAGES_Statusbar_Endboss = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png"
    ];

    percentage = 100;
    percentageBottle = 0;
    percentageCoins = 0;
    percentageEndboss = 100;
    type = "health";

    /**
     * Creates a new status bar.
     * @param {string} type - The type of status bar.
     * @param {number} y - The vertical position.
     */
    constructor(type = "health", y = 0) {
        super();

        this.type = type;

        this.width = 250;
        this.height = 80;

        if (
            this.type === "health" ||
            this.type === "bottle" ||
            this.type === "coins"
        ) {
            this.x = 10;
            this.y = y;
        }

        if (this.type === "endboss") {
            this.x = 460;
            this.y = 10;
        }

        this.loadImages(this.IMAGES_Statusbar_Health);
        this.loadImages(this.IMAGES_Statusbar_Bottle);
        this.loadImages(this.IMAGES_Statusbar_Coins);
        this.loadImages(this.IMAGES_Statusbar_Endboss);

        if (this.type === "health") {
            this.setPercentage(100);
        }

        if (this.type === "bottle") {
            this.setPercentageBottle(0);
        }

        if (this.type === "coins") {
            this.setPercentageCoins(0);
        }

        if (this.type === "endboss") {
            this.setPercentageEndboss(100);
        }
    }

    /**
     * Sets the health percentage.
     * @param {number} percentage - Current health.
     */
    setPercentage(percentage) {
        this.percentage = percentage;

        const path =
            this.IMAGES_Statusbar_Health[
                this.resolveImageIndex()
            ];

        this.img = this.imageCache[path];
    }

    /**
     * Determines health image index.
     * @returns {number} Image index.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Sets the bottle percentage.
     * @param {number} percentageBottle - Current bottle percentage.
     */
    setPercentageBottle(percentageBottle) {
        this.percentageBottle = percentageBottle;

        const path =
            this.IMAGES_Statusbar_Bottle[
                this.resolveImageIndexBottle()
            ];

        this.img = this.imageCache[path];
    }

    /**
     * Determines bottle image index.
     * @returns {number} Image index.
     */
    resolveImageIndexBottle() {
        if (this.percentageBottle >= 100) {
            return 5;
        } else if (this.percentageBottle >= 80) {
            return 4;
        } else if (this.percentageBottle >= 60) {
            return 3;
        } else if (this.percentageBottle >= 40) {
            return 2;
        } else if (this.percentageBottle >= 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Sets the coin percentage.
     * @param {number} percentageCoins - Current coin percentage.
     */
    setPercentageCoins(percentageCoins) {
        this.percentageCoins = percentageCoins;

        const path =
            this.IMAGES_Statusbar_Coins[
                this.resolveImageIndexCoins()
            ];

        this.img = this.imageCache[path];
    }

    /**
     * Determines coin image index.
     * @returns {number} Image index.
     */
    resolveImageIndexCoins() {
        if (this.percentageCoins >= 100) {
            return 5;
        } else if (this.percentageCoins >= 80) {
            return 4;
        } else if (this.percentageCoins >= 60) {
            return 3;
        } else if (this.percentageCoins >= 40) {
            return 2;
        } else if (this.percentageCoins >= 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Sets the endboss percentage.
     * @param {number} percentageEndboss - Current endboss percentage.
     */
    setPercentageEndboss(percentageEndboss) {
        this.percentageEndboss = percentageEndboss;

        const path =
            this.IMAGES_Statusbar_Endboss[
                this.resolveImageIndexEndboss()
            ];

        this.img = this.imageCache[path];
    }

    /**
     * Determines endboss image index.
     * @returns {number} Image index.
     */
    resolveImageIndexEndboss() {
        if (this.percentageEndboss >= 100) {
            return 5;
        } else if (this.percentageEndboss >= 80) {
            return 4;
        } else if (this.percentageEndboss >= 60) {
            return 3;
        } else if (this.percentageEndboss >= 40) {
            return 2;
        } else if (this.percentageEndboss >= 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Reduces the endboss percentage by 20.
     */
    reduceEndboss() {
        if (this.percentageEndboss >= 100) {
            this.setPercentageEndboss(80);
        } else if (this.percentageEndboss >= 80) {
            this.setPercentageEndboss(60);
        } else if (this.percentageEndboss >= 60) {
            this.setPercentageEndboss(40);
        } else if (this.percentageEndboss >= 40) {
            this.setPercentageEndboss(20);
        } else if (this.percentageEndboss >= 20) {
            this.setPercentageEndboss(0);
        }
    }
}