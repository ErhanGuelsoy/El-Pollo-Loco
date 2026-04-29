class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 400;
    speed = 0.2;

constructor(){
    super().loadImage('img/5_background/layers/4_clouds/2.png')

    this.x = 50 + Math.random() * 500; // Zahl zwischen 200 und 700
    this.animate();

}
animate(){

this.moveLeft()
}


moveLeft(){
    setInterval(() => {
        this.x -= 0.2;
    }, 1000 / 60);
    }
}