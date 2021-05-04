import * as THREE from './three/build/three.module.js';
import { grab_hand } from './hand.js';


const controlBones = {
    'Head': 'NHead',
    'Right Arm': 'NRightArm',
    'Right Forearm': 'NRightForeArm',
    'Right Hand': 'NRightHand',
    'Right Thigh': 'NRightUpLeg',
    'Right Calf': 'NRightLeg',
    'Right Foot': 'NRightFoot',
    'Left Arm': 'NLeftArm',
    'Left Forearm': 'NLeftForeArm',
    'Left Hand': 'NLeftHand',
    'Left Thigh': 'NLeftUpLeg',
    'Left Calf': 'NLeftLeg',
    'Left Foot': 'NLeftFoot',
    'Core': 'NSpine',
    'Hip': 'NHips',
}


const UI = function (model, bones, dumbell, bench, scene, controls, manager) {

    Object.keys(controlBones).forEach((boneName, index) => {
        $('#bodyPartSelect').append(`<option value="${index}">${boneName}</option>`);
    });

    let selectedBone;

    this.scene = scene;

    this.bones = bones;

    this.init = function () {

        const geo = new THREE.CylinderGeometry(0, 0.1, 0.7, 6);
        geo.translate(0, 0.3, 0);

        this.pointer = new THREE.Mesh(geo,
            new THREE.MeshLambertMaterial({
                color: 0xff0000,
                depthTest: false,
                transparent: true,
                opacity: 0.5
            })
        );
        this.scene.add(this.pointer);
        this.pointer.visible = false;


        const boneHelperMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.8, 6),
            new THREE.MeshBasicMaterial({ color: 0xffff00, visible: false, depthTest: false }));
        boneHelperMesh.geometry.translate(0, 0.4, 0);

        Object.values(controlBones).forEach(boneName => {
            let m;
            if (!boneName.includes('Hand')) {
                m = boneHelperMesh.clone();
            } else {
                m = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.3, 0.3, 0.4, 6),
                    new THREE.MeshBasicMaterial({ color: 0xffff00, visible: false, depthTest: false })
                );
                m.geometry.translate(0, 0.3, 0);
            }
            m.name = boneName + '_bone';
            this.bones[boneName].add(m);
        });

        this.changeFrame(0);
    }

    this.getIndex = function (boneName) {
        let boneNames = Object.values(controlBones);
        return boneNames.indexOf(boneName);
    }

    this.changeFrame = function (frame) {
        manager.setCurrentFrame(frame);
        Object.keys(bones).forEach(boneName => {
            bones[boneName].rotation.set(
                THREE.MathUtils.degToRad(manager.currentPose[boneName].x),
                THREE.MathUtils.degToRad(manager.currentPose[boneName].y),
                THREE.MathUtils.degToRad(manager.currentPose[boneName].z)
            )
        });

        model.position.x = manager.currentPose.position.x / 10;
        model.position.y = manager.currentPose.position.y / 10;
        model.position.z = manager.currentPose.position.z / 10;
        $('#posX').val(manager.currentPose.position.x);
        $('#posY').val(manager.currentPose.position.y);
        $('#posZ').val(manager.currentPose.position.z);

        dumbell.NRightHand.visible = dumbell.NLeftHand.visible = manager.currentPose.dumbell;
        bench.visible = manager.currentPose.bench;
        $('#dumbell').prop('checked', manager.currentPose.dumbell);
        $('#bench').prop('checked', manager.currentPose.bench);
        if (selectedBone) {
            updateSpinners(
                manager.currentPose[selectedBone.name].x,
                manager.currentPose[selectedBone.name].y,
                manager.currentPose[selectedBone.name].z
            );
        }
    }

    this.setActiveBone = function (bone) { selectedBone = bone; }
    this.getActiveBone = function () { return selectedBone; }

    const updateSelectedBone = function (_x, _y, _z) {
        selectedBone.rotation.set(
            THREE.MathUtils.degToRad(_x),
            THREE.MathUtils.degToRad(_y),
            THREE.MathUtils.degToRad(_z)
        );
    };
    const updateSpinners = function (_x, _y, _z) {// update Spinners & CurrentPose
        $("#rotX").val(_x);
        $("#rotY").val(_y);
        $("#rotZ").val(_z);
    }
    const updateCurrentPose = function (_x, _y, _z) {
        manager.currentPose[selectedBone.name].x = _x;
        manager.currentPose[selectedBone.name].y = _y;
        manager.currentPose[selectedBone.name].z = _z;
    }


    const grabHand = function () {
        for (var key in grab_hand) {
            manager.currentPose[key].x = grab_hand[key][0].x;
            manager.currentPose[key].y = grab_hand[key][0].y;
            manager.currentPose[key].z = grab_hand[key][0].z;

            bones[key].rotation.x = THREE.MathUtils.degToRad(grab_hand[key][0].x);
            bones[key].rotation.y = THREE.MathUtils.degToRad(grab_hand[key][0].y);
            bones[key].rotation.z = THREE.MathUtils.degToRad(grab_hand[key][0].z);
        }
    }
    const releaseHand = function () {
        for (var key in grab_hand) {
            manager.currentPose[key].x = manager.defaultPose[key].x;
            manager.currentPose[key].y = manager.defaultPose[key].y;
            manager.currentPose[key].z = manager.defaultPose[key].z;

            bones[key].rotation.x = THREE.MathUtils.degToRad(manager.defaultPose[key].x);
            bones[key].rotation.y = THREE.MathUtils.degToRad(manager.defaultPose[key].y);
            bones[key].rotation.z = THREE.MathUtils.degToRad(manager.defaultPose[key].z);
        }
    }


    //Gizmo Change Event
    controls.addEventListener('dragging-changed', function (event) {
        if (controls.mode === 'rotate') {
            if (selectedBone) {
                const _x = Math.floor(THREE.MathUtils.radToDeg(selectedBone.rotation.x));
                const _y = Math.floor(THREE.MathUtils.radToDeg(selectedBone.rotation.y));
                const _z = Math.floor(THREE.MathUtils.radToDeg(selectedBone.rotation.z));
                updateSpinners(_x, _y, _z);
                updateCurrentPose(_x, _y, _z);
            }
        } else {//translate
            $("#posX").val(Math.floor(model.position.x * 10));
            $("#posY").val(Math.floor(model.position.y * 10));
            $("#posZ").val(Math.floor(model.position.z * 10));

            // if (model.position.y < 0) {
            //     controls.detach(model);
            //     model.position.y = 0;
            //     controls.attach(model);
            //     $("#posY").val(0);
            // }

            manager.currentPose.position.x = model.position.x * 10;
            manager.currentPose.position.y = model.position.y * 10;
            manager.currentPose.position.z = model.position.z * 10;
        }
    });

    //Select Body Part Change Event
    $('#bodyPartSelect').change(() => {
        controls.setSize(0.7);
        controls.setMode('rotate');
        const idx = parseInt($('#bodyPartSelect').children("option:selected").val());
        const key = Object.keys(controlBones)[idx];
        const selectedBoneName = controlBones[key];

        if (selectedBoneName) {
            selectedBone = this.bones[selectedBoneName];
            // this.pointer.visible = true;
            selectedBone.add(this.pointer);

            controls.attach(selectedBone);

            updateSpinners(
                manager.currentPose[selectedBoneName].x,
                manager.currentPose[selectedBoneName].y,
                manager.currentPose[selectedBoneName].z
            );

        } else {
            this.pointer.visible = false;
            updateSpinners(0, 0, 0);
            controls.setSize(0);
            selectedBone = null;
        }
    });
    const spinnerChange = function () {
        if (selectedBone) {
            updateSelectedBone($("#rotX").val(), $("#rotY").val(), $("#rotZ").val());
            updateCurrentPose($("#rotX").val(), $("#rotY").val(), $("#rotZ").val());
        }
    }
    $("#rotX").on("change", spinnerChange);
    $("#rotY").on("change", spinnerChange);
    $("#rotZ").on("change", spinnerChange);


    //Move Avatar Change Event
    const posChange = function () {
        const k = 10;
        model.position.set($("#posX").val() / k, $("#posY").val() / k, $("#posZ").val() / k);
        manager.currentPose.position.x = $("#posX").val();
        manager.currentPose.position.y = $("#posY").val();
        manager.currentPose.position.z = $("#posZ").val();
    }
    $("#posX").on("change", posChange);
    $("#posY").on("change", posChange);
    $("#posZ").on("change", posChange);

    //Object Checkbox Event
    if (true) {
        $('#dumbell').change(() => {
            if ($('#dumbell').prop('checked')) {
                dumbell.NRightHand.visible = true;
                dumbell.NLeftHand.visible = true;
                manager.currentPose.dumbell = true;
                grabHand();
            } else {
                dumbell.NRightHand.visible = false;
                dumbell.NLeftHand.visible = false;
                manager.currentPose.dumbell = false;
                releaseHand();
            }
        });
        $('#bench').change(() => {
            if ($('#bench').prop('checked')) {
                bench.visible = true;
                manager.currentPose.bench = true;
            } else {
                bench.visible = false;
                manager.currentPose.bench = false;
            }
        })
    }

    // Reset Selected Bone
    $('#resetBtn').click(() => {
        if (selectedBone) {
            const _x = manager.defaultPose[selectedBone.name].x;
            const _y = manager.defaultPose[selectedBone.name].y;
            const _z = manager.defaultPose[selectedBone.name].z;
            updateSelectedBone(_x, _y, _z);
            updateSpinners(_x, _y, _z);
            updateCurrentPose(_x, _y, _z);
        } else {
            alert('No Body Part Selected');
        }
    });

    $('#resetAllBtn').click(() => {
        Object.keys(bones).forEach(boneName => {

            bones[boneName].rotation.set(
                THREE.MathUtils.degToRad(manager.defaultPose[boneName].x),
                THREE.MathUtils.degToRad(manager.defaultPose[boneName].y),
                THREE.MathUtils.degToRad(manager.defaultPose[boneName].z)
            );

            manager.currentPose[boneName].x = manager.defaultPose[boneName].x;
            manager.currentPose[boneName].y = manager.defaultPose[boneName].y;
            manager.currentPose[boneName].z = manager.defaultPose[boneName].z;
        });

        model.position.set(0, 0, 0);
        manager.currentPose.position.x = 0;
        manager.currentPose.position.y = 0;
        manager.currentPose.position.z = 0;

        manager.currentPose.dumbell = false;
        manager.currentPose.bench = false;

        $('#dumbell').prop('checked', false);
        $('#dumbell').change();
        $('#bench').prop('checked', false);
        $('#bench').change();
        $('#posX').val(0);
        $('#posY').val(0);
        $('#posZ').val(0);
        $('#bodyPartSelect').val('-1');
        $('#bodyPartSelect').change();
    })

    $('#moveAvatarBtn').click(() => {
        controls.setSize(0.7);
        controls.attach(model);
        controls.setMode("translate");
    });

    // Animation Part
    $('#frameNumber').change(() => {
        const currentFrame = parseInt($('#frameNumber').children("option:selected").val());
        this.changeFrame(currentFrame);
    });

    $('#addFrameBtn').click(() => {
        if (manager.totalFrames > 7) {
            alert("You can't add more than 8 frames.");
        } else {
            $('#frameNumber').append(`<option value="${manager.totalFrames}">${manager.totalFrames + 1}</option>`);
            $('#frameNumber').val(manager.totalFrames);
            let newFramePose = {};

            for (var boneName in bones) {
                newFramePose[boneName] = {
                    x: manager.currentPose[boneName].x,
                    y: manager.currentPose[boneName].y,
                    z: manager.currentPose[boneName].z,
                }
            }
            newFramePose['position'] = {
                x: manager.currentPose.position.x,
                y: manager.currentPose.position.y,
                z: manager.currentPose.position.z,
            }
            newFramePose['dumbell'] = manager.currentPose.dumbell;
            newFramePose['bench'] = manager.currentPose.bench;
            manager.addFrame(newFramePose);
            manager.setCurrentFrame(manager.totalFrames - 1);
            this.changeFrame(manager.totalFrames - 1);
        }
    });

    $('#removeFrameBtn').click(() => {
        if (manager.totalFrames < 2) {
            alert("There should be at least 1 frame.");
        } else {
            $(`#frameNumber option[value=${manager.totalFrames - 1}]`).remove();
            $('#frameNumber').val(manager.totalFrames - 2);
            manager.removeFrame();
        }
    });


    let stopAnimation;
    $('#playBtn').click(() => {

        const currentState = $('#playBtn').html();

        if (currentState === 'Play') {

            $('#playBtn').html('Stop');
            controls.setSize(0);
            this.pointer.visible = false;
            let frame = 0;
            stopAnimation = setInterval(() => {
                this.changeFrame(frame);
                $('#frameNumber').val(frame);
                ++frame;
                if (frame > manager.totalFrames - 1) frame = 0;
            }, 1000);
        } else {

            $('#playBtn').html('Play');
            clearInterval(stopAnimation);
        }
    });


    // save data
    $('#saveBtn').click(() => {
        manager.save($('#poseName').val());
    })

    $('#saveModalBtn').click(() => {
        if ($('#poseName').val() === '') {
            alert('Please Input Pose Name')
        } else {
            $('#poseNameConfirmModal').modal('show');
        }
    })


    //load bone data
    $('#loadBtn').click(() => {
        manager.load();
        this.changeFrame(0);
    })

    $('#openPoseBtn').click(() => {
        const poseName = $('#poseSelect').children("option:selected").html();
        manager.open(poseName);
        this.changeFrame(0);
        $('#poseSelectModal').modal('hide');
        $('#poseName').val(poseName);
    });

}

export default UI;




