import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const API_URL = `${BASE_API_URL}/todos`;


export const useTodos = () => {
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, todoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, todoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  // Optional: Fetch Todos by Project ID
  const fetchTodosByProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const addComment = async (todoId, commentData, files) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
  
      // Add comment text
      formData.append('text', commentData.text);
  
      // Add files (if any)
      if (files) {
        files.forEach(file => formData.append('attachments', file));
      }
  
      const response = await axios.post(`${API_URL}/${todoId}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
  
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };
  
  // Edit a comment on a specific Todo
  const editComment = async (todoId, commentId, commentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${todoId}/comments/${commentId}`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  // Delete a comment from a specific Todo
  const deleteComment = async (todoId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${todoId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return { fetchTodos, addTodo, updateTodo, deleteTodo, fetchTodosByProject, addComment, editComment, deleteComment };
};
