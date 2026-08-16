/**
 * Represents a background object in the game world.
 */
class BackgroundObject extends MovableObject {
    width = 722;
    height = 480;
  
    /**
     * Creates a new background object.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background object.
     */
    constructor(imagePath, x) {
      super().loadImage(imagePath);
      this.x = x;
      this.y = 480 - this.height;
    }
  }