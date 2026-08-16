/**
 * Represents the game world and manages game state,
 * objects, collisions and rendering.
 */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBars = [
    new StatusBar("health", 0), new StatusBar("bottle", 70),
    new StatusBar("coins", 140), new StatusBar("endboss", 210),
  ];
  throwableObjects = [];
  lastThrowTime = 0;
  lastCharacterHitTime = 0;
  characterHitCooldown = 300;
  endbossTriggered = false;
  gameEnded = false;
  
  /**
   * Creates the game world.
   * @param {HTMLCanvasElement} canvas - Game canvas.
   * @param {Keyboard} keyboard - Controls.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.setWorld(); this.draw(); this.run();
  }

  /** Connects objects to the world. */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => enemy.world = this);
  }

  /** Plays a sound.
   * @param {number} id - Sound ID.
   */
  playSound(id) { window.gameAudio?.play(id); }
  /** Shows a screen.
   * @param {string} id - Screen ID.
   */
  showScreen(id) {
    document.getElementById(id).classList.remove("hidden");
  }

  /** Ends the game.
   * @param {string} screen - Screen ID.
   */
  endGame(screen) {
    this.gameEnded = true; this.resetKeyboard();
    this.stopEnemies(); this.showScreen(screen);
    window.stopAllSounds?.();
  }

  /** Resets keyboard inputs. */
  resetKeyboard() {
    this.keyboard.LEFT = this.keyboard.RIGHT = false;
    this.keyboard.UP = this.keyboard.DOWN = false;
    this.keyboard.SPACE = this.keyboard.D = false;
  }

  /** Stops all enemies. */
  stopEnemies() {
    this.level.enemies.forEach(enemy => {
      enemy.canMove = false; enemy.speed = 0;
      enemy.stopMovement = true;
      if (enemy instanceof Endboss) enemy.isAttacking = false;
    });
  }

  /** Starts the game loop. */
  run() {
    setInterval(() => {
      if (!this.gameEnded) this.updateGame();
    }, 1000 / 60);
  }

  /** Updates the game state. */
  updateGame() {
    this.checkCollisions(); this.checkCoins(); this.checkBottles();
    this.checkThrowObjects(); this.getEndboss()?.updateEgg();
    this.checkEggCollision(); this.removeDeletedEnemies();
    this.handleEndboss();
  }

  /** Removes defeated enemies. */
  removeDeletedEnemies() {
    this.level.enemies = this.level.enemies.filter(
      enemy => !enemy.markedForDeletion
    );
  }

  /** Checks if the player lost. */
  checkGameOver() {
    if (this.character.isDead() && !this.gameEnded) this.endGame("loseScreen");
  }

  /** Activates boss and checks victory. */
  handleEndboss() {
    const boss = this.getEndboss();
    if (!boss) return;
    if (!this.endbossTriggered && this.character.x + this.canvas.width >= boss.x) {
      this.endbossTriggered = true; boss.hadFirstContact = true;
    }
    if (boss.energy <= 0 && !this.gameEnded) this.endGame("winScreen");
  }

  /** Returns the current endboss. */
  getEndboss() {
    return this.level.enemies.find(enemy => enemy instanceof Endboss);
  }

  /** Checks if a bottle can be thrown. */
  checkThrowObjects() {
    const now = Date.now(), bar = this.statusBars[1];
    if (!this.canThrow(now, bar)) return;
    this.throwBottle();
    bar.setPercentageBottle(Math.max(bar.percentageBottle - 20, 0));
    this.lastThrowTime = now;
  }

  /** Checks throw conditions.
   * @param {number} now - Current time.
   * @param {StatusBar} bar - Bottle bar.
   */
  canThrow(now, bar) {
    return this.keyboard.D && bar.percentageBottle > 0 &&
      now - this.lastThrowTime > 800;
  }

  /** Creates a thrown bottle. */
  throwBottle() {
    this.throwableObjects.push(
      new ThrowableObject(this.character.x + 100, this.character.y + 100, this)
    );
  }

  /** Checks all enemy collisions. */
  checkCollisions() {
    this.level.enemies.forEach(enemy => {
      if (this.character.isEnemyCollision(enemy)) this.handleEnemyCollision(enemy);
      this.checkBottleEnemyCollision(enemy);
    });
    this.checkGameOver();
  }

  /** Handles an enemy collision.
   * @param {MovableObject} enemy - Enemy.
   */
  handleEnemyCollision(enemy) {
    if (enemy instanceof Chicken) this.handleChicken(enemy);
    if (enemy instanceof Endboss) this.handleBoss(enemy);
  }

  /** Handles a chicken collision.
   * @param {Chicken} enemy - Chicken.
   */
  handleChicken(enemy) {
    if (!enemy.energy || enemy.markedForDeletion) return;
    if (this.isChickenJump(enemy)) this.jumpOnChicken(enemy);
    else this.damageCharacter();
  }

  /** Checks if character jumps on chicken.
   * @param {Chicken} enemy - Chicken.
   */
  isChickenJump(enemy) {
    const bottom = this.character.y + this.character.height;
    return this.character.speedY < 0 && bottom <= enemy.y + 50;
  }

  /** Handles jumping on a chicken.
   * @param {Chicken} enemy - Chicken.
   */
  jumpOnChicken(enemy) {
    enemy.hit(); this.character.y = enemy.y - this.character.height;
    this.character.speedY = 0; this.character.isJumping = false;
    this.playSound(5);
  }

  /** Handles a boss collision.
   * @param {Endboss} enemy - Endboss.
   */
  handleBoss(enemy) {
    if (!this.canDamageBoss(enemy)) return;
    this.lastCharacterHitTime = Date.now();
    this.character.energy = Math.max(this.character.energy - 10, 0);
    this.updateHealth(); this.character.lastHit = Date.now();
    this.pushCharacter(enemy); this.playSound(8);
  }

  /** Checks boss damage conditions.
   * @param {Endboss} enemy - Endboss.
   */
  canDamageBoss(enemy) {
    return !enemy.isDead() && !this.character.isDead() &&
      Date.now() - this.lastCharacterHitTime >= this.characterHitCooldown;
  }

  /** Pushes the character from the boss.
   * @param {Endboss} enemy - Endboss.
   */
  pushCharacter(enemy) {
    const left = this.character.x < enemy.x;
    this.character.x += left ? -20 : 20;
    this.character.otherDirection = left;
  }

  /** Checks egg collision. */
  checkEggCollision() {
    const boss = this.getEndboss();
    if (!boss?.eggActive || this.character.isDead()) return;
    const egg = this.getEggBounds(boss);
    if (this.isCollision(egg)) this.damageFromEgg(boss);
  }

  /** Returns egg collision bounds.
   * @param {Endboss} boss - Endboss.
   */
  getEggBounds(boss) {
    return {
      x: boss.eggX - 12, y: boss.eggY - 18,
      width: 24, height: 36
    };
  }

  /** Checks rectangle collision.
   * @param {Object} object - Collision rectangle.
   */
  isCollision(object) {
    return this.character.x < object.x + object.width &&
      this.character.x + this.character.width > object.x &&
      this.character.y < object.y + object.height &&
      this.character.y + this.character.height > object.y;
  }

  /** Applies egg damage.
   * @param {Endboss} boss - Endboss.
   */
  damageFromEgg(boss) {
    const now = Date.now(); boss.eggActive = false;
    if (now - this.lastCharacterHitTime < this.characterHitCooldown) return;
    this.lastCharacterHitTime = now; this.character.hit();
    this.updateHealth(); this.playSound(8);
  }

  /** Applies character damage. */
  damageCharacter() {
    const now = Date.now();
    if (now - this.lastCharacterHitTime < this.characterHitCooldown) return;
    this.lastCharacterHitTime = now; this.character.hit();
    this.updateHealth(); this.playSound(8);
  }

  /** Updates the health bar. */
  updateHealth() {
    this.statusBars[0].setPercentage(this.character.energy);
  }

  /** Checks bottle collision.
   * @param {MovableObject} enemy - Enemy.
   */
  checkBottleEnemyCollision(enemy) {
    this.throwableObjects.forEach((bottle, index) => {
      if (!bottle.isColliding(enemy)) return;
      enemy.hit(); this.handleBottleHit(enemy);
      this.throwableObjects.splice(index, 1);
    });
  }

  /** Updates boss bar after bottle hit.
   * @param {MovableObject} enemy - Enemy.
   */
  handleBottleHit(enemy) {
    if (enemy instanceof Endboss) {
      this.statusBars[3].setPercentageEndboss(enemy.energy);
      this.playSound(4);
    }
  }

  /** Checks and collects coins. */
  checkCoins() {
    this.collectItems(this.level.coins, this.statusBars[2], "coin");
  }

  /** Checks and collects bottles. */
  checkBottles() {
    this.collectItems(this.level.bottles, this.statusBars[1], "bottle");
  }

  /** Collects an item.
   * @param {Array} items - Items.
   * @param {StatusBar} bar - Status bar.
   * @param {string} type - Item type.
   */
  collectItems(items, bar, type) {
    if (!items || this.isBarFull(bar, type)) return;
    items.forEach((item, index) => {
      if (!this.character.isCollecting(item)) return;
      items.splice(index, 1); this.increaseBar(bar, type);
      this.playSound(2);
    });
  }
  
  /** Checks if a bar is full.
   * @param {StatusBar} bar - Status bar.
   * @param {string} type - Item type.
   */
  isBarFull(bar, type) {
    const value = type === "coin" ? bar.percentageCoins : bar.percentageBottle;
    return value >= 100;
  }

  /** Increases an item bar.
   * @param {StatusBar} bar - Status bar.
   * @param {string} type - Item type.
   */
  increaseBar(bar, type) {
    const property = type === "coin" ? "percentageCoins" : "percentageBottle";
    const value = Math.min(bar[property] + 20, 100);
    if (type === "coin") bar.setPercentageCoins(value);
    else bar.setPercentageBottle(value);
  }

  /** Draws the complete game world. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
    this.drawBackground(); this.drawGameObjects(); this.drawStatusBars();
    requestAnimationFrame(() => this.draw());
  }

  /** Draws background objects. */
  drawBackground() {
    const x = Math.round(this.camera_x);
    this.ctx.translate(x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-x, 0);
  }
  
  /** Draws enemies, items and character. */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character); this.drawBossEgg();
    this.ctx.translate(-this.camera_x, 0);
  }

  /** Draws the boss egg. */
  drawBossEgg() {
    const boss = this.getEndboss();
    if (!boss?.eggActive) return;
    this.ctx.save(); this.ctx.translate(boss.eggX, boss.eggY);
    this.ctx.rotate((boss.eggX - boss.x) * 0.08);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 12, 18, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = "white"; this.ctx.fill();
    this.ctx.strokeStyle = "black"; this.ctx.lineWidth = 2;
    this.ctx.stroke(); this.ctx.restore();
  }

  /** Draws all status bars. */
  drawStatusBars() {
    this.addToMap(this.statusBars[0]);
    this.addToMap(this.statusBars[1]);
    this.addToMap(this.statusBars[2]);
    if (this.endbossTriggered) this.drawEndbossBar();
  }

  /** Positions and draws the boss bar. */
  drawEndbossBar() {
    const bar = this.statusBars[3];
    bar.x = this.canvas.width - bar.width - 10; bar.y = 10;
    this.addToMap(bar);
  }

  /** Adds multiple objects.
   * @param {Array} objects - Objects to draw.
   */
  addObjectsToMap(objects) {
    if (objects) objects.forEach(object => this.addToMap(object));
  }

  /** Draws one object.
   * @param {MovableObject} mo - Object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }
  
  /** Flips an object.
   * @param {MovableObject} mo - Object to flip.
   */
  flipImage(mo) {
    this.ctx.save(); this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1); mo.x *= -1;
  } 

  /** Restores an object's position.
   * @param {MovableObject} mo - Object to restore.
   */
  flipImageBack(mo) {
    mo.x *= -1; this.ctx.restore();
  }
}