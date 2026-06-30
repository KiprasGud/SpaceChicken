import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1152,
    height: 480,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 900},
        }
    },
    //antialias: true,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            