Game.Level1 = function(game){}; 
// variables 
var background;
var controls = {};
var player; 
var enemies;
var emitter;
var bullets;
var fireControl;
var bulletTime = 0; 
var explosion; 
var explosionSound;
var enemyBullets; 
var enemyBulletTime = 0; 
var livingEnemies = [];
var playerShipExplosion;
var enemyShotSound;
var playerShotSound;


Game.Level1.prototype = {
    create:function (game) {
    // reference to the background png
    background = this.game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, "background");
    // create player
    player = this.add.sprite(this.world.centerX, this.world.centerY + 250, "playerShip");
    player.anchor.setTo(0.5,0.5);
    player.scale.setTo(0.4,0.4);
    this.physics.arcade.enable(player);
    // Keeps player on screen
    player.body.collideWorldBounds = true;

    // create enemy group
    enemies = this.add.group(); 
    enemies.enableBody = true; 
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.createEnemies(4);

    // create player's ship particles
    emitter = this.add.emitter(player.x, player.y + 35, 50);  
    emitter.minParticleScale = 0.1; 
    emitter.maxParticleScale = 1.4; 
    emitter.minParticleSpeed.setTo(-30, 30); 
    emitter.maxParticleSpeed.setTo(30, -30);
    emitter.makeParticles("playerShipParticles");
    emitter.gravity = 900;
    emitter.start(false, 2000, 50);

    // create enemy ship explosion particles
    explosion = this.add.emitter(enemies.x, enemies.y + 35, 15); 
    explosion.minParticleScale = 0.1; 
    explosion.maxParticleScale = 1.4;  
    explosion.minParticleSpeed.setTo(-30, 30); 
    explosion.maxParticleSpeed.setTo(30, -30);
    explosion.makeParticles("enemyExplosion");
    explosion.gravity = -500;

    // create player ship explosion particles
    playerShipExplosion = this.add.emitter(enemies.x, enemies.y + 35, 15);  
    playerShipExplosion.minParticleScale = 0.1; 
    playerShipExplosion.maxParticleScale = 1.4;  
    playerShipExplosion.minParticleSpeed.setTo(-30, 30); 
    playerShipExplosion.maxParticleSpeed.setTo(30, -30);
    playerShipExplosion.makeParticles("playerShipExplosion");

    // sound effects
    explosionSound = this.game.add.audio("enemyExplosionSound");
    enemyShotSound = this.game.add.audio("enemyShotSound");
    playerShotSound = this.game.add.audio("playerShotSound");

    // creates bullets
    bullets = game.add.group();
    bullets.enableBody = true; 
    bullets.physicsBodyType = Phaser.Physics.ARCADE; 
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // creates enemy bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true; 
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE; 
    enemyBullets.createMultiple(30, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    // reference for spacebar
    fireControl = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // ship controls
    controls = {
        right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    };
    }, 
    // Update funtion, desires to be called 60 time a second. 
    update: function () {
        // collision handlers
        this.physics.arcade.overlap(bullets, enemies, this.collisionBullet, null, this);
        this.physics.arcade.overlap(enemyBullets, player, this.collisionEnemyBullet, null, this);
        // allows for particles to follow player ship
        emitter.x = player.x;
        // scrolls background
        background.tilePosition.y += 2;
        // When player removes finger from LEFT or RIGHT keys 
        // this will set the velocity back to zero 
        // to stop the ship from moving
        player.body.velocity.x = 0; 
        // conditional check if key 
        // is being pressed down (LEFT or RIGHT keys)
        if (controls.right.isDown) {
            player.body.velocity.x += 275; 
        }
        if (controls.left.isDown) {
            player.body.velocity.x -= 275; 
        }
        // is spacebar being pressed down
        if (fireControl.isDown) {
            this.fireBullet();
        }
        this.fireEnemyBullet();
    }, 
    createEnemies: function(count) {
    for(var y = 0; y < count; y++) {
        for(var x = 0; x < 6; x++) {
            enemy = enemies.create(x*58,y*60,'enemyShip');
            enemy.anchor.setTo(0.5,0.5);
            enemy.scale.setTo(0.3,0.3);
            enemy.body.moves = false;
        }
    }
    enemies.x = 100; 
    enemies.y = 50; 
    //  moving the group, rather than individually.
    var tween = this.add.tween(enemies).to( { x: this.game.world.width - 400 }, 7000, Phaser.Easing.Linear.None, true, 0, 10000, true);
    tween.onRepeat.add(function() { enemies.y += 10 }, this);
    },
    fireBullet: function() {
        if(this.time.now > bulletTime) { 
            bullet = bullets.getFirstExists(false); 
            if(bullet) {
                playerShotSound.play();
                bullet.reset(player.x, player.y - 30);
                bullet.body.velocity.y = -600;
                bulletTime = this.time.now + 200;
            }
        }   
    },
    fireEnemyBullet: function() {
        livingEnemies.length = 0; 
        enemies.forEachAlive(function(enemy){
            livingEnemies.push(enemy)
        });

        if(this.time.now > enemyBulletTime) { 
            enemyBullet = enemyBullets.getFirstExists(false); 
            if(enemyBullet && livingEnemies.length > 0) {
                enemyShotSound.play();
                var random = this.rnd.integerInRange(0, livingEnemies.length - 1);
                var shooter = livingEnemies[random];
                enemyBullet.reset(shooter.body.x, shooter.body.y + 30);
                enemyBulletTime = this.time.now + 500;
                this.physics.arcade.moveToObject(enemyBullet,player,600);
            }
        }   
    },
    collisionBullet: function(bullet, enemy) {
        explosionSound.play();
        explosion.x = bullet.x;
        explosion.start(true, 200, null, 1);
        bullet.kill();
        enemy.kill();
    },
    collisionEnemyBullet: function(enemyBullets, player) {
        emitter.on = false;
        explosionSound.play();
        playerShipExplosion.x = player.x;
        playerShipExplosion.y = player.y;
        playerShipExplosion.start(true, 100000, null, 7);
        enemyBullets.kill();
        player.kill();
    }
}