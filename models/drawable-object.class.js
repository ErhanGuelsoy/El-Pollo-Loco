/**
 * Represents a drawable game object with images, position and dimensions.
 */
class DrawableObject {
    img;
    imageCache = {};
    x = 150;
    y = 250;
    width = 100;
    height = 200;
    currentImage = 0;

    /**
     * Loads an image and assigns it to the object.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     */
    draw(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} arr - Image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}

