import api from './api';

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data.data;
};
