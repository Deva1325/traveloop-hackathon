import axiosInstance from './axios';

export const getNotes = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/notes`);
  return response.data.data;
};

export const addNote = async (tripId, noteData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/notes`, noteData);
  return response.data.data;
};

export const deleteNote = async (tripId, noteId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/notes/${noteId}`);
  return response.data.data;
};
