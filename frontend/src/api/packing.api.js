import axiosInstance from './axios';

export const getPackingItems = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/checklist`);
  return response.data.data;
};

export const addPackingItem = async (tripId, itemData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/checklist`, itemData);
  return response.data.data;
};

export const togglePackingItem = async (tripId, itemId, isPacked) => {
  const response = await axiosInstance.put(`/trips/${tripId}/checklist/${itemId}/packed`, { isPacked });
  return response.data.data;
};

export const resetChecklist = async (tripId) => {
  const response = await axiosInstance.put(`/trips/${tripId}/checklist/reset`);
  return response.data.data;
};

export const deletePackingItem = async (tripId, itemId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/checklist/${itemId}`);
  return response.data.data;
};
