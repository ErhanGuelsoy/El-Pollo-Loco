class Coin extends MovableObject {
    width = 50;
    height = 50;
    constructor(x, y){
        super();
        this.loadImage("img/8_coin/coin_1.png");
        this.x = x;
        this.y = y;
    }
}