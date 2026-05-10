import axiosInstance from './axios';

export const updateProfile = async (userData) => {
  const response = await axiosInstance.put('/auth/profile', userData);
  return response.data.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete('/auth/account');
  return response.data;
};

export const getSavedDestinations = async () => {
  const response = await axiosInstance.get('/users/saved-destinations');
  return response.data.data;
};

export const saveDestination = async (cityId) => {
  const response = await axiosInstance.post('/users/saved-destinations', { cityId });
  return response.data.data;
};

export const removeSavedDestination = async (cityId) => {
  const response = await axiosInstance.delete(`/users/saved-destinations/${cityId}`);
  return response.data;
};
