import * as Phaser from 'phaser';

/**
 * Ecran de chargement
 * Celui-ci permet de charger les élements de l'histoire
 *
 * @class Preloader
 * @extends {Phaser.State}
 */
export default class Preloader extends Phaser.State {
  isLoad: boolean;

  constructor() {
    super();

    this.isLoad = false;
  }

  /**
   * Fonction de chargement des éléments de l'histoire
   *
   * @memberof Preloader
   */
  async preload() {

    // await this.game.load.tilemap('mario', '../src/assets/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    // await this.game.load.image('tiles', '../src/assets/tiles/super_mario.png');
    
    await this.game.load.audio('ding', '../src/assets/audio/ding.mp3');
    await this.game.load.image('mountains-back', '../src/assets/tiles/mountains-back.png');
		await this.game.load.image('mountains-mid1', '../src/assets/tiles/mountains-mid1.png');
		await this.game.load.image('mountains-mid2', '../src/assets/tiles/mountains-mid2.png');
    await this.game.load.spritesheet("dude", '../src/assets/images/dude.png', 32, 48);
    await this.game.load.spritesheet("baddie", '../src/assets/images/baddie.png', 32, 48);
    await this.game.load.image('sky', '../src/assets/images/sky.png');
    await this.game.load.image('ground', '../src/assets/images/platform.png');
    await this.game.load.image('star', '../src/assets/images/star.png');
    await this.game.load.image('button', '../src/assets/images/button.png');
    
    await this.load.onFileComplete.add(this.fileComplete, this);

    await this.load.onFileComplete.add(this.startStory, this);

  }

  /**
   * Function to check if all file is loaded
   * @param {number} progress
   * @param {*} cacheKey
   * @param {*} success
   * @param {number} totalLoaded
   * @param {number} totalFiles
   * @memberof Preloader
   */
  fileComplete( progress: number, cacheKey: any, success: any, totalLoaded: number, totalFiles: number) {
    console.log(" ♻️ FilesComplete === ", progress, "%");

    if (progress === 100) {
      this.isLoad = true;
    }
  }

  /**
   * Lancement de l'histoire
   * Si des fichiers se trouvent dans la liste des erreurs on retente de lancer une routine
   * @memberof Preloader  
  */
  startStory() {
    if (this.isLoad) {
      this.game.state.start("Story", true, false);
    }
  }
}
