import axiosInstance from './axios';

export const getExpenseCategories = async () => {
  const response = await axiosInstance.get('/expenses/categories');
  return response.data.data;
};

export const getTripExpenses = async (tripId) => {
  const response = await axiosInstance.get(`/expenses/trip/${tripId}`);
  return response.data.data;
};

export const getTripBudgetSummary = async (tripId) => {
  const response = await axiosInstance.get(`/expenses/trip/${tripId}/summary`);
  return response.data.data;
};

export const getGlobalBudgetSummary = async () => {
  const response = await axiosInstance.get('/expenses/global/summary');
  return response.data.data;
};

export const addExpense = async (expenseData) => {
  const response = await axiosInstance.post('/expenses', expenseData);
  return response.data.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await axiosInstance.put(`/expenses/${id}`, expenseData);
  return response.data.data;
};

export const deleteExpense = async (id) => {
  const response = await axiosInstance.delete(`/expenses/${id}`);
  return response.data.data;
};
