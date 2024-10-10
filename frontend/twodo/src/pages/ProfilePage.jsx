import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardFooter, Image, Button, Spinner } from '@nextui-org/react';
import useInvitations from '../hooks/useInvitations';

const ProfilePage = () => {
  const { user, uploadAvatar, getUserDetails } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { 
    invitationsToUser, 
    invitationsByUser, 
    fetchInvitationsToUser, 
    fetchInvitationsByUser, 
    acceptInvitation, 
    rejectInvitation 
  } = useInvitations();

  useEffect(() => {
    fetchInvitationsToUser();
    fetchInvitationsByUser();
  }, []);

  console.log(invitationsToUser, invitationsByUser)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      await uploadAvatar(selectedFile);
      setUploadSuccess(true);
      setSelectedFile(null);
    } catch (error) {
      setUploadError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);
      fetchInvitationsToUser(); // Refetch invitations to update the list
    } catch (error) {
      console.error('Failed to accept invitation', error);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      await rejectInvitation(invitationId);
      fetchInvitationsToUser(); // Refetch invitations to update the list
    } catch (error) {
      console.error('Failed to reject invitation', error);
    }
  };

  return (
    <div className="flex flex-col py-10 px-5">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.username}!</h1>
        <p className="text-gray-500">Manage your profile, avatar, and invitations below.</p>
      </div>

      {/* Profile Card */}
      <Card isFooterBlurred radius="lg" className="border-none w-[250px]">
        <Image
          alt="User Avatar"
          className="object-cover"
          height={250}
          width={250}
          src={user?.avatar} // User's avatar URL
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-md text-white/90 font-semibold">{user?.username}</p>

          <Button
            className="text-md text-white bg-black/30 hover:bg-black/50"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
            onClick={() => document.getElementById('avatarInput').click()}
          >
            {isUploading ? <Spinner size="sm" /> : 'Change Avatar'}
          </Button>

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
      {uploadError && <p className="mt-4 text-red-500">{uploadError}</p>}

      {/* Success Message */}
      {uploadSuccess && <p className="mt-4 text-green-500">Avatar updated successfully!</p>}

      {/* Invitations Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800">Invitations</h2>

        {/* Invitations Sent To the User */}
        <div className="mt-4 max-h-60 overflow-y-auto border rounded-lg bg-white shadow-md p-4">
          <h3 className="text-lg font-semibold">Invitations to You</h3>
          {invitationsToUser.length === 0 ? (
            <p className="text-gray-600">No invitations found.</p>
          ) : (
            invitationsToUser.map((invitation) => (
              <div key={invitation._id} className="my-2 p-2 border rounded-lg bg-gray-100">
                <p>
                  Project: <strong>{invitation.project.name}</strong>
                </p>

                  <span className='flex space-x-1'>
                    <span>
                       Invited by:
                    </span>
                    <Image width={25} height={25} src={invitation.invitedBy.avatar}/>
                    <strong> {invitation.invitedBy.username}</strong>
                  </span> 

                <p>Status: {invitation.status}</p>

                {invitation.status === 'pending' && (
                  <div className="flex mt-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      color="error"
                      onClick={() => handleRejectInvitation(invitation._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Invitations Sent By the User */}
        <div className="mt-4 max-h-60 overflow-y-auto border rounded-lg bg-white shadow-md p-4">
          <h3 className="text-lg font-semibold">Invitations You Sent</h3>
          {invitationsByUser.length === 0 ? (
            <p className="text-gray-600">You haven't sent any invitations yet.</p>
          ) : (
            invitationsByUser.map((invitation) => (
              <div key={invitation._id} className="my-2 p-2 border rounded-lg bg-gray-100">
                <p>
                  Project: <strong>{invitation.project.name}</strong>
                </p>
                    <span>
                       Invited {invitation.email}
                    </span> 
                <p>Status: {invitation.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
