import React, { useEffect } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

export default function App() {
  const onContextCreate = async (gl) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const camera = new THREE.PerspectiveCamera(
      75, 
      gl.drawingBufferWidth / gl.drawingBufferHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5; // Increase the z position if the object is too large or too close

    const scene = new THREE.Scene();
    const objLoader = new OBJLoader();
    objLoader.load(
      './assets/Wianne.obj', // Ensure this path is correct for your OBJ file
      (object) => {
        scene.add(object);
        object.position.set(0, -1, 0); // Adjust the object position if needed
      },
      undefined,
      console.error
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    const onResize = () => {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
  };

  useEffect(() => {
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <GLView style={{ flex: 1, backgroundColor: '#789'}} onContextCreate={onContextCreate} />;
}
