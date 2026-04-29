class DrawableObject{
    img;
    imageCache = {};
    x = 150;
    y = 250;
    width = 100;
    height = 200;
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken){ 
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.stroke();
    }
}

    /**
     * Lädt mehrere Bilder und speichert sie im imageCache.
     * 
     * @param {string[]} arr - Ein Array mit Bildpfaden (URLs oder relative Pfade),
     * die geladen werden sollen.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}