// initialize kaboom context
kaboom({
    global: true, // so you don't have to use kaboom.loadSprite etc
    crisp: true, // for crisp pixel art
    width: 320, // width of canvas
    height: 240, // height of canvas
    scale: 3 // scales the game up
})

//                  SPRITES
//          name sprite     sprite location
loadSprite('skele', './assets/imgs/sprites/skele/skele.png', {
    sliceX: 4,
    sliceY: 6,
    gridWidth: 4,
    gridHeight: 6,
    anims: {
        down: {
            from: 0,
            to: 3
        },
        up: {
            from: 4,
            to: 7
        },
        move: {
            from: 12,
            to: 15
        },
        idle: {
            from: 16,
            to: 19
        },
        jump: {
            from: 20,
            to: 23
        }
    }
});

//                  BACKGROUND SPRITES
loadSprite('top-left', './assets/imgs/backgrounds/top-left.png');
loadSprite('top-mid', './assets/imgs/backgrounds/top-mid.png');
loadSprite('top-right', './assets/imgs/backgrounds/top-right.png');
loadSprite('mid-right', './assets/imgs/backgrounds/mid-right.png');
loadSprite('mid-left', './assets/imgs/backgrounds/mid-left.png');
loadSprite('mid-mid', './assets/imgs/backgrounds/mid-mid.png');
loadSprite('bot-left', './assets/imgs/backgrounds/bot-left.png');
loadSprite('bot-mid', './assets/imgs/backgrounds/bot-mid.png');
loadSprite('bot-right', './assets/imgs/backgrounds/bot-right.png');

//                  SOUNDS
loadSound('blip', './assets/sounds/blip.wav');
loadSound('hurt', './assets/sounds/hurt.wav');

// creates the order of the layers
layers([
    'bg',
    'obj',
    'ui',
], 'obj'); // defaults as obj

// define a scene
scene("main", () => {

    // add a text at position
    add([
        text("menu", 32),
        pos(100, 100),
        layer('ui'),
    ]);

    // on key press, switches scenes
    keyPress('space', () => {
        play('blip', {
            volume: 5.0
        });
        go('game');
    });

});

scene('game', () => {
    add([
        text('game', 32),
        pos(100, 100),
        layer('ui'),
    ]);

    const player = add([
        sprite('skele'),
        pos(100, 100),
        scale(1),
        origin('center'),
        body(),
        'player',
        'killable',
        { speed: 160 },
    ]);

    const map = addLevel([
        '=------------------]',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '(                  )',
        '^                  )',
        '=^^^^--------------]',
    ], {
        width: 16,
        height: 16,
        pos: vec2(0, 0),
        '=': [
            sprite('top-left'),
            solid()
        ],
        '-': [
            sprite('top-mid'),
            solid()
        ],
        ']': [
            sprite('top-right'),
            solid()
        ],
        '(': [
            sprite('mid-left'),
            solid()
        ],
        ')': [
            sprite('mid-right'),
            solid()
        ],
        '^': [
            sprite('top-left'),
            solid(),
            'hurt'
        ]
    });

    player.collides('hurt', () => {
        play('hurt', {
            volume: 5.0
        });
    });

    keyPress('space', () => {
        play('blip', {
            volume: 5.0
        });
        go('main');
    });

    keyDown(['left', 'right'], () => {
        if (player.grounded() && player.curAnim() !== 'move') {
            player.play('move');
        }
    });

    keyRelease(['left', 'right'], () => {
        if (!keyIsDown('right') && !keyIsDown('left')) {
            player.play('idle');
        }
    });

    keyDown('left', () => {
        player.flipX(1);
        player.move(-player.speed, 0);
    });

    keyDown('right', () => {
        player.flipX(-1);
        player.move(player.speed, 0);
    });
})

// start the game
start("main");