Game.Preloader = function(game) {
    this.preloaderBar = null; 
}; 

Game.Preloader.prototype = {
    preload:function() {
        // setting for the preload bar
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, "preloaderBar"); 
        this.preloadBar.anchor.setTo(0.5,0.5); 
        this.time.advancedTiming = true; 
        // preload starfield png created in photoshop
        // with a key of background
        this.game.load.image("background", "assets/starfield.png");
        // preload ship height 
        // with a key of playerShip
        this.load.image("playerShip", "assets/ship.png");  
        // preload enemy ship
        this.load.image("enemyShip", "assets/enemy.png"); 
        // preload particles for player ship
        this.load.image("playerShipParticles", "assets/blast.png"); 
        // preload bullet
        this.load.image("bullet", "assets/bullet.png");
    }, 

    create:function() {
        this.state.start("Level1"); 
    }
}