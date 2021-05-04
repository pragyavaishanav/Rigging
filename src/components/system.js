import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './three/TransformControls.js'


function Scene() {

    const scene = new THREE.Scene();
    // scene.add(new THREE.AxesHelper(2))
    return scene;
}


function Camera(container) {

    const fov = 45;
    const near = 0.1;
    const far = 10000;
    const aspect = container.clientWidth / container.clientHeight;

    const frustumSize = 8;

    const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, near, far); //new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(0, 3, 10);

    return camera;
}


function Lights() {

    const ambientLight = new THREE.HemisphereLight(
        'white',
        'darkslategrey',
        0.5,
    );

    return ambientLight;
}


function Controls(camera, renderer) {

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 3, 0);
    orbit.enablePan = false;
    orbit.enableZoom = false;
    orbit.enableRotate = false;

    const controls = new TransformControls(camera, renderer.domElement);
    controls.setMode("rotate");
    controls.setSize(0.7);
    controls.setRotationSnap(THREE.MathUtils.degToRad(30));
    controls.setTranslationSnap(0.1);

    return [orbit, controls];
}


function Renderer() {

    const renderer = new THREE.WebGLRenderer({ antialias: true, antialias: true, alpha: true, preserveDrawingBuffer: true });

    renderer.outputEncoding = THREE.sRGBEncoding;

    return renderer;
}

function setSize(container, camera, renderer) {

    const aspect = container.clientWidth / container.clientHeight;

    const frustumSize = 8;
    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);


}


class Resizer {

    constructor(container, camera, renderer) {

        setSize(container, camera, renderer);

        window.addEventListener('resize', () => {

            setSize(container, camera, renderer);

            this.onResize();
        });
    }

    onResize() { }

}


export { Scene, Camera, Lights, Renderer, Controls, Resizer };