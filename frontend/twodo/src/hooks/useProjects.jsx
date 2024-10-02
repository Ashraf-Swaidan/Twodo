import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProjectsContext = createContext();

export const useProjectsContext = () => {
  return useContext(ProjectsContext);
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/projects';

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
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

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, loading, error, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
