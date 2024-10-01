import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, uploadAvatar } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await uploadAvatar(selectedFile);
      alert('Avatar updated successfully');
      setSelectedFile(null); // Reset the selected file after upload
    } catch (error) {
      setUploadError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className=" flex py-6">
      <div className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Profile Page</h1>

        {/* Display User Avatar */}
        <div className="flex flex-col items-center mb-4">
        <img
          className="w-32 h-32 rounded-full object-cover mb-2"
          src={`http://localhost:5000${user?.avatar}`} // No /api here
          alt="User Avatar"
        />

          <p className="text-gray-700">{user?.username}</p>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* Avatar Upload Section */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Upload new avatar</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md 
            hover:bg-blue-600 transition duration-300 ease-in-out 
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Uploading...' : 'Upload Avatar'}
        </button>

        {/* Error Message */}
        {uploadError && (
          <p className="mt-4 text-red-500 text-center">{uploadError}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
