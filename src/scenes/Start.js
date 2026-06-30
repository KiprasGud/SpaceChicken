export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        //this.load.image('logo', 'assets/phaser.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        //this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.spritesheet('bird', 'assets/chicken.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('enemyBird', 'assets/chick.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('black', 'assets/space.png');
    }

    create() {
        this.score = 0;
        this.lives = 1;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.g = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);


        this.background = this.add.tileSprite(576, 240, 384 * 3, 480, 'background');
        this.physics.world.setBounds(0, 0, 1152, 480);


        /*
        this.test = this.physics.add.sprite(50,50,'test').setCollideWorldBounds(true);
        this.test.anims.create({
            key: 'mytest',
            frames: this.anims.generateFrameNumbers('test', {start:0, end: 1}),
            frameRate: 12,
            repeat: -1
        });

        this.test.play('mytest');

         */

        this.enemyBird = this.physics.add.group();


        this.anims.create({
            key: 'Fly',
            frames: this.anims.generateFrameNumbers('enemyBird', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.enemy = [];
        this.originalPosX = [];
        this.originalPosY = [];

        for (let i = 0; i < 10; i++) {
            if (i < 5) {
                let randomX = -100 - (i * 300) - (Math.random() * 150);

                this.enemy[i] = this.enemyBird.create(randomX , Math.floor(Math.random() * 350) + 30, 'enemyBird').setBounce(0).setScale(1.5,1.5).setCircle(10, 5,4).setCollideWorldBounds(false).setVelocityX(100);
                this.enemy[i].body.setAllowGravity(false);
                this.enemy[i].setFlipX(true);
                this.enemy[i].play('Fly');
                this.originalPosX[i] = this.enemy[i].x;
                this.originalPosY[i] = this.enemy[i].y;
            }
            else {
                let randomX = 1200 + ((i - 5) * 300) + (Math.random() * 150);

                this.enemy[i] = this.enemyBird.create(randomX, Math.floor(Math.random() * 350) + 30, 'enemyBird').setBounce(0).setScale(1.5,1.5).setCircle(10, 5,4).setCollideWorldBounds(false).setVelocityX(-100);
                this.enemy[i].body.setAllowGravity(false);
                this.originalPosX[i] = this.enemy[i].x;
                this.originalPosY[i] = this.enemy[i].y;
                this.enemy[i].play('Fly');
                this.originalPosX[i] = this.enemy[i].x;
                this.originalPosY[i] = this.enemy[i].y;
            }
        }

        //const logo = this.add.image(640, 200, 'logo');

        //const ship = this.add.sprite(640, 360, 'ship');
        this.bird = this.physics.add.sprite(576,240, 'bird').setBounce(0.2).setCircle(11, 5, 5).setCollideWorldBounds(true);
        this.bird.setScale(1.5, 1.5);

        this.bird.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.bird.play('fly');

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            FontFamily: 'Arcade',
            fontSize: '32px',
            fill: '#ffffff'
        });
        this.scoreText.setFont('MyFont').setFontSize(32);

        this.livesText = this.add.text(16, 48, 'Lives: 1', {
            FontFamily: 'Arcade',
            fontSize: '32px',
            fill: '#ffffff'
        });
        this.livesText.setFont('MyFont').setFontSize(32);

        this.physics.add.collider(this.bird, this.enemyBird, (bird, enemy) => {
            if (!enemy.active || !enemy.body || !enemy.body.enable) return;

            const tolerance = 24;
            const birdBottom = bird.body.bottom;
            const enemyTop = enemy.body.top;
            const horizontallyClose = Math.abs(bird.x - enemy.x) < (enemy.displayWidth * 0.7);
            const isStompPrimary = (birdBottom <= enemyTop + tolerance) && horizontallyClose;

            const fallbackRadius = 40;
            const nearOriginal = enemy.originalX !== undefined && enemy.originalY !== undefined &&
                Math.abs(bird.x - enemy.originalX) < fallbackRadius &&
                Math.abs(bird.y - enemy.originalY) < fallbackRadius;

            const isStomp = isStompPrimary || (nearOriginal && horizontallyClose);

            if (isStomp) {
                this.resetEnemy(enemy);
                this.score += 1;
                this.scoreText.setText('score: ' + this.score);
                bird.setVelocityY(-430);
                return;
            }

            this.lives--;
            this.livesText.setText('lives: ' + this.lives);
            this.resetEnemy(enemy);

            if (this.lives <= 0) {
                this.black = this.add.tileSprite(0,0,1000,1000,'black');

                this.scene.restart();
            }
        }, null, this);





        /*
        function hitBird(bird, enemyBird) {
           if (bird.body.touching.down || enemyBird.body.touching.up || enemyBird.body.touching.topRight)
           {
            enemy.body.enable = false;
                this.cameras.main.shake(150, 0.01);
                this.tweens.add({
                    targets: enemy,
                    y: enemy.y - 10,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 250,
                    ease: 'Power1',
                    onComplete: () => {
                        enemy.setAlpha(1);
                        enemy.setScale(1.5, 1.5);
                        enemy.setPosition(this.originalPosX[this.enemy.indexOf(enemy)], this.originalPosY[this.enemy.indexOf(enemy)]);
                        if (this.enemy.indexOf(enemy) < 5)
                        {
                            enemy.setVelocityX(100);
                        }
                        else {
                            enemy.setVelocityX(-100);
                        }
                        enemy.body.enable = true;
                    }
                });

                bird.setVelocityY(-280);

                return;
            }
           if (enemyBird.body.touching.right || bird.body.touching.right) {
               this.scene.restart();
           }
           if (enemyBird.body.touching.left || bird.body.touching.left) {
               this.scene.restart();
           }
           if (enemyBird.body.touching.down || bird.body.touching.up) {
               this.scene.restart();
           }
        }

         */


/*
        this.tweens.add({
            targets: logo,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

 */

        this.spaceBarPressed = false;


    }




    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && !this.spaceBarPressed) {
            this.bird.setVelocityY(-300);
            this.bird.play('fly');
            this.spaceBarPressed = true;
        }

        if (Phaser.Input.Keyboard.JustUp(this.spaceBar)) {
            this.spaceBarPressed = false;
        }

        if (this.bird.body.velocity.y > 0) {
            this.bird.body.velocity.y = Math.min(this.bird.body.velocity.y + 6, 200);
        }

        if (this.cursors.left.isDown) {
            this.bird.setVelocityX(-160);
            this.bird.setFlipX(false);
        } else if (this.cursors.right.isDown) {
            this.bird.setVelocityX(160);
            this.bird.setFlipX(true);
        }
        else {
            this.bird.setVelocityX(0);
        }

        for (let i = 0; i < 10; ++i) {
            if (i < 5) {
                if (this.enemy[i].x >= 0) {
                    this.enemy[i].setVelocityY(Math.sin(this.enemy[i].x/1152 * 20) * 100);
                }
                if (this.enemy[i].x > 1200) {
                    this.enemy[i].setPosition(this.originalPosX[i], this.originalPosY[i])
                    this.enemy[i].setVelocityY(0);
                }
            }
            else {
                if (this.enemy[i].x >= 0)
                {
                    this.enemy[i].setVelocityY(Math.sin(this.enemy[i].x/1152 * 20) * 100);
                }
                if (this.enemy[i].x < -50) {
                    this.enemy[i].setPosition(this.originalPosX[i], this.originalPosY[i])
                    this.enemy[i].setVelocityY(0);
                }
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.g)) {
            if (this.score >= 10) {
                this.lives++;
                this.score -= 10;
                this.scoreText.setText('score: ' + this.score);
                this.livesText.setText('lives: ' + this.lives);
            }

        }

    }

    resetEnemy(enemy) {
        enemy.body.enable = false;
        this.cameras.main.shake(150, 0.0);
        this.tweens.add({
            targets: enemy,
            y: enemy.y - 10,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 250,
            ease: 'Power1',
            onComplete: () => {
                enemy.setAlpha(1);
                enemy.setScale(1.5, 1.5);
                enemy.setPosition(this.originalPosX[this.enemy.indexOf(enemy)], this.originalPosY[this.enemy.indexOf(enemy)]);
                enemy.setVelocityY(0);
                if (this.enemy.indexOf(enemy) < 5)
                {
                    enemy.setVelocityX(100);
                }
                else {
                    enemy.setVelocityX(-100);
                }
                enemy.body.enable = true;
            }
        });
    }
}
