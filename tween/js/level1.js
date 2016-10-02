Game.Level1 = function(game){}; 
// variables 
var background;
var controls = {};
var player; 
var enemies;

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
    this.createEnemies(2);

    // ship controls
    controls = {
        right: this.input.keyboard.addKey(Phaser.Keyboard.D),
        left: this.input.keyboard.addKey(Phaser.Keyboard.A)
    };
    }, 
    // Update funtion, desires to be called 60 time a second. 
    update: function () {
        // scrolls background
        background.tilePosition.y += 2;
        // When player removes finger from A or D 
        // this will set the velocity back to zero 
        // to stop the ship from moving
        player.body.velocity.x = 0; 
        // conditional check if key 
        // is being pressed down (A or D keys)
        if (controls.right.isDown) {
            player.body.velocity.x += 275; 
        }
        if (controls.left.isDown) {
            player.body.velocity.x -= 275; 
        }
    }, 
    createEnemies: function(count) {
    for(var y = 0; y < count; y++) {
        for(var x = 0; x < 5; x++) {
            var enemy = enemies.create(x*58,y*60,'enemyShip');
            enemy.anchor.setTo(0.5,0.5);
            enemy.scale.setTo(0.3,0.3);
            enemy.body.moves = false;
        }
    }
    enemies.x = 100; 
    enemies.y = 50; 
    var tween = this.add.tween(enemies).to( { x: this.game.world.width - 400 }, 7000, Phaser.Easing.Linear.None, true, 0, 10000, true);
    tween.onRepeat.add(function() { enemies.y += 10 }, this);
    }
}
