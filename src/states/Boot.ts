import * as Phaser from 'phaser';

/**
 * Premier état lancé par Phaser.
 * Celui-ci permet de charger l'écran de chargement et d'init les paramétres du player
 *
 * @class Boot
 * @extends {Phaser.State}
 */
export default class Boot extends Phaser.State {

  needCanvas: Function | null;

  platforms: any;
  mountainsBack: any;
  mountainsMid1: any;
  mountainsMid2: any;


  constructor(needCanvas: Function | null) {
    super();
    this.needCanvas = needCanvas;
  }

  /**
   * Premiere fonction lancé. On applique tous les paramétres
   *
   * @memberof Boot
   */
  preload() {
    if (this.needCanvas) {
      this.needCanvas();
    }

    this.game.load.image('sky', '../src/assets/images/sky.png');
    this.game.load.image('ground', '../src/assets/images/platform.png');
    this.game.load.image('star', '../src/assets/images/star.png');
    this.game.load.image('button', '../src/assets/images/button.png');
    this.game.load.image('mountains-back', '../src/assets/tiles/mountains-back.png');
		this.game.load.image('mountains-mid1', '../src/assets/tiles/mountains-mid1.png');
		this.game.load.image('mountains-mid2', '../src/assets/tiles/mountains-mid2.png');
    this.game.load.spritesheet('dude', '../src/assets/images/dude.png', 32, 48);
    this.game.load.spritesheet('baddie', '../src/assets/images/baddie.png', 32, 48);

  }

  /**
   * Deuxième fonction lancé par Phaser une fois que les images sont chargés
   * Ici on charge les fonts
   *
   * @memberof Boot
   */
  create() {
    /** 
     * Partie platform / env
     */
    this.game.world.setBounds(0, 0, 1400, 1200); 
    this.game.physics.startSystem(Phaser.Physics.ARCADE); // moteur 

    // * Background gradient same as Story
    let background = this.game.add.bitmapData(this.game.width, this.game.height);
    let grd = background.context.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#FB7BA2");
    grd.addColorStop(1, "#FCE043");
    background.context.fillStyle = grd;
    background.context.fillRect(0, 0, this.game.width, this.game.height);
    this.game.add.sprite(0, 0, background);

    this.getParallaxMountain();

    this.game.add.text(200, 100, "Title of this Game", {fontSize: "50px", color: "#fff"});
    this.game.add.text(350, 225, "Play !!", {fontSize: "50px", color: "#fff"});
    let btn = this.game.add.button(370, 300, 'button', this.actionPlay, this);
    btn.width = 70;
    btn.height = 70;
  }

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
    this.mountainsMid2.cameraOffset.setTo(0, this.game.height - this.game.cache.getImage('mountains-mid2').height + 200 );
  }

  actionPlay() {
    // run preload ==>
    this.game.state.start("Preloader", true, false);
  }
}