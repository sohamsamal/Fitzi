import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function AvatarCreator() {
  const [file, setFile] = useState(null);
  const [avatarName, setAvatarName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('Idle');
  const [avatarId, setAvatarId] = useState('');
  const [exportUrl, setExportUrl] = useState('');
  const apiToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuSnVpYzVwbXk1T1hGSjVmY1RIQTdUNVktRHZVbVVOR2xxVHBqS0hDVnU4In0.eyJleHAiOjE3MDk5NjQwMDAsImlhdCI6MTcwOTkyODAwMSwiYXV0aF90aW1lIjoxNzA5OTI4MDAwLCJqdGkiOiJjNWNlNTAwNS0xY2IwLTQwMzMtYmU1OC0xYWI5NGJkY2U1ZmUiLCJpc3MiOiJodHRwczovL2F1dGgubWVzaGNhcGFkZS5jb20vcmVhbG1zL21lc2hjYXBhZGUtbWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNmIwNzcwMmYtZDNmOS00YmJlLWJkZWYtNGYyYTU5ZjMzMWQwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVzaGNhcGFkZS1tZSIsIm5vbmNlIjoiYWVjZjIwYzQtYmJjNy00ODk5LTgwZDAtZmQwNTg2YmZhYmIzIiwic2Vzc2lvbl9zdGF0ZSI6IjI5OWM3YjQzLTdlYTMtNDY2Yi1iMTllLTc1MWEyMDU2NDQwZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9tZXNoY2FwYWRlLmNvbSIsImh0dHBzOi8vbWUubWVzaGNhcGFkZS5jb20iLCJodHRwczovL21lc2hjYXBhZGUubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1nY21jIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMjk5YzdiNDMtN2VhMy00NjZiLWIxOWUtNzUxYTIwNTY0NDBlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiRml0emkgU3RhcnR1cCIsInByZWZlcnJlZF91c2VybmFtZSI6ImZpdHppLnN0YXJ0dXBAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkZpdHppIiwiZmFtaWx5X25hbWUiOiJTdGFydHVwIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tJVjd4c202ZHRKSTV3SVNXbzBHV2pzTUpvMDdZWm80Sm5YdmozWENRbT1zOTYtYyIsImVtYWlsIjoiZml0emkuc3RhcnR1cEBnbWFpbC5jb20ifQ.klVMKN535vO8z_VSlUwjOlkSwapqaQHYBmZGxSxbpKESrVJsMCGCF9ZyiCNrrHE_kT1HX2mkkSvAk2n3vMg0kuKEIxrtH1TFZBz8185SgTobsOLnEIZN6tqyvkh3FzOhBLum2e8KVlzftRN6FmV3JhYrhtE69XY1Sxe-qahXWQw536uX-oIltBj8lYd1aSxpgpSFrb_AafJmQ8i8wR6mgayoQx1AuNkeND4EX2Dmw6BmHjfTEZroQVCE9qgdY2pWbeNHuPAUATDBFHwQBa80b0Zm4Fn6sF4amsW-Cl3j2nJB_QU-aoqLzqlwKqATBC6yYZ6Bl6Ohpun_BX20BV9Btg';
  const viewerRef = useRef(null);

  useEffect(() => {
    if (exportUrl) {
      loadOBJModel(exportUrl);
    }
  }, [exportUrl]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
    const newAvatarId = await createAvatar();
    const uploadUrl = await getUploadLink(newAvatarId);
    await uploadImage(uploadUrl);
    await startFittingProcess(newAvatarId); // Pass additional parameters to the fitting process
  } catch (error) {
    console.error('Error in the process:', error);
    setStatus('Error in Process');
  }
};


function loadOBJModel(url) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc); // Change background to a lighter color

    const camera = new THREE.PerspectiveCamera(75, viewerRef.current.clientWidth / viewerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10); // Adjust camera position

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
    viewerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Default white light
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    new OrbitControls(camera, renderer.domElement);

    new OBJLoader().load(url, (obj) => {
        obj.position.set(0, 0, 0); // Ensure model is centered
        scene.add(obj);
        animate();
    });

    function animate() {
        requestAnimationFrame(animate);
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
      <div ref={viewerRef} style={{ width: '600px', height: '400px', background: '#aaa' }}></div>
  </div>
);
}

export default AvatarCreator;