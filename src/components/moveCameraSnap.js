
const L = Math.sqrt(50);

const absPos = [
    [0, 3, 10],
    [L, 3, L],
    [10, 3, 0],
    [L, 3, -L],
    [0, 3, -10],
    [-L, 3, -L],
    [-10, 3, 0],
    [-L, 3, L],
];
const pos = [
    [0, 3, 10],
    [L, 3, L],
    [10, 3, 0],
    [L, 3, -L],
    [0, 3, -10],
    [-L, 3, -L],
    [-10, 3, 0],
    [-L, 3, L],
];

const updatePos = function (orbit, position) {
    orbit.target.set(position.x, position.y + 3, position.z);
    for (var i = 0; i < pos.length; ++i) {
        pos[i][0] = absPos[i][0] + position.x;
        pos[i][1] = absPos[i][1] + position.y;
        pos[i][2] = absPos[i][2] + position.z;
    }
}


const cameraMove = function (orbit, camera, cameraPos) {

    gsap.to(camera.position, {
        duration: 0.2,
        x: cameraPos[0],
        y: cameraPos[1],
        z: cameraPos[2],
        onUpdate: function () {
            orbit.update();
        }
    });
}

const moveCameraSnap = function (model, orbit, mouse, camera) {

    let hSteps = 0;

    let readyStatus = false;

    $('#scene-container').on('pointerdown', event => {
        if (!event.altKey) {
            readyStatus = true;
        }
    });
    $('#scene-container').on('pointermove', event => {
        readyStatus = false;
    });
    $('#scene-container').on('pointerup', event => {
        if (!event.altKey && readyStatus && event.button === 0) {
            updatePos(orbit, model.position);
            if (mouse.x > 0)
                ++hSteps;
            else
                --hSteps;

            if (hSteps == 8) hSteps = 0;
            if (hSteps === -1) hSteps = 7;
            // camera.position.set(pos[hSteps][0], pos[hSteps][1], pos[hSteps][2])
            cameraMove(orbit, camera, pos[hSteps]);
        }
    });
}

export { moveCameraSnap };