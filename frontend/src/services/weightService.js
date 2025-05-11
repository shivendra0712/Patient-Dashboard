import api from './api';

// Get all weight records
export const getWeightRecords = async () => {
  const response = await api.get('/weight');
  return response.data.data;
};

// Get single weight record
export const getWeightRecord = async (id) => {
  const response = await api.get(`/weight/${id}`);
  return response.data.data;
};

// Create weight record
export const createWeightRecord = async (weightData) => {
  const response = await api.post('/weight', weightData);
  return response.data.data;
};

// Update weight record
export const updateWeightRecord = async (id, weightData) => {
  const response = await api.put(`/weight/${id}`, weightData);
  return response.data.data;
};

// Delete weight record
export const deleteWeightRecord = async (id) => {
  const response = await api.delete(`/weight/${id}`);
  return response.data;
};

// Get weight goals and current status
export const getWeightGoals = async () => {
  const response = await api.get('/weight/goals');
  return response.data.data;
};

// Update weight goals
export const updateWeightGoals = async (goalData) => {
  const response = await api.post('/weight/goals', goalData);
  return response.data.data;
};
