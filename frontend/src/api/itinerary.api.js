import axiosInstance from './axios';

export const addStop = async (tripId, stopData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/stops`, stopData);
  return response.data.data;
};

export const deleteStop = async (tripId, stopId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/stops/${stopId}`);
  return response.data.data;
};

export const reorderStops = async (tripId, stops) => {
  const response = await axiosInstance.put(`/trips/${tripId}/stops/reorder`, { stops });
  return response.data.data;
};

export const searchCities = async (query) => {
  const response = await axiosInstance.get(`/public/cities?search=${query}`);
  return response.data.data;
};
