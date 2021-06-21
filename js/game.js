// initialize kaboom context
kaboom({
    global: true, // so you don't have to use kaboom.loadSprite etc
    crisp: true, // for crisp pixel art
    width: 320, // width of canvas
    height: 240, // height of canvas
    scale: 3 // scales the game up
});

loadSprite('survivor', '../assets/imgs/sprites/survivor/survivor-blue_idle+walk+jump-4strip.png', {
    sliceX: 4,
    sliceY: 3,
    gridWidth: 4,
    gridHeight: 2,
    anims: {
        idle: {
            from: 0,
            to: 3
        },
        move: {
            from: 4,
            to: 7
        },
        jumpup: {
            from: 8,
            to: 8
        },
        jumpdown: {
            from: 9,
            to: 9
        }
    }
});

loadSprite('npc-idle', '../assets/imgs/sprites/npc/npc-blue_idle.gif');

//////////////////////////////////////////////////////////
//                  BACKGROUND SPRITES                  //
//////////////////////////////////////////////////////////
loadSprite('brick-bot-mid', '../assets/imgs/backgrounds/brick/brick-bot.png');
loadSprite('brick-left', '../assets/imgs/backgrounds/brick/brick_left-bot-end.png');
loadSprite('brick-right', '../assets/imgs/backgrounds/brick/brick_right-top-end.png');
loadSprite('brick-one', '../assets/imgs/backgrounds/brick/brick_one.png');
loadSprite('lava-brick-one', '../assets/imgs/backgrounds/brick/lava-brick_one.png');

//////////////////////////////////////////////////////////
//                  SOUNDS                              //
//////////////////////////////////////////////////////////
loadSound('blip', './assets/sounds/blip.wav');
loadSound('hurt', './assets/sounds/hurt.wav');
loadSound('hit', './assets/sounds/hit.wav');

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
        text(`
            -Menu-
        Start: 
            Space
        Movement: 
            WASD or Arrows
        Jump: 
            W, Space or Up
        Restart: 
            R
        `, 10),
        pos(0, 50),
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
    const left = ['a', 'left'];
    const right = ['d', 'right'];
    const jump = ['w', 'space', 'up'];

    const player = add([
        sprite('survivor'), // sprite being used
        pos(100, 100),
        scale(1),
        origin('center'),
        body({ jumpForce: 320, }),
        'player', // tags
        'killable', // tags
        { speed: 160 },
    ]);

    const npcs = {
        'n': {
            sprite: 'npc-idle',
            msg: `Oh hello there friend.\nDon't touch the ouchie bricks!`
        }
    };

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
        '(      n           )',
        '(      --          )',
        '(                  )',
        '(         --       )',
        '^                  )',
        '=^^^^--------------]',
    ], {
        width: 16,
        height: 16,
        pos: vec2(0, 0),
        '=': [
            sprite('brick-left'),
            solid()
        ],
        '-': [
            sprite('brick-bot-mid'),
            solid()
        ],
        ']': [
            sprite('brick-right'),
            solid()
        ],
        '(': [
            sprite('brick-one'),
            solid()
        ],
        ')': [
            sprite('brick-one'),
            solid()
        ],
        '^': [
            sprite('lava-brick-one'),
            solid(),
            'hurt'
        ],
        any(ch) {
            const char = npcs[ch];
            if (char) {
                return [
                    sprite(char.sprite),
                    solid(),
                    'character',
                    {
                        msg: char.msg
                    },
                ];
            }
        },
    });

    let talking =null;

    function talk(msg) {
        talking = add([
            text(msg, 5, {
                width: 160
            }),
            pos(50, 130)
        ]);
    };

    const health = add([
        text('100', 10),
        pos(4, 4),
        layer('ui'),
        {
            value: 100,
        },
    ]);

    player.collides('character', (ch) => {
        keyPress([left, right], () => {
            if (talking) {
                destroy(talking);
                talking = null;
            }
        });
        talk(ch.msg);
    })


    health.action(() => {
        player.collides('hurt', () => {
            health.value -= 10;
            play('hurt', {
                volume: 5.0
            });
        });
        if (health.value <= 0) {
            destroy(player);
            go('main');
        }

        health.text = `Health: ${health.value}`;
    })

    // restarts game
    keyPress('r', () => {
        play('blip', {
            volume: 5.0
        });
        go('game');
    });

    keyDown([left, right], () => {
        if (player.grounded() && player.curAnim() !== 'move') {
            player.play('move');
        }
    });

    keyRelease([left, right], () => {
        if (!keyIsDown(right) && !keyIsDown(left)) {
            player.play('idle');
        }
    });
    
    keyDown(left, () => {
        player.flipX(-1);
        player.move(-player.speed, 0);
    });
    
    keyDown(right, () => {
        player.flipX(1);
        player.move(player.speed, 0);
    });
    
    // key is pressed, starts animation
    keyPress(jump, () => {
        if (player.grounded() && player.curAnim() !== 'jump') {
            play('hit', {
                volume: 5.0
            });
            player.play('jumpup');
            player.jump(player.jumpForce);
        }
    });

    // when key is released, stops animation
    keyRelease(jump, () => {
        if (!keyIsDown('space') && !keyIsDown('up') && !keyIsDown('w')) {
            player.play('idle');
        }
    });
});

// start the game
start("main");