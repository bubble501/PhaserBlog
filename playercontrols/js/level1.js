Game.Level1 = function(game){}; 
// variables 
var background;
var controls = {};
var player; 

Game.Level1.prototype = {
    create:function (game) {
    // reference to the background png
    background = this.game.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, "background");
    // create player
    player = this.add.sprite(this.world.centerX, this.world.centerY + 250, "playerShip");
    player.anchor.setTo(0.5,0.5);
    player.scale.setTo(0.4,0.4);
    this.physics.arcade.enable(player);
    // ship controls
    controls = {
        right: this.input.keyboard.addKey(Phaser.Keyboard.D),
        left: this.input.keyboard.addKey(Phaser.Keyboard.A)
    };
    }, 
    // Update funtion, desires to be called 60 time a second. 
    update: function () {
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
    }
}
