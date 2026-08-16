/**
 * Represents a status bar for health, bottles,
 * coins or the endboss.
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
     * Creates a status bar and sets its position and value.
     * @param {string} type - The type of status bar.
     * @param {number} y - The vertical position.
     */
    constructor(type = "health", y = 0) {
        super();

        this.type = type;
        this.width = 250;
        this.height = 80;

        this.setPosition(y);
        this.loadAllImages();
        this.setInitialPercentage();
    }

    /**
     * Sets the position of the status bar.
     * @param {number} y - The vertical position.
     */
    setPosition(y) {
        if (this.type === "endboss") {
            this.x = 460;
            this.y = 10;
            return;
        }

        this.x = 10;
        this.y = y;
    }

    /**
     * Loads all status bar image sets.
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_Statusbar_Health);
        this.loadImages(this.IMAGES_Statusbar_Bottle);
        this.loadImages(this.IMAGES_Statusbar_Coins);
        this.loadImages(this.IMAGES_Statusbar_Endboss);
    }

    /**
     * Sets the initial percentage according to the bar type.
     */
    setInitialPercentage() {
        if (this.type === "health") this.setPercentage(100);
        if (this.type === "bottle") this.setPercentageBottle(0);
        if (this.type === "coins") this.setPercentageCoins(0);
        if (this.type === "endboss") this.setPercentageEndboss(100);
    }

    /**
     * Updates the health status bar percentage.
     * @param {number} percentage - Current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.updateImage(
            this.IMAGES_Statusbar_Health,
            percentage
        );
    }

    /**
     * Determines the image index for a percentage.
     * @param {number} percentage - Current percentage.
     * @returns {number} The matching image index.
     */
    resolveImageIndex(percentage) {
        if (percentage <= 0) return 0;
    
        return Math.ceil(percentage / 20);
    }

    /**
     * Updates the status bar image.
     * @param {string[]} images - The image sequence.
     * @param {number} percentage - Current percentage.
     */
    updateImage(images, percentage) {
        const index = this.resolveImageIndex(percentage);
        const path = images[index];

        this.img = this.imageCache[path];
    }

    /**
     * Updates the bottle status bar percentage.
     * @param {number} percentageBottle - Current bottle percentage.
     */
    setPercentageBottle(percentageBottle) {
        this.percentageBottle = percentageBottle;
        this.updateImage(
            this.IMAGES_Statusbar_Bottle,
            percentageBottle
        );
    }

 /**
  * Updates the coin status bar percentage.
  * @param {number} percentageCoins - Current coin percentage.
  */
 setPercentageCoins(percentageCoins) {
    this.percentageCoins = Math.min(percentageCoins, 100);

    this.updateImage(
        this.IMAGES_Statusbar_Coins,
        this.percentageCoins
    );
}

    /**
     * Updates the endboss status bar percentage.
     * @param {number} percentageEndboss - Current boss percentage.
     */
    setPercentageEndboss(percentageEndboss) {
        this.percentageEndboss = percentageEndboss;
        this.updateImage(
            this.IMAGES_Statusbar_Endboss,
            percentageEndboss
        );
    }

    /**
     * Reduces the endboss percentage by 20 points.
     */
    reduceEndboss() {
        this.setPercentageEndboss(
            Math.max(0, this.percentageEndboss - 20)
        );
    }
}

