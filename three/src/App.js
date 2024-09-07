import React, { useEffect } from 'react';
import * as THREE from 'three';
import { scene } from './loadingmodel';

const App = () => {
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Set background color to sky blue
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    camera.position.z = 5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onClick(event) {
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
      }
    }

    function onMiddleClick(event) {
      if (event.button === 1) { // Middle mouse button
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          const point = intersects[0].point;
          camera.position.set(point.x, point.y, point.z + 5); // Adjust the camera position
          camera.lookAt(point);
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    window.addEventListener('mousedown', onMiddleClick, false);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove, false);
      window.removeEventListener('click', onClick, false);
      window.removeEventListener('mousedown', onMiddleClick, false);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <h1>Three.js Model in React, click and goes red</h1>
    </div>
  );
};

export default App;