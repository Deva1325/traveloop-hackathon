import axiosInstance from './axios';

export const getUserNotes = async (search = '') => {
  const response = await axiosInstance.get(`/notes?search=${search}`);
  return response.data.data;
};

export const getTripNotes = async (tripId) => {
  const response = await axiosInstance.get(`/notes/trip/${tripId}`);
  return response.data.data;
};

export const addNote = async (noteData) => {
  const response = await axiosInstance.post('/notes', noteData);
  return response.data.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axiosInstance.put(`/notes/${id}`, noteData);
  return response.data.data;
};

export const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data.data;
};
