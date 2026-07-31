class CollectBottle extends MovableObject {
    width = 80;
    height = 80;

    constructor(x, y) {
        super();

        this.loadImage(
            "img/6_salsa_bottle/salsa_bottle.png"
        );

        this.x = x;
        this.y = y;
    }
}