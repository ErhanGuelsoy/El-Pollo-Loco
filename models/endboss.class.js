/**
 * Represents the endboss and controls movement, attacks,
 * animations, health and egg attacks.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  groundY = 50;
  y = -80;
  energy = 100;
  speed = 1;
  hadFirstContact = false;
  isAttacking = false;
  isJumping = false;
  attackDamageApplied = false;
  lastAttackTime = 0;
  attackCooldown = 1200;
  lastJumpTime = 0;
  jumpCooldown = 3000;
  lastBossHitTime = 0;
  bossHitCooldown = 250;
  animationSpeed = 180;
  lastAnimationTime = 0;
  deathAnimationStarted = false;
  deathAnimationFinished = false;
  deathAnimationStartTime = 0;
  currentImage = 0;
  isThrowingEgg = false;
  lastEggThrowTime = 0;
  eggThrowCooldown = 3000;
  eggX = 0;
  eggY = 0;
  eggSpeed = 9;
  eggSpeedY = 15;
  eggActive = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png"
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png"
  ];

  IMAGES_ENDBOSS_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png"
  ];

  IMAGES_ENDBOSS_DAMAGE = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png"
  ];

  IMAGES_ENDBOSS_DEATH = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png"
  ];

  /** Creates the endboss and starts its systems. */
  constructor() {
    super();
    this.x = 2300;
    this.y = 0;
    this.loadBossImages();
    this.applyGravity();
    this.animate();
  }

  /** Loads all endboss animation images. */
  loadBossImages() {
    this.loadImage(this.IMAGES_ENDBOSS_WALK[0]);
    [
      this.IMAGES_WALKING,
      this.IMAGES_ATTACK,
      this.IMAGES_ENDBOSS_WALK,
      this.IMAGES_ENDBOSS_DAMAGE,
      this.IMAGES_ENDBOSS_DEATH
    ].forEach(images => this.loadImages(images));
  }

  /** Starts the endboss update loop. */
  animate() {
    setInterval(() => {
      if (this.world && !this.world.gameEnded) this.updateBoss();
    }, 1000 / 60);
  }

  /** Updates the boss according to its current state. */
  updateBoss() {
    if (this.isDead()) return this.handleDeath();
    if (this.isHurt()) return this.playDamageAnimation();
    if (this.isAttacking) return;
    if (!this.hadFirstContact) {
      this.img = this.imageCache[this.IMAGES_ENDBOSS_WALK[0]];
      return;
    }
    this.handleBossAction();
    this.updateEgg();
  }

  /** Selects the next boss action. */
  handleBossAction() {
    const distance = Math.abs(this.world.character.x - this.x);

    if (distance > 180 && distance < 500 &&
        !this.isThrowingEgg &&
        Date.now() - this.lastEggThrowTime >= this.eggThrowCooldown) {
      return this.throwEgg();
    }

    if (distance > 180 && distance < 450 &&
        Date.now() - this.lastJumpTime > this.jumpCooldown) {
      return this.jumpAttack();
    }

    if (this.isCharacterInAttackRange()) return this.startAttack();

    this.followCharacter();
    this.playSlowAnimation(this.IMAGES_ENDBOSS_WALK);
  }

  /** Throws an egg toward the character. */
  throwEgg() {
    this.isThrowingEgg = true;
    this.lastEggThrowTime = Date.now();
    this.eggX = this.x + this.width / 2;
    this.eggY = this.y + 180;
    this.eggActive = true;
    this.eggSpeed = this.world.character.x < this.x ? -7 : 7;
    this.eggSpeedY = 15;

    setTimeout(() => this.isThrowingEgg = false, 600);
  }

/**
 * Moves the egg and checks for collisions.
 */
updateEgg() {
  if (!this.eggActive) return;

  this.eggX += this.eggSpeed;
  this.eggY -= this.eggSpeedY;
  this.eggSpeedY -= 0.8;

  const character = this.world.character;

  if (
    !character.isDead() &&
    this.eggX > character.x - 40 &&
    this.eggX < character.x + character.width + 40 &&
    this.eggY > character.y &&
    this.eggY < character.y + character.height
  ) {
    this.eggActive = false;
    this.world.damageCharacter();
    return;
  }

  if (
    this.eggY > this.world.canvas.height ||
    this.eggX < this.x - 600 ||
    this.eggX > this.x + 600
  ) {
    this.eggActive = false;
  }
}

  /** Checks whether the character is within attack range. */
  isCharacterInAttackRange() {
    const c = this.world.character;
    return Math.abs(
      c.x + c.width / 2 - (this.x + this.width / 2)
    ) <= 140;
  }

  /** Moves the boss toward the character. */
  followCharacter() {
    const distance = this.world.character.x - this.x;
    if (distance < -50) this.moveLeft();
    if (distance > 50) this.moveRight();
  }

  /** Performs a jump attack toward the character. */
  jumpAttack() {
    if (this.isJumping) return;

    this.isJumping = true;
    this.speedY = 25;

    const character = this.world.character;
    this.x += character.x < this.x ? -100 : 100;
    this.otherDirection = character.x >= this.x;

    setTimeout(() => {
      this.isJumping = false;
      this.lastJumpTime = Date.now();
    }, 900);
  }

  /** Starts the normal boss attack. */
  startAttack() {
    if (Date.now() - this.lastAttackTime < this.attackCooldown) return;

    this.isAttacking = true;
    this.attackDamageApplied = false;
    this.currentImage = 0;

    const interval = setInterval(() => {
      if (!this.isAttacking) return clearInterval(interval);
      this.playAnimation(this.IMAGES_ATTACK);
    }, 100);

    setTimeout(() => {
      this.isAttacking = false;
      this.lastAttackTime = Date.now();
      clearInterval(interval);
    }, 800);
  }

  /** Handles the boss death animation. */
  handleDeath() {
    this.isAttacking = false;
    this.isJumping = false;
    this.speed = 0;

    if (!this.deathAnimationStarted) {
      this.deathAnimationStarted = true;
      this.deathAnimationStartTime = Date.now();
    }

    const frame = Math.min(
      Math.floor((Date.now() - this.deathAnimationStartTime) / 250),
      this.IMAGES_ENDBOSS_DEATH.length - 1
    );

    if (frame === this.IMAGES_ENDBOSS_DEATH.length - 1)
      this.deathAnimationFinished = true;

    this.img = this.imageCache[this.IMAGES_ENDBOSS_DEATH[frame]];
  }

  /** Plays the damage animation. */
  playDamageAnimation() {
    const frame = Math.min(
      Math.floor((Date.now() - this.lastHit) / 100),
      this.IMAGES_ENDBOSS_DAMAGE.length - 1
    );
    this.img = this.imageCache[this.IMAGES_ENDBOSS_DAMAGE[frame]];
  }

  /**
   * Plays an animation with the configured speed.
   * @param {string[]} images - Animation image paths.
   */
  playSlowAnimation(images) {
    if (Date.now() - this.lastAnimationTime >= this.animationSpeed) {
      this.currentImage = (this.currentImage + 1) % images.length;
      this.lastAnimationTime = Date.now();
    }
    this.img = this.imageCache[images[this.currentImage]];
  }

  /** Handles damage received from the player. */
  hit() {
    if (
      this.isDead() ||
      Date.now() - this.lastBossHitTime < this.bossHitCooldown
    ) return false;

    this.lastBossHitTime = Date.now();
    this.energy = Math.max(this.energy - 10, 0);
    this.lastHit = Date.now();
    this.isAttacking = false;
    this.deathAnimationStarted = false;
    this.deathAnimationFinished = false;

    if (window.gameAudio) window.gameAudio.play(4);
    return true;
  }

  /** Moves the boss to the right. */
  moveRight() {
    if (this.isDead()) return;
    this.x += this.speed;
    this.otherDirection = true;
  }

  /** Moves the boss to the left. */
  moveLeft() {
    if (this.isDead()) return;
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /** Checks whether the boss has no remaining energy. */
  isDead() {
    return this.energy <= 0;
  }
}