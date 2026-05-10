import axiosInstance from './axios';

export const getItinerary = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/stops`);
  return response.data;
};

export const addStop = async (tripId, stopData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/stops`, stopData);
  return response.data;
};

export const updateStopOrder = async (tripId, stops) => {
  const response = await axiosInstance.put(`/trips/${tripId}/stops/reorder`, { stops });
  return response.data;
};

export const deleteStop = async (tripId, stopId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/stops/${stopId}`);
  return response.data;
};
