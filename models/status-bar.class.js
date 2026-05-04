class StatusBar extends DrawableObject {

    IMAGES = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];

    IMAGES_Statusbar_Bottle = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ];

    IMAGES_Statusbar_Endboss = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
    ];

    // 🔥 MUSS bleiben wie du willst
    percentage = 100;
    percentageBottle = 100;
    percentageEndboss = 100;

    type = "health";

    constructor(type = "health") {
        super();

        this.type = type;
        this.x = 60;
        this.y = 0;
        this.width = 250;
        this.height = 80;
        this.loadImages(this.IMAGES);
        this.loadImages(this.IMAGES_Statusbar_Bottle);
        this.loadImages(this.IMAGES_Statusbar_Endboss);
        this.setPercentage(100);
    }

    // =========================
    // HEALTH (UNVERÄNDERT)
    // =========================
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }

    // =========================
    // BOTTLE (DEIN FORMAT BLEIBT!)
    // =========================
    setPercentageBottle(percentageBottle){
        this.percentageBottle = percentageBottle;
        let index = this.resolveImageIndexBottle();
        let path = this.IMAGES_Statusbar_Bottle[index];
        this.img = this.imageCache[path];
    }

    resolveImageIndexBottle(){
        if(this.percentageBottle == 100) return 5;
        else if (this.percentageBottle >= 80) return 4;
        else if (this.percentageBottle >= 60) return 3;
        else if (this.percentageBottle >= 40) return 2;
        else if (this.percentageBottle >= 20) return 1;
        else return 0;
    }

    // =========================
    // ENDBOSS (DEIN FORMAT BLEIBT!)
    // =========================
    setPercentageEndboss(percentageEndboss){
        this.percentageEndboss = percentageEndboss;
        let index = this.resolveImageIndexEndboss();
        let path = this.IMAGES_Statusbar_Endboss[index];
        this.img = this.imageCache[path];
    }
    resolveImageIndexEndboss(){
        if(this.percentageEndboss >= 100) return 5;
        else if(this.percentageEndboss >= 80) return 4;
        else if(this.percentageEndboss >= 60) return 3;
        else if(this.percentageEndboss >= 40) return 2;
        else if(this.percentageEndboss >= 20) return 1;
        else return 0;
    }
}