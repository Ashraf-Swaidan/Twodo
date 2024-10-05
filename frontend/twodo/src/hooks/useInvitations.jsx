// useInvitations.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/invitations';

const useInvitations = () => {
  const [invitationsToUser, setInvitationsToUser] = useState([]);
  const [invitationsByUser, setInvitationsByUser] = useState([]);

  // Fetch invitations sent to the current user
  const fetchInvitationsToUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/to`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvitationsToUser(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invitations sent to user');
    }
  };

  // Fetch invitations sent by the current user
  const fetchInvitationsByUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/by`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvitationsByUser(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch invitations sent by user');
    }
  };

  // Send an invitation to a collaborator
  const inviteCollaborator = async (projectId, email) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/projects/${projectId}/invite`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Invitation sent successfully');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  // Accept an invitation
  const acceptInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/accept/${invitationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to accept invitation');
    }
  };

  // Reject an invitation
  const rejectInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/reject/${invitationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject invitation');
    }
  };

  return {
    invitationsToUser,
    invitationsByUser,
    fetchInvitationsToUser,
    fetchInvitationsByUser,
    inviteCollaborator,
    acceptInvitation,
    rejectInvitation,
  };
};

export default useInvitations;
