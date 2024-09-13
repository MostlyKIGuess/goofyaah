import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { scene, dogModelPromise } from './loadingmodel'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = () => {
  const [followModel, setFollowModel] = useState(true);

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); 
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    camera.position.z = 10;
    camera.position.y = 20;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25; 
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2; 
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let dogModel;
    dogModelPromise.then((model) => {
      dogModel = model;
      console.log('Dog model loaded:', dogModel);
      controls.target.copy(dogModel.position); 

      function onKeyDown(event) {
        const step = 1; 
        if (dogModel) {
          const forward = new THREE.Vector3();
          camera.getWorldDirection(forward);
          forward.normalize();
          forward.y = 0;

          const right = new THREE.Vector3();
          right.crossVectors(forward, camera.up).normalize();
          right.y = 0; 

          switch (event.key) {
            case 'w':
              dogModel.position.add(forward.multiplyScalar(step));
              break;
            case 's':
              dogModel.position.add(forward.multiplyScalar(-step));
              break;
            case 'a':
              dogModel.position.add(right.multiplyScalar(-step));
              break;
            case 'd':
              dogModel.position.add(right.multiplyScalar(step));
              break;
            default:
              break;
          }
          controls.target.copy(dogModel.position); 
        } else {
          switch (event.key) {
            case 'ArrowUp':
              camera.position.z -= step;
              break;
            case 'ArrowDown':
              camera.position.z += step;
              break;
            case 'ArrowLeft':
              camera.position.x -= step;
              break;
            case 'ArrowRight':
              camera.position.x += step;
              break;
            default:
              break;
          }
        }
      }

      window.addEventListener('keydown', onKeyDown, false);
    });

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMiddleClick(event) {
      if (event.button === 1) {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          const point = intersects[0].point;
          controls.target.set(point.x, point.y, point.z);
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMiddleClick, false);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      if (followModel && dogModel) {
        const offset = new THREE.Vector3(15, 12, 0);
        const dogPosition = dogModel.position.clone();
        camera.position.copy(dogPosition.add(offset));
        camera.lookAt(dogModel.position);
        
        // now left and right bbay
        // const turnoffset = new THREE.Vector3(0, 0, 0);
        // function onKeyDown(event) {
        //   const step = 1; 
        //   if (dogModel) {
        //     const forward = new THREE.Vector3();
        //     camera.getWorldDirection(forward);
        //     forward.normalize();
        //     forward.y = 0;
  
        //     const right = new THREE.Vector3();
        //     right.crossVectors(forward, camera.up).normalize();
        //     right.y = 0; 
  
        //     switch (event.key) {
        //       case 'a':
        //         turnoffset.add(right.multiplyScalar(-step));
        //         break;
        //       case 'd':
        //         turnoffset.add(right.multiplyScalar(step));
        //         break;
        //       default:
        //         break;
        //     }
        //   } 
        // }
  
        // window.addEventListener('keydown', onKeyDown, false);
      
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove, false);
      window.removeEventListener('mousedown', onMiddleClick, false);
      document.body.removeChild(renderer.domElement);
    };
  }, [followModel]);

  return (
    <div>
      <h1>Three.js Model in React, use click to interact, scroll to zoom in out, w s a d to move the ting</h1>
      <label>
        <input 
          type="checkbox" 
          checked={followModel} 
          onChange={() => setFollowModel(!followModel)} 
        />
        Follow Model
      </label>
      <audio src="ohskibbire.mp3" autoPlay loop />
    </div>
  );
};

export default App;