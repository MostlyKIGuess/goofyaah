import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();

loader.load('heart_on_pyramid_stand.glb', function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

export { scene, loader };