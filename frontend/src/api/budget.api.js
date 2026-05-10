import axiosInstance from './axios';

export const getExpenses = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/expenses`);
  return response.data;
};

export const addExpense = async (tripId, expenseData) => {
  const response = await axiosInstance.post(`/trips/${tripId}/expenses`, expenseData);
  return response.data;
};

export const deleteExpense = async (tripId, expenseId) => {
  const response = await axiosInstance.delete(`/trips/${tripId}/expenses/${expenseId}`);
  return response.data;
};

export const getBudgetSummary = async (tripId) => {
  const response = await axiosInstance.get(`/trips/${tripId}/budget/summary`);
  return response.data;
};
