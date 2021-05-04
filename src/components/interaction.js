import * as THREE from './three/build/three.module.js';


const Interaction = function (ui, camera, controls, orbit, container) {

    this.mouse = new THREE.Vector2();

    const raycaster = new THREE.Raycaster();

    $('#scene-container').on('pointerup', event => {
        controls.enabled = true;
    });


    // Alt + LMB To Select Bone
    $('#scene-container').on('pointerdown', event => {
        if (event.button === 1) controlPanel();
        if (event.button === 2) {
            controls.setSize(0.7);
            controls.setMode('rotate')
            raycaster.setFromCamera(this.mouse, camera);
            const intersects = raycaster.intersectObjects(ui.scene.children, true);
            intersects.forEach(ele => {

                if (ele.object.type === 'Mesh' && ele.object.name.includes('_bone')) {

                    const boneName = ele.object.name.split('_')[0];
                    const bone = ui.bones[boneName];

                    controls.attach(bone);

                    ui.setActiveBone(bone);

                    bone.add(ui.pointer);
                    // ui.pointer.visible = true;

                    $('#bodyPartSelect').val(ui.getIndex(boneName));

                    $("#rotX").val(Math.floor(THREE.MathUtils.radToDeg(bone.rotation.x)));
                    $("#rotY").val(Math.floor(THREE.MathUtils.radToDeg(bone.rotation.y)));
                    $("#rotZ").val(Math.floor(THREE.MathUtils.radToDeg(bone.rotation.z)));
                }
            })
        }
    });


    $('#scene-container').on('pointermove', event => {

        if (event.altKey) controls.enabled = false;
        else controls.enabled = true;
        this.mouse.x = ((event.clientX - container.offsetParent.offsetLeft) / container.clientWidth) * 2 - 1;
        this.mouse.y = - ((event.clientY - container.offsetParent.offsetTop) / container.clientHeight) * 2 + 1;

    });

    let isPanel = true;
    const controlPanel = function () {
        if (isPanel) {
            $('.panel').fadeOut(500);
            $('.instruction').fadeOut(500);
            isPanel = false;
        } else {
            $('.panel').fadeIn(500);
            $('.instruction').fadeIn(500);
            isPanel = true;
        }
    }

    $(document).on('keydown', (event) => {
        if (event.keyCode === 72 || event.button === 1) {
            controlPanel();
        }
    });
}


export { Interaction };