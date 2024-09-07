import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();

loader.load('low_poly_simple_city/scene.gltf', function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

const dogModelPromise = new Promise((resolve, reject) => {
    loader.load('heart_on_pyramid_stand.glb', function (gltf) {
        const dogModel = gltf.scene;
        dogModel.name = 'dogModel';
        dogModel.position.set(14, 0, 10); 
        scene.add(dogModel);
        resolve(dogModel);
    }, undefined, function (error) {
        console.error(error);
        reject(error);
    });
});

export { scene , dogModelPromise };