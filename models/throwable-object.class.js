/**
 * Represents a throwable bottle that moves forward,
 * rotates in the air and is affected by gravity.
 */
class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Creates a new throwable bottle.
   * @param {number} x - The horizontal starting position of the bottle.
   * @param {number} y - The vertical starting position of the bottle.
   * @param {World} world - The current game world.
   */
  constructor(x, y, world) {
    super();
    this.world = world;
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 60;
    this.throw();
  }

  /**
   * Throws the bottle forward and applies gravity.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();

    /**
     * Plays the bottle rotation animation
     * while the bottle is flying.
     */
    setInterval(() => {
      this.playAnimation(this.IMAGES_ROTATION);
    }, 100);

    /**
     * Moves the bottle forward.
     */
    setInterval(() => {
      this.x += 10;
    }, 25);
  }
}
