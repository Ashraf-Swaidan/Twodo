import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardFooter, Image, Button, Spinner } from '@nextui-org/react'; // Import Spinner for visual feedback

const ProfilePage = () => {
  const { user, uploadAvatar } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // For success message

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null);
    setUploadSuccess(false); // Reset success message when a new file is chosen
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false); // Reset success message before upload

    try {
      await uploadAvatar(selectedFile);
      setUploadSuccess(true);
      setSelectedFile(null); // Reset file input after upload
    } catch (error) {
      setUploadError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col py-10 ">
      {/* Header Section */}
      <div className="mb-6 ">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.username}!</h1>
        <p className="text-gray-500">Manage your profile and avatar below.</p>
      </div>

      {/* Profile Card */}
      <Card isFooterBlurred radius="lg" className="border-none w-[250px]">
        {/* Display the user's current avatar */}
        <Image
          alt="User Avatar"
          className="object-cover"
          height={250}
          width={250}
          src={`http://localhost:5000${user?.avatar}`} // Use the user's avatar URL
        />
        
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-md text-white/90 font-semibold">{user?.username}</p>

          {/* Change Avatar Button */}
          <Button
            className="text-md text-white bg-black/30 hover:bg-black/50"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
            onClick={() => document.getElementById('avatarInput').click()} // Trigger file input
          >
            {isUploading ? <Spinner size="sm" /> : 'Change Avatar'}
          </Button>

          {/* Hidden input for file selection */}
          <input
            id="avatarInput"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </CardFooter>
      </Card>

      {/* Display the selected file name */}
      {selectedFile && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
        </div>
      )}

      {/* Upload button appears after selecting a file */}
      {selectedFile && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`bg-secondary border-1 text-accent px-4 py-2 rounded 
              hover:bg-gray-100 transition duration-300 ease-in-out 
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Avatar'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="mt-4 text-red-500 ">{uploadError}</p>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <p className="mt-4 text-green-500 ">Avatar updated successfully!</p>
      )}
    </div>
  );
};

export default ProfilePage;
