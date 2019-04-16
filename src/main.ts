/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />
import 'pixi';
import 'p2';

import * as Phaser from 'phaser';

window.Phaser = window.Phaser || Phaser;

declare global {
  interface Window {
    Phaser: Phaser;
    GAME: any;
    game: any;
  }

  function require(string: string): any;
}

import BootState from './states/Boot';
import PreloaderState from './states/Preloader';
import Story from './states/Story';

import config from './config';

/**
 * Moteur du player à instancier
 *
 * @export
 * @class Game
 * @extends {Phaser.Game}
 */
export default class Game extends Phaser.Game {
  divElement: HTMLElement;

  constructor(height: number, width: number, divId: string) {
    // On donne aux variables leurs valeurs par defaut
    // Pour instancier Phaser
    let finalWidth = config.gameWidth;
    let finalHeight = config.gameHeight;

    const divElement = document.getElementById(divId ? divId : '');
    if (divElement) {
      finalWidth = divElement.offsetWidth;
      finalHeight = divElement.offsetHeight;
    }

    if (height) {
      finalHeight = height;
    }
    if (width) {
      finalWidth = width;
    }

    super(finalWidth, finalHeight, Phaser.CANVAS, divId, null, false);

    // On regarde si il est necessaire de créer une div ou si il y en a déjà une (divElement)
    let needCanvas = false;
    if (divElement) {
      this.divElement = divElement;
    } else {
      needCanvas = true;
    }
     // On ajoute les états de l'application

    // Boot pour charger l'interface de chargement
    this.state.add('Boot', new BootState(null), false);
    // Preloader pour charger tous les éléments de l'histoire
    this.state.add(
      'Preloader',
      new PreloaderState(),
      false
    );

    // Story pour jouer l'histoire
    this.state.add(
      'Story',
      new Story(),
      false
    );

    // Une fois tous les états définis on lance le premier état Boot
    this.state.start('Boot', true, true);
  }


}

window.GAME = Game;