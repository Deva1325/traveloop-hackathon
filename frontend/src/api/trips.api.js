import axiosInstance from './axios';

export const getTrips = async () => {
  const response = await axiosInstance.get('/trips');
  return response.data.data;
};

export const getTripById = async (id) => {
  const response = await axiosInstance.get(`/trips/${id}`);
  return response.data.data;
};

export const createTrip = async (tripData) => {
  const response = await axiosInstance.post('/trips', tripData);
  return response.data.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await axiosInstance.put(`/trips/${id}`, tripData);
  return response.data.data;
};

export const deleteTrip = async (id) => {
  const response = await axiosInstance.delete(`/trips/${id}`);
  return response.data.data;
};
