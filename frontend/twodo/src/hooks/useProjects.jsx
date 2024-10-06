import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProjectsContext = createContext();

export const useProjectsContext = () => {
  return useContext(ProjectsContext);
};

export const ProjectsProvider = ({ children }) => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [projects, setProjects] = useState([]); // All projects, including collaborations
  const [ownedProjects, setOwnedProjects] = useState([]); // Projects the user owns
  const [collabProjects, setCollabProjects] = useState([]); // Projects the user collaborates on
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/projects';

  const fetchProjects = async () => {
    if (!user) return; // Don't fetch if there's no user

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedProjects = response.data;
      
      // Split owned projects and collaborations
      const owned = fetchedProjects.filter(project => project.owner._id === user.id);
      const collaborations = fetchedProjects.filter(project => project.owner._id !== user.id);

      setProjects(fetchedProjects);
      setOwnedProjects(owned);
      setCollabProjects(collaborations);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to sync state
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add project');
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${id}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to sync state
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const deleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to sync state
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  // --- New methods for collaboration functionality ---

  const inviteCollaborator = async (projectId, email) => {
    try {
      console.log('Invite Collab function called')
      console.log(projectId, email)
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${projectId}/invite`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User Invited Successfully')
      // No need to refetch projects since an invitation was sent, not an actual addition
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send invitation');
    }
  };
  
  const removeCollaborator = async (projectId, collaboratorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${projectId}/collaborators/${collaboratorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to sync state
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  const updateCollaboratorRole = async (projectId, collaboratorId, role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${projectId}/collaborators/${collaboratorId}`, { role }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to sync state
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update collaborator role');
    }
  };

  const acceptInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/invitations/accept/${invitationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProjects(); // Refetch to update project list
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to accept invitation');
    }
  };
  
  const rejectInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/invitations/reject/${invitationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // No need to refetch projects, just removing the invitation
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject invitation');
    }
  };
  

  // Fetch projects only when user exists
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]); // Depend on the user state to fetch projects

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        ownedProjects,
        collabProjects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        inviteCollaborator,
        removeCollaborator,
        updateCollaboratorRole,
        acceptInvitation,
        rejectInvitation
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
