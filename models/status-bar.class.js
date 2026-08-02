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

    setPercentage(percentage) {
        this.percentage = percentage;

        const path =
            this.IMAGES_Statusbar_Health[
                this.resolveImageIndex(this.percentage)
            ];

        this.img = this.imageCache[path];
    }


    /**
     * Determines the image index for a percentage.
     * @param {number} percentage - Current percentage.
     * @returns {number} Image index.
     */
    resolveImageIndex(percentage) {
        for (let index = 5; index >= 0; index--) {
            if (percentage >= index * 20) {
                return index;
            }
        }
        return 0;
    }


    setPercentageBottle(percentageBottle) {
        this.percentageBottle = percentageBottle;

        const path =
            this.IMAGES_Statusbar_Bottle[
                this.resolveImageIndex(this.percentageBottle)
            ];
        this.img = this.imageCache[path];
    }


    setPercentageCoins(percentageCoins) {
        this.percentageCoins = percentageCoins;

        const path =
            this.IMAGES_Statusbar_Coins[
                this.resolveImageIndex(this.percentageCoins)
            ];

        this.img = this.imageCache[path];
    }


    setPercentageEndboss(percentageEndboss) {
        this.percentageEndboss = percentageEndboss;
        const path =
            this.IMAGES_Statusbar_Endboss[
                this.resolveImageIndex(this.percentageEndboss)
            ];

        this.img = this.imageCache[path];
    }


    reduceEndboss() {
        this.setPercentageEndboss(
            Math.max(0, this.percentageEndboss - 20)
        );
    }
}