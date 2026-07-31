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
        new StatusBar("health", 0),
        new StatusBar("bottle", 70),
        new StatusBar("coins", 140),
        new StatusBar("endboss", 210)
    ];

    throwableObjects = [];
    lastThrowTime = 0;
    lastCharacterHitTime = 0;
    characterHitCooldown = 300;
    endbossTriggered = false;
    gameEnded = false;

    /**
     * Creates a new game world.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Assigns the world to character and all enemies.
     */
    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Displays the win screen.
     */
    showWinScreen() {
        document
            .getElementById("winScreen")
            .classList
            .remove("hidden");
    }

    /**
     * Displays the lose screen.
     */
    showLoseScreen() {
        document
            .getElementById("loseScreen")
            .classList
            .remove("hidden");
    }

    /**
     * Starts the game loop.
     */
    run() {
        setInterval(() => {
            if (this.gameEnded) return;

            this.checkCollisions();
            this.checkCoins();
            this.checkBottles();
            this.checkThrowObjects();

            this.level.enemies =
                this.level.enemies.filter(
                    enemy =>
                        !enemy.markedForDeletion
                );

            this.handleMovement();
            this.handleEndboss();

        }, 1000 / 60);
    }

    /**
     * Checks whether the player has died.
     */
    checkGameOver() {
        if (
            this.character.isDead() &&
            !this.gameEnded
        ) {
            this.gameEnded = true;

            this.disableCharacterMovement();
            this.stopAllEnemies();

            this.showLoseScreen();

            if (window.stopAllSounds) {
                window.stopAllSounds();
            }
        }
    }

    /**
     * Disables all player controls.
     */
    disableCharacterMovement() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.DOWN = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
    }

    /**
     * Completely stops all enemies when the game ends.
     */
    stopAllEnemies() {
        this.level.enemies.forEach(enemy => {
            enemy.canMove = false;
            enemy.speed = 0;
            enemy.stopMovement = true;

            if (enemy instanceof Endboss) {
                enemy.isAttacking = false;
            }
        });
    }

    /**
     * Handles character movement.
     */
    handleMovement() {}

    /**
     * Handles endboss activation and defeat.
     */
    handleEndboss() {
        const endboss =
            this.level.enemies.find(
                enemy =>
                    enemy instanceof Endboss
            );

        if (!endboss) return;

        if (
            this.character.x >= 2000 &&
            !this.endbossTriggered
        ) {
            this.endbossTriggered = true;
            endboss.hadFirstContact = true;
        }

        if (
            endboss.energy <= 0 &&
            !this.gameEnded
        ) {
            this.gameEnded = true;

            this.disableCharacterMovement();
            this.stopAllEnemies();

            this.showWinScreen();

            if (window.stopAllSounds) {
                window.stopAllSounds();
            }
        }
    }

    /**
     * Checks whether the character can throw a bottle.
     */
    checkThrowObjects() {
        const now = Date.now();
        const bottleBar =
            this.statusBars[1];

        if (
            this.keyboard.D &&
            bottleBar.percentageBottle > 0 &&
            now - this.lastThrowTime > 800
        ) {
            const bottle =
                new ThrowableObject(
                    this.character.x + 100,
                    this.character.y + 100,
                    this
                );

            this.throwableObjects.push(bottle);

            this.lastThrowTime = now;

            bottleBar.setPercentageBottle(
                Math.max(
                    bottleBar.percentageBottle - 20,
                    0
                )
            );
        }
    }

    /**
     * Checks collisions between characters, enemies and bottles.
     */
    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            this.checkCharacterEnemyCollision(enemy);
            this.checkBottleEnemyCollision(enemy);
        });

        this.checkGameOver();
    }

    /**
     * Checks collision between character and enemy.
     */
    checkCharacterEnemyCollision(enemy) {
        if (
            !this.character.isColliding(enemy)
        ) {
            return;
        }

        if (enemy instanceof Chicken) {
            this.handleChickenCollision(enemy);
            return;
        }

        if (enemy instanceof Endboss) {
            this.handleEndbossCollision(enemy);
        }
    }

    /**
     * Handles collision between character and chicken.
     */
    handleChickenCollision(enemy) {
        if (
            enemy.energy <= 0 ||
            enemy.markedForDeletion
        ) {
            return;
        }

        const characterBottom =
            this.character.y +
            this.character.height;

        const isFallingOnChicken =
            this.character.speedY < 0 &&
            characterBottom <= enemy.y + 50;

        if (isFallingOnChicken) {
            enemy.hit();

            /**
             * Places the character directly
             * on top of the chicken.
             */
            this.character.y =
                enemy.y -
                this.character.height;

            /**
             * IMPORTANT:
             * Do not create another jump.
             */
            this.character.speedY = 0;
            this.character.isJumping = false;

            if (window.gameAudio) {
                window.gameAudio.play(0);
            }

            return;
        }

        const now = Date.now();

        if (
            now - this.lastCharacterHitTime >=
            this.characterHitCooldown
        ) {
            this.lastCharacterHitTime = now;

            this.character.hit();

            this.statusBars[0].setPercentage(
                this.character.energy
            );
        }
    }

    /**
     * Handles collision between character and endboss.
     */
    handleEndbossCollision(enemy) {
        if (
            enemy.isDead() ||
            this.character.isDead()
        ) {
            return;
        }

        const now = Date.now();

        if (
            now - this.lastCharacterHitTime <
            this.characterHitCooldown
        ) {
            return;
        }

        this.lastCharacterHitTime = now;

        this.character.energy =
            Math.max(
                this.character.energy - 20,
                0
            );

        this.statusBars[0].setPercentage(
            this.character.energy
        );

        this.character.lastHit =
            Date.now();

        if (
            this.character.x <
            enemy.x
        ) {
            this.character.x -= 20;
            this.character.otherDirection = true;
        } else {
            this.character.x += 20;
            this.character.otherDirection = false;
        }

        if (window.gameAudio) {
            window.gameAudio.play(0);
        }
    }

    /**
     * Checks bottle collisions with enemies.
     */
    checkBottleEnemyCollision(enemy) {
        this.throwableObjects.forEach(
            (bottle, index) => {

                if (
                    !bottle.isColliding(enemy)
                ) {
                    return;
                }

                if (enemy instanceof Endboss) {
                    enemy.hit();

                    this.statusBars[3]
                        .setPercentageEndboss(
                            enemy.energy
                        );

                    if (window.gameAudio) {
                        window.gameAudio.play(4);
                    }
                } else {
                    enemy.hit();
                }

                this.throwableObjects.splice(
                    index,
                    1
                );
            }
        );
    }

    /**
     * Checks whether the character collects a coin.
     * Uses smaller hitboxes so the character
     * must actually touch the coin.
     */
    isCollectingCoin(coin) {
        const characterLeft =
            this.character.x + 45;

        const characterRight =
            this.character.x +
            this.character.width -
            45;

        const characterTop =
            this.character.y + 70;

        const characterBottom =
            this.character.y +
            this.character.height -
            30;

        const coinLeft =
            coin.x + 35;

        const coinRight =
            coin.x +
            coin.width -
            35;

        const coinTop =
            coin.y + 35;

        const coinBottom =
            coin.y +
            coin.height -
            35;

        return (
            characterRight >= coinLeft &&
            characterLeft <= coinRight &&
            characterBottom >= coinTop &&
            characterTop <= coinBottom
        );
    }

    /**
     * Checks whether the character collects coins.
     */
    checkCoins() {
        if (!this.level.coins) {
            return;
        }

        this.level.coins.forEach(
            (coin, index) => {

                if (
                    !this.isCollectingCoin(coin)
                ) {
                    return;
                }

                this.level.coins.splice(
                    index,
                    1
                );

                const coinBar =
                    this.statusBars[2];

                const newCoins =
                    Math.min(
                        coinBar.percentageCoins + 20,
                        100
                    );

                coinBar.setPercentageCoins(
                    newCoins
                );

                if (window.gameAudio) {
                    window.gameAudio.play(2);
                }
            }
        );
    }

    /**
     * Checks whether the character collects bottles.
     */
    checkBottles() {
        if (!this.level.bottles) {
            return;
        }

        const bottleBar =
            this.statusBars[1];

        if (
            bottleBar.percentageBottle >= 100
        ) {
            return;
        }

        this.level.bottles.forEach(
            (bottle, index) => {

                if (
                    !this.isCollectingItem(bottle)
                ) {
                    return;
                }

                this.level.bottles.splice(
                    index,
                    1
                );

                const newBottle =
                    Math.min(
                        bottleBar.percentageBottle + 20,
                        100
                    );

                bottleBar.setPercentageBottle(
                    newBottle
                );

                if (window.gameAudio) {
                    window.gameAudio.play(2);
                }
            }
        );
    }

    /**
     * Checks whether the character collects an item.
     */
    isCollectingItem(item) {
        const characterLeft =
            this.character.x + 10;

        const characterRight =
            this.character.x +
            this.character.width -
            10;

        const characterTop =
            this.character.y + 10;

        const characterBottom =
            this.character.y +
            this.character.height -
            10;

        const itemLeft =
            item.x + 2;

        const itemRight =
            item.x +
            item.width -
            2;

        const itemTop =
            item.y + 2;

        const itemBottom =
            item.y +
            item.height -
            2;

        return (
            characterRight >= itemLeft &&
            characterLeft <= itemRight &&
            characterBottom >= itemTop &&
            characterTop <= itemBottom
        );
    }

    /**
     * Clears canvas and renders all game objects.
     */
    draw() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.ctx.translate(
            this.camera_x,
            0
        );

        this.addObjectsToMap(
            this.level.backgroundObjects
        );

        this.addObjectsToMap(
            this.level.clouds
        );

        this.ctx.translate(
            -this.camera_x,
            0
        );

        this.addToMap(
            this.statusBars[0]
        );

        this.addToMap(
            this.statusBars[1]
        );

        this.addToMap(
            this.statusBars[2]
        );

        if (this.endbossTriggered) {
            const endbossBar =
                this.statusBars[3];

            endbossBar.x =
                this.canvas.width -
                endbossBar.width -
                10;

            endbossBar.y = 10;

            this.addToMap(
                endbossBar
            );
        }

        this.ctx.translate(
            this.camera_x,
            0
        );

        this.addObjectsToMap(
            this.level.enemies
        );

        if (this.level.coins) {
            this.addObjectsToMap(
                this.level.coins
            );
        }

        if (this.level.bottles) {
            this.addObjectsToMap(
                this.level.bottles
            );
        }

        this.addObjectsToMap(
            this.throwableObjects
        );

        this.addToMap(
            this.character
        );

        this.ctx.translate(
            -this.camera_x,
            0
        );

        requestAnimationFrame(
            () => this.draw()
        );
    }

    /**
     * Adds multiple objects to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds one object to the map.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image horizontally.
     */
    flipImage(mo) {
        this.ctx.save();

        this.ctx.translate(
            mo.width,
            0
        );

        this.ctx.scale(
            -1,
            1
        );

        mo.x *= -1;
    }

    /**
     * Restores the original image direction.
     */
    flipImageBack(mo) {
        mo.x *= -1;

        this.ctx.restore();
    }
}