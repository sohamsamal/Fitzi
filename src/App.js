import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function AvatarAndFaceSwap() {
  const [file, setFile] = useState(null);
  const [avatarName, setAvatarName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('Idle');
  const [avatarId, setAvatarId] = useState('');
  const [exportUrl, setExportUrl] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const viewerRef = useRef(null);

  const apiToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuSnVpYzVwbXk1T1hGSjVmY1RIQTdUNVktRHZVbVVOR2xxVHBqS0hDVnU4In0.eyJleHAiOjE3MTA1NzUxNjQsImlhdCI6MTcxMDU0NTE2MSwiYXV0aF90aW1lIjoxNzEwNTM5MTY0LCJqdGkiOiI1NDAzN2M4MC04NmU3LTRiZDctODcyOC0wMTkwYzA5ZWNhOTMiLCJpc3MiOiJodHRwczovL2F1dGgubWVzaGNhcGFkZS5jb20vcmVhbG1zL21lc2hjYXBhZGUtbWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOWNlYzI3ZjQtMDY3Ny00OGI4LWE3ODUtZWM5NzJjODJlY2MyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVzaGNhcGFkZS1tZSIsIm5vbmNlIjoiMjZhZjExNzUtMTVmMi00MWE4LTg3YWYtNjQ1ZjQ3NzJmNDIwIiwic2Vzc2lvbl9zdGF0ZSI6IjdiMmYwMGFiLWE4MTAtNDJjYS04MTA0LTkzNTY5ZmRhOTliOSIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9tZXNoY2FwYWRlLmNvbSIsImh0dHBzOi8vbWUubWVzaGNhcGFkZS5jb20iLCJodHRwczovL21lc2hjYXBhZGUubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1nY21jIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiN2IyZjAwYWItYTgxMC00MmNhLTgxMDQtOTM1NjlmZGE5OWI5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiSmFzb24gTGluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiamFzb25saW4yOTc2NEBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiSmFzb24iLCJmYW1pbHlfbmFtZSI6IkxpbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLS3piTVlHOXU0Q1J4LVNZdEw4dmhPVlZvZzZJa01iUHVuUWRZZmJsTG49czk2LWMiLCJlbWFpbCI6Imphc29ubGluMjk3NjRAZ21haWwuY29tIn0.kqvZFztOjwbvFXzqXdCQBjPPrFKtS_2Qe1LP2KxnG-izF1fqZY6trjrZkuCZHYzxdclcT9nJ1xi4FONxBmf6UXseUYS2cL1f_Q5lKow4g2Y4_PVQmyGzDqOKmOmvH3Nsr-IlQ-KIMdsg8gxoTYI7ACb_8JnMPbY0_36h1FMdjzDkT8Ds2TwQSuvciyZntnGnIJ3RMpwltxqsJRpBT_nAQSfafRV8SHfZlyBAm1b4_n1fQOITCuab1so3lshv-B_q8kgIObDLMJqQFMxfGwC2ML_BfwNQSrljloQFd6aT7HsoNmAfEF8sRhMsMjptomYcsWKHzzZUkHrX9nKCBrGmsw';
  const faceSwapApiToken = 'user:893-aelqV9NKacC4TTkmhVc1l';

  const targetImageUrls = {
    male: 'https://i.ibb.co/6XkxwPM/male-dark.png',
    female: 'https://i.ibb.co/fqyjSKK/woman-light.png',
  };

  useEffect(() => {
    if (exportUrl && resultImage) { // Ensure both the model URL and resultImage are ready
        loadOBJModel(exportUrl);
    }
}, [exportUrl, resultImage]); // Add resultImage as a dependency  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchImageAsBlob = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    return new File([imageBlob], 'target.jpg', { type: 'image/jpeg' });
  };

  const performFaceSwap = async (sourceImage) => {
    try {
      const targetImageUrl = gender === 'female' ? targetImageUrls.female : targetImageUrls.male;
      const targetImageBlob = await fetchImageAsBlob(targetImageUrl);

      let formData = new FormData();
      formData.append('channel', '1218277318921949369');
      formData.append('idname', 'source');
      formData.append('image', sourceImage);

      await axios.post('https://api.useapi.net/v1/faceswap/saveid', formData, {
        headers: {
          'Authorization': `Bearer ${faceSwapApiToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      formData = new FormData();
      formData.append('channel', '1218277318921949369');
      formData.append('idname', 'source');
      formData.append('image', targetImageBlob);

      const response = await axios.post('https://api.useapi.net/v1/faceswap/swapid', formData, {
        headers: {
          'Authorization': `Bearer ${faceSwapApiToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.attachments.length > 0) {
        setResultImage(response.data.attachments[0].url);
        return response.data.attachments[0].url;
      }
    } catch (error) {
      console.error('Face swap error:', error);
    }
  };


  const createAvatar = async () => {
    setStatus('Creating Avatar...');
    try {
      const response = await axios.post(
        'https://api.meshcapade.com/api/v1/avatars/create/from-images', {}, 
        { headers: { 'Authorization': `Bearer ${apiToken}` } }
      );
      setAvatarId(response.data.data.id);
      return response.data.data.id;
    } catch (error) {
      console.error('Error creating avatar:', error);
      setStatus('Error Creating Avatar');
      throw error;
    }
  };

  const getUploadLink = async (avatarId) => {
    try {
      const response = await axios.post(
        `https://api.meshcapade.com/api/v1/avatars/${avatarId}/images`, {}, 
        { headers: { 'Authorization': `Bearer ${apiToken}` } }
      );
      return response.data.data.links.upload;
    } catch (error) {
      console.error('Error obtaining upload link:', error);
      throw error;
    }
  };

  const uploadImage = async (uploadUrl) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': 'image/png' } });
      setStatus('Image Uploaded. Starting Fitting Process...');
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatus('Error Uploading Image');
      throw error;
    }
  };

  const startFittingProcess = async (avatarId) => {
    try {
      const response = await axios.post(
        `https://api.meshcapade.com/api/v1/avatars/${avatarId}/fit-to-images`,
        {
          avatarname: avatarName,
          height: parseInt(height),
          weight: parseInt(weight),
          gender: gender
        },
        { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
      );
      pollFittingStatus(avatarId); // Start polling for fitting status right after initiating the fitting process
    } catch (error) {
      console.error('Error starting fitting process:', error);
      setStatus('Error Starting Fitting Process');
      throw error;
    }
  };

  const pollFittingStatus = async (avatarId) => {
    try {
      const response = await axios.get(
        `https://api.meshcapade.com/api/v1/avatars/${avatarId}`, 
        { headers: { 'Authorization': `Bearer ${apiToken}` } }
      );
      const fittingStatus = response.data.data.attributes.state;
      const detailedStatus = response.data.data.attributes.detailedStatus; // Assuming this field exists
      
      // Update the status message to include detailed information
      setStatus(`Fitting Process: ${fittingStatus}. Details: ${detailedStatus || 'Processing...'}`);
  
      if (fittingStatus === 'READY') {
        setStatus('Fitting Process Complete. Starting Export...');
        startExportProcess(avatarId);
      } else if (fittingStatus === 'ERROR') {
        // Handle any errors that might have occurred during the fitting process
        setStatus('Error during fitting process. Please try again.');
      } else {
        // Continue polling if the process is not yet complete or in an error state
        setTimeout(() => pollFittingStatus(avatarId), 5000); // Poll every 5 seconds
      }
    } catch (error) {
      console.error('Error polling fitting status:', error);
      setStatus('Error Polling Fitting Status');
      throw error;
    }
  };
  

  async function startExportProcess(avatarId) {
    const exportResponse = await axios.post(`https://api.meshcapade.com/api/v1/avatars/${avatarId}/export`, {
        format: 'obj', // or 'fbx' depending on your needs
        pose: 't',
    }, {
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    });
    pollExportStatus(exportResponse.data.data.id);
}

async function pollExportStatus(meshId) {
    let isExported = false;
    while (!isExported) {
        const exportStatusResponse = await axios.get(`https://api.meshcapade.com/api/v1/meshes/${meshId}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
        });
        if (exportStatusResponse.data.data.attributes.state === 'READY') {
            isExported = true;
            setExportUrl(exportStatusResponse.data.data.attributes.url.path);
            setStatus('Export complete. Model ready for viewing.');
        } else {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        }
    }
}


const handleSubmit = async (event) => {
  event.preventDefault();
  if (!file || !gender || !height || !weight || !avatarName) {
    alert('Please fill all fields.');
    return;
  }

  setStatus('Processing...');
  try {
    const faceSwappedImage = await performFaceSwap(file);
    const newFile = await fetchImageAsBlob(faceSwappedImage); // Convert the swapped image URL back to a File object for uploading
    setFile(newFile); // Update the file state with the face-swapped image
    const newAvatarId = await createAvatar();
    const uploadUrl = await getUploadLink(newAvatarId);
    await uploadImage(uploadUrl, newFile); // Pass the face-swapped image to the upload function
    await startFittingProcess(newAvatarId);
  } catch (error) {
    console.error('Error in the process:', error);
    setStatus('Error in Process');
  }
};



function loadOBJModel(url) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020); // Dark background to help colors stand out

  const camera = new THREE.PerspectiveCamera(75, viewerRef.current.clientWidth / viewerRef.current.clientHeight, 0.1, 10000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.outputEncoding = THREE.sRGBEncoding; // Important for color fidelity
  renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
  viewerRef.current.appendChild(renderer.domElement);

  // Vibrant lighting setup
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(-100, 0, 100);
  const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
  fillLight.position.set(100, 0, 100);
  const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();

  scene.add(keyLight, fillLight, backLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(resultImage);
  texture.encoding = THREE.sRGBEncoding; // Use sRGB encoding for texture

  new OBJLoader().load(url, (obj) => {
    obj.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
        child.material.color.convertSRGBToLinear(); // Properly converts the color for sRGB encoded textures
        child.material.needsUpdate = true;
      }
    });

    obj.position.y = -1; // Center the model
    scene.add(obj);

    // Update the camera to fit the object
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    camera.lookAt(center);

    controls.target.set(center.x, center.y, center.z);
    controls.update();

    animate();
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
}


return (
  <div>
      <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <input type="text" placeholder="Avatar Name" value={avatarName} onChange={(e) => setAvatarName(e.target.value)} />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="neutral">Neutral</option>
          </select>
          <input type="number" placeholder="Height in cm" value={height} onChange={(e) => setHeight(e.target.value)} />
          <input type="number" placeholder="Weight in kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <button type="submit">Create Avatar</button>
      </form>
      <div>Status: {status}</div>
      <div ref={viewerRef} style={{ width: '100vw', height: '100vh', background: '#000000' }}></div>
      {resultImage && (
        <>
          <img src={resultImage} alt="Result" style={{ width: '0px', height: '0px' }} />
        </>
      )}
  </div>
);
}

export default AvatarAndFaceSwap;