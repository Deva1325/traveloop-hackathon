import axiosInstance from './axios';

export const getChecklist = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/checklist`);
  return response.data;
};

export const addItem = async (tripId, itemData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/checklist`, itemData);
  return response.data;
};

export const toggleItem = async (tripId, itemId) => {
  const response = await axiosInstance.patch(`/trips/${tripId}/checklist/${itemId}/toggle`);
  return response.data;
};

export const deleteItem = async (tripId, itemId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/checklist/${itemId}`);
  return response.data;
};
