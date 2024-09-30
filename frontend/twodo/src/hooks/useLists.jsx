import axios from 'axios';

const API_URL = 'http://localhost:5000/api/lists';

export const useLists = () => {
  const fetchLists = async () => {
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

  const addList = async (listData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, listData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const updateList = async (id, listData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, listData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteList = async (id) => {
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

  return { fetchLists, addList, updateList, deleteList };
};
