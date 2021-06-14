// initialize kaboom context
const k = kaboom();

// define a scene
k.scene("main", () => {

    // add a text at position (100, 100)
    k.add([
        k.text("ohhimark", 32),
        k.pos(100, 100),
    ]);

});

// start the game
k.start("main");