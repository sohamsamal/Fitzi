import React, { useState } from 'react';
import axios from 'axios';
import ExportAvatar from './Export'; // Ensure this is the correct path to your Export component

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [assetID, setAssetID] = useState('');
  const apiToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuSnVpYzVwbXk1T1hGSjVmY1RIQTdUNVktRHZVbVVOR2xxVHBqS0hDVnU4In0.eyJleHAiOjE3MDkwMDczNzksImlhdCI6MTcwODk3MTM4MSwiYXV0aF90aW1lIjoxNzA4OTcxMzc5LCJqdGkiOiIzMmM3MDJmNy0wNmJiLTQ3MjgtOWI0NS02NDA5YWMyNWRkMDkiLCJpc3MiOiJodHRwczovL2F1dGgubWVzaGNhcGFkZS5jb20vcmVhbG1zL21lc2hjYXBhZGUtbWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNmIwNzcwMmYtZDNmOS00YmJlLWJkZWYtNGYyYTU5ZjMzMWQwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVzaGNhcGFkZS1tZSIsIm5vbmNlIjoiNTI1NGFmMGUtOTc5YS00MDYyLWI2YmEtOTBmODY0MDU5MzVlIiwic2Vzc2lvbl9zdGF0ZSI6IjA2MzdlYjIyLTc5ZTUtNGI0NC05ZWRmLWY1NDM0ZWEzZGJjZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9tZXNoY2FwYWRlLmNvbSIsImh0dHBzOi8vbWUubWVzaGNhcGFkZS5jb20iLCJodHRwczovL21lc2hjYXBhZGUubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1nY21jIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMDYzN2ViMjItNzllNS00YjQ0LTllZGYtZjU0MzRlYTNkYmNmIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiRml0emkgU3RhcnR1cCIsInByZWZlcnJlZF91c2VybmFtZSI6ImZpdHppLnN0YXJ0dXBAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkZpdHppIiwiZmFtaWx5X25hbWUiOiJTdGFydHVwIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tJVjd4c202ZHRKSTV3SVNXbzBHV2pzTUpvMDdZWm80Sm5YdmozWENRbT1zOTYtYyIsImVtYWlsIjoiZml0emkuc3RhcnR1cEBnbWFpbC5jb20ifQ.RW9xCAV0-q_dRnDOvTd0ro0wLLre52mIMpeCSTZ5toOgbsggWI6euCogxLKBc5OTdQfuubgd3wwnng3R4pqpDn6Un1dijepO_CdtuhYtEZp-ucDJywqTO_BqJ6wrW7_fsSv_rTCYqvX_HnSYKqsjFv5pf2BcL51M_BIdchVF_ttz35PCOfm5tefwv1jTkq3RC0ytM3C8JNiMeYV6aQyc0RVu729Drv5TLW_8296RIymdlo-C3c0PV5nVCzlOVvC_ziqEwvQNerYFdBDVTwJldu3oGiKoSJQufJaX9BDV42C0duwP5aLVspnrsOQtJMPicYBoMlpRURFJtV8QJHlrhA';
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const createAvatar = async () => {
    setStatus('Creating Avatar...');
    try {
      const response = await axios.post('https://api.meshcapade.com/api/v1/avatars/create/from-images', {}, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      });
      const newAssetID = response.data.data.id; // Update according to actual API response structure
      console.log(response);
      setAssetID(newAssetID);
      setStatus('Avatar Created');
    } catch (error) {
      console.error('Error creating avatar:', error);
      setStatus('Error Creating Avatar');
    }
  };

  const uploadImage = async (assetID) => {
    setStatus('Uploading Image...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`https://api.meshcapade.com/api/v1/avatars/${assetID}/images/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('Image Uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatus('Error Uploading Image');
    }
  };

  const startFittingProcess = async (assetID) => {
    setStatus('Starting Fitting Process...');
    try {
      await axios.post(`https://api.meshcapade.com/api/v1/avatars/${assetID}/fit-to-images`, {}, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      });
      setStatus('Fitting Process Started');
    } catch (error) {
      console.error('Error starting fitting process:', error);
      setStatus('Error Starting Fitting Process');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file.');
      return;
    }
    
    const createdAssetID = await createAvatar();
    if (createdAssetID) {
      await uploadImage(createdAssetID);
      await startFittingProcess(createdAssetID);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload and Create Avatar</button>
      </form>
      <div>Status: {status}</div>
      {assetID && (
        <div>
          <div>Asset ID: {assetID}</div>
          <ExportAvatar assetID={assetID} authToken={apiToken} />
        </div>
      )}
    </div>
  );
}

export default App;
