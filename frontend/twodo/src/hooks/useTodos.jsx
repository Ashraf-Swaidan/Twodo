import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

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

  // New Methods for Subtasks
  const addSubtask = async (todoId, subtaskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${todoId}/subtasks`, subtaskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const updateSubtask = async (todoId, subtaskId, subtaskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${todoId}/subtasks/${subtaskId}`, subtaskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteSubtask = async (todoId, subtaskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${todoId}/subtasks/${subtaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return { fetchTodos, addTodo, updateTodo, deleteTodo, addSubtask, updateSubtask, deleteSubtask };
};
