import * as Phaser from 'phaser';

/**
 * Dernier état lancé par phaser.
 * Celui-ci permet de jouer l'histoire
 *
 * @class Story
 * @extends {Phaser.State}
 */
export default class Story extends Phaser.State {

  // Object
  player: any;
  baddie: any;
  stars: any;
  mountainsBack: any;
  mountainsMid1: any;
  mountainsMid2: any;
  diamond: any;

  // Environment
  platforms: any;
  ground: any;

  // element 
  score: number;
  timer: number;
  isEnd: boolean;
  sound: any;

  // Text
  scoreText: any;
  timerText: any;

  // Events 
  time: any;
  counter: any;

  constructor() {
    super();

    this.isEnd = false;
  }

  /**
   *
   *
   * @param {number} screen_height
   * @param {number} screen_width
   * @param {number} ratio
   * @param {boolean} fullscreen
   * @param {boolean} [restart=false]
   * @memberof Story
   */
  init(
    screen_height: number,
    screen_width: number,
    ratio: number,
    fullscreen: boolean,
    restart: boolean = false
  ) {}

  /**
   *
   *
   * @memberof Story
   */
  create() {
    // * Setup the game
    this.game.world.setBounds(0, 0, 1400, 1800);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // * Background gradient same as Boot
    let background = this.game.add.bitmapData(this.game.width, this.game.height);
    let grd = background.context.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#FB7BA2");
    grd.addColorStop(1, "#FCE043");
    background.context.fillStyle = grd;
    background.context.fillRect(0, 0, this.game.width, this.game.height);
    let backSprite = this.game.add.sprite(0, 0, background);
    backSprite.fixedToCamera = true;
    backSprite.cameraOffset.setTo(0, 0);

    // * Platform 
    this.createEnvironment();

    // * Partie player 
    this.createPlayer();

    // * Bad guy 
    this.createBaddie();

    // * Stars 
    this.stars = this.game.add.group();
    this.stars.enableBody = true;

    for (let i = 0; i < 12; i++) {
      this.createStar(i * 125);
    }

    // * Score
    this.createScore();
    // * Timer
    this.createTimer();

    // * Diamond 
    this.createDiamond();

    // * Sound
    this.sound = this.game.add.audio('ding');
  }

  /**
   *
   *
   * @memberof Story
   */
  update() {
    // collide players to the platform
    let hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);
    hitPlatform = this.game.physics.arcade.collide(this.baddie, this.platforms);

    // cursor /  arrow key
    let cursors = this.game.input.keyboard.createCursorKeys();

    // Movement of the player 
    this.setupPlayerMovement(cursors, hitPlatform);

    // Movement of the bad guys 
    if (this.baddie.x <= 0) {
      this.baddie.body.velocity.x = 150;

    } else if (this.baddie.x >= 1272 || (this.baddie.x === 500 && this.baddie.body.velocity.x === 0)) {
      this.baddie.body.velocity.x = -150;

    }

    this.game.physics.arcade.collide(this.stars, this.platforms);
    this.game.physics.arcade.collide(this.diamond, this.platforms);
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, undefined, this);
    this.game.physics.arcade.overlap(this.player, this.baddie, this.killPlayer, undefined, this);
    this.game.physics.arcade.overlap(this.player, this.diamond, this.collectDiamond, undefined, this);
  }

  /**
   *  * Function to create the environment of the game.
   * @memberof Story
   */
  createEnvironment() {
    // * Parallax mountain
    this.getParallaxMountain();

    // * Platforms group
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    this.ground.scale.setTo(4, 4);
    this.ground.body.immovable = true;

    // * A Platform
    let ledge = this.platforms.create(400, 1600, 'ground');
    ledge.body.immovable = true;

    // * A Platform
    ledge = this.platforms.create(-150, 1500, 'ground');
    ledge.body.immovable = true;

    // * A Platform
    ledge = this.platforms.create(1100, 1550, 'ground');
    ledge.body.immovable = true;

  }

  /** 
   * * Function to create a player  
   * @memberof Story
   */
  createPlayer() {
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

    this.game.physics.arcade.enable(this.player);

    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    this.game.camera.follow(this.player);
  }

  /**
   * * Function which it setup player movement
   * @param cursors 
   * @param hitPlatform 
   */
  setupPlayerMovement(cursors: any, hitPlatform: any) {
    this.player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      this.player.body.velocity.x = -150;

      if (this.player.x > 410 && this.player.x <= 980) {
        this.mountainsBack.tilePosition.x += 0.05;
        this.mountainsMid1.tilePosition.x += 0.3;
        this.mountainsMid2.tilePosition.x += 0.75;
      }

      this.player.animations.play('left');

    } else if (cursors.right.isDown) {
      this.player.body.velocity.x = 150;

      if (this.player.x >= 410 && this.player.x <= 980) {
        this.mountainsBack.tilePosition.x -= 0.05;
        this.mountainsMid1.tilePosition.x -= 0.3;
        this.mountainsMid2.tilePosition.x -= 0.75;
      }

      this.player.animations.play('right');

    } else if (cursors.down.isDown ||
      (cursors.down.isDown && cursors.left.isDown) ||
      (cursors.down.isDown && cursors.right.isDown)) {
      this.player.body.velocity.y = 300;

    } else {
      this.player.animations.stop();
      this.player.frame = 4;

    }

    if (cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
      this.player.body.velocity.y = -315;

    }
  }

  /**
   * * Function to create a bad guy 
   * @memberof Story
   */
  createBaddie() {
    this.baddie = this.game.add.sprite(500, this.game.world.height - 150, 'baddie');

    this.game.physics.arcade.enable(this.baddie);

    this.baddie.body.bounce.y = 0.2;
    this.baddie.body.gravity.y = 300;
    this.baddie.body.collideWorldBounds = true;
  }

  /**
   * * Function to create the score
   * @memberof Story
   */
  createScore() {
    this.score = 0;

    this.scoreText = this.game.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#000"
    });
    this.scoreText.fixedToCamera = true;
    this.scoreText.cameraOffset.setTo(16, 16);
  }

  /**
   * * Function to create a timer
   * @memberof Story
   */
  createTimer() {
    this.timer = 10;

    this.time = this.game.time.events.loop(Phaser.Timer.SECOND * this.timer, this.endgame, this);
    this.counter = this.game.time.events.loop(Phaser.Timer.SECOND, this.decrement, this)

    this.timerText = this.game.add.text(550, 16, "Remaining : " + this.timer, {
      fontSize: "32px",
      color: "#000"
    });
    this.timerText.fixedToCamera = true;
    this.timerText.cameraOffset.setTo(550, 16);

  }

  /**
   * * Function to decrement the timer  
   * @memberof Story
   */
  decrement() {
    if (this.timer > 0) {
      this.timer--;
    }
    this.timerText.text = "Remaining : " + this.timer;

  }

  /**
   * * Function to create a star
   * @param {number} coordX
   * @memberof Story
   */
  createStar(coordX: number) {
    if (coordX) {
      let star = this.stars.create(coordX, 1300, 'star');

      star.body.gravity.y = 80;
      star.body.bounce.y = 0.2 + Math.random() * 0.2;
    }
  }

  /**
   * *  Function to collect star
   * @param {*} player
   * @param {*} star
   * @memberof Story
   */
  collectStar(player: any, star: any) {
    if (player && star && !this.isEnd) {
      // this.sound.play();
      star.kill();

      this.score += 10;
      this.scoreText.text = "Score : " + this.score;

      this.createStar(Math.random() * this.game.world.width);
    }
  }

  /**
   * Function to create Diamond
   *
   * @memberof Story
   */
  createDiamond() {
    this.diamond = this.game.add.sprite(Math.random() * this.game.world.width , 1300, 'diamond');
    this.game.physics.arcade.enable(this.diamond);

    this.diamond.body.gravity.y = 80;
    this.diamond.body.bounce.y = 0.2 + Math.random() * 0.2;
  }

  /**
   * *  Function to collect diamond
   * @param {*} player
   * @param {*} star
   * @memberof Story
   */
  collectDiamond(player: any, diamond: any) {
    if (player && diamond && !this.isEnd) {
      // this.sound.play();
      diamond.kill();

      this.timer += 10;
      this.game.time.events.remove(this.time);
      this.time = this.game.time.events.loop(Phaser.Timer.SECOND * this.timer, this.endgame, this);
      this.timerText.text = "Remaining : " + this.timer;
      
      this.createDiamond();
    }
  }

  /**
   * * Function to kill the player
   * @memberof Story
   */
  killPlayer(player: any, baddie: any) {
    player.kill();
    this.endgame();
  }

  /**
   * Function to get Parallax mountain
   * @memberof Story
   */
  getParallaxMountain() {
    this.mountainsBack = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage('mountains-back').height,
      this.game.width,
      this.game.cache.getImage('mountains-back').height,
      'mountains-back'
    );
    this.mountainsBack.fixedToCamera = true;
    this.mountainsBack.cameraOffset.setTo(0, this.game.height - this.game.cache.getImage('mountains-back').height + 200);

    this.mountainsMid1 = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage('mountains-mid1').height,
      this.game.width,
      this.game.cache.getImage('mountains-mid1').height,
      'mountains-mid1'
    );
    this.mountainsMid1.fixedToCamera = true;
    this.mountainsMid1.cameraOffset.setTo(0, this.game.height - this.game.cache.getImage('mountains-mid1').height + 200);

    this.mountainsMid2 = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage('mountains-mid2').height,
      this.game.width,
      this.game.cache.getImage('mountains-mid2').height,
      'mountains-mid2'
    );
    this.mountainsMid2.fixedToCamera = true;
    this.mountainsMid2.cameraOffset.setTo(0, this.game.height - this.game.cache.getImage('mountains-mid2').height + 200);
  }

  /**
   * * Function to end the game
   * @memberof Story
   */
  endgame() {
    console.log("this is the end");
    this.isEnd = true;

    this.game.time.events.remove(this.counter);
    this.game.time.events.remove(this.time);

    let endText = this.game.add.text(280, 200, "Game is over", {
      fontSize: "50px",
      color: "#000"
    });

    endText.fixedToCamera = true;
    endText.cameraOffset.setTo(250, 100);

    this.scoreText.cameraOffset.setTo(325, 225);

    let endButton = this.game.add.button(400, 300, 'button', this.restart, this);

    endButton.width = 70;
    endButton.height = 70;
    endButton.fixedToCamera = true;
    endButton.cameraOffset.setTo(370, 300);
  }

  /**
   * * Function to restart the game
   * @memberof Story
   */
  restart() {
    this.createEnvironment();
    this.createPlayer();
    this.createScore();
    this.createTimer();

    this.isEnd = false;

    this.game.state.restart();
  }

  render() {
    // * this.elementsPhaserDebug.map((elem: any) => {
    // *    this.game.debug.spriteInfo(elem, 20, 20);
    // *   this.game.debug.spriteBounds(elem);
    // *   //this.game.debug.spriteCorners(elem, true, true);
    // * });
  }
}