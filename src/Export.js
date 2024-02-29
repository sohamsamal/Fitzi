import React, { useState } from 'react';
import axios from 'axios';

const ExportAvatar = ({ assetID, authToken }) => {
  const [exportStatus, setExportStatus] = useState('');

  const triggerExport = async () => {
    try {
      const exportResponse = await axios.post(
        `https://api.meshcapade.com/avatars/${assetID}/export`,
        { /* body parameters, if any, like format and pose */ },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const meshID = exportResponse.data.id; // Assuming the response includes an ID for the mesh
      checkExportStatus(meshID);
    } catch (error) {
      console.error('Error triggering export:', error);
    }
  };

  const checkExportStatus = async (meshID) => {
    try {
      let status = '';
      do {
        const statusResponse = await axios.get(
          `https://api.meshcapade.com/meshes/${meshID}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        status = statusResponse.data.status;
        setExportStatus(status);
        if (status !== 'READY') {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
        }
      } while (status !== 'READY');

      if (status === 'READY') {
        downloadExportedAvatar(statusResponse.data.url);
      }
    } catch (error) {
      console.error('Error checking export status:', error);
    }
  };

  const downloadExportedAvatar = (downloadUrl) => {
    window.location.href = downloadUrl; // Simple way to trigger download, or implement your own method
  };

  return (
    <div>
      <button onClick={triggerExport}>Export Avatar</button>
      <p>Export Status: {exportStatus}</p>
    </div>
  );
};

export default ExportAvatar;