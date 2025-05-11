import api from './api';

// Get all medications
export const getMedications = async () => {
  const response = await api.get('/medications');
  return response.data.data;
};

// Get single medication
export const getMedication = async (id) => {
  const response = await api.get(`/medications/${id}`);
  return response.data.data;
};

// Create medication
export const createMedication = async (medicationData) => {
  const response = await api.post('/medications', medicationData);
  return response.data.data;
};

// Update medication
export const updateMedication = async (id, medicationData) => {
  const response = await api.put(`/medications/${id}`, medicationData);
  return response.data.data;
};

// Delete medication
export const deleteMedication = async (id) => {
  const response = await api.delete(`/medications/${id}`);
  return response.data;
};
