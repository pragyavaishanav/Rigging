import * as THREE from './three/build/three.module.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';

async function load(loaderIcon) {

    const loader = new GLTFLoader();

    const [modelData,] = await Promise.all([

        loader.loadAsync('assets/model.glb')
    ]);


    loaderIcon.style.display = 'none';

    let bench;
    let dumbell = {};
    const model = modelData.scene;

    bench = model.children[1];

    const bones = {};

    model.traverse(m => {
        if (m.isBone) {
            bones[m.name] = m;
            if (m.name === 'NLeftHand' || m.name === 'NRightHand') {
                dumbell[m.name] = m.children[5];
            }
        }
    });
    model.remove(model.children[1]);
    return { model, bones, dumbell, bench };
}

export { load };