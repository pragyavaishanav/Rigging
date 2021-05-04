import * as THREE from './three/build/three.module.js';



const Manage = function (bones) {

    this.defaultPose = {};
    this.currentPose = {};
    this.poseName = 'NoName';
    this.totalFrames = 1;

    var loadedPoseData = {}; // Loaded from DB

    let framePoses = [{}];

    const boneNames = Object.keys(bones);

    // Initialization 
    boneNames.forEach(boneName => {
        let _x = Math.floor(THREE.MathUtils.radToDeg(bones[boneName].rotation.x));
        let _y = Math.floor(THREE.MathUtils.radToDeg(bones[boneName].rotation.y));
        let _z = Math.floor(THREE.MathUtils.radToDeg(bones[boneName].rotation.z));

        this.defaultPose[boneName] = { x: _x, y: _y, z: _z };
        for (var i = 0; i < this.totalFrames; ++i) {
            framePoses[i][boneName] = { x: _x, y: _y, z: _z };
        }
    });

    this.defaultPose['position'] = { 'x': 0, 'y': 0, 'z': 0 };
    this.defaultPose['dumbell'] = false;
    this.defaultPose['bench'] = false;

    this.currentPose['position'] = { 'x': 0, 'y': 0, 'z': 0 };
    this.currentPose['dumbell'] = false;
    this.currentPose['bench'] = false;

    for (var i = 0; i < this.totalFrames; ++i) {
        framePoses[i]['position'] = { 'x': 0, 'y': 0, 'z': 0 };
        framePoses[i]['dumbell'] = false;
        framePoses[i]['bench'] = false;
    } // end of Initialization

    const dataToSave = () => {
        let newData = {};
        Object.keys(this.defaultPose).forEach(key => {
            newData[key] = [];

            for (var i = 0; i < this.totalFrames; ++i) {
                newData[key].push(framePoses[i][key]);
            }
        });
        newData['totalFrames'] = this.totalFrames;

        let saveData = {};
        saveData[this.poseName] = newData;
        return saveData;
    }

    this.addFrame = function (newFramePose) {
        this.totalFrames++;
        framePoses.push(newFramePose);
    }

    this.removeFrame = function () {
        this.totalFrames--;
        framePoses.pop();
    }

    this.setCurrentFrame = function (frameNum) {
        this.currentPose = framePoses[frameNum];
    }

    this.save = function (poseName) {
        this.poseName = poseName;
        const saveData = dataToSave();
        console.log(saveData);
        alert('Current Pose Data is Successfully Saved!');
        $('#poseNameConfirmModal').modal('hide');
    }


    $.get('src/db/db.json', function (data) {
        Object.keys(data).forEach((poseName, index) => {
            $('#poseSelect').append(`<option value="${index}">${poseName}</option>`);
        });
    });

    this.load = function () {
        $.get('src/db/db.json', function (data) {
            loadedPoseData = data;
        });
    }

    this.open = function (poseName) {
        framePoses = [];
        const newData = loadedPoseData[poseName];
        this.totalFrames = newData.totalFrames;

        $('#frameNumber').html('');

        for (var i = 0; i < this.totalFrames; ++i) {
            framePoses.push({});
            $('#frameNumber').append(`<option value="${i}">${i + 1}</option>`);
        }

        Object.keys(this.defaultPose).forEach(key => {
            for (var i = 0; i < this.totalFrames; ++i) {
                framePoses[i][key] = {};
                if (key !== 'dumbell' && key !== 'bench') {
                    framePoses[i][key]['x'] = newData[key][i].x;
                    framePoses[i][key]['y'] = newData[key][i].y;
                    framePoses[i][key]['z'] = newData[key][i].z;
                } else {
                    framePoses[i][key] = newData[key][i];
                }
            }
        });
    }
}

export { Manage };