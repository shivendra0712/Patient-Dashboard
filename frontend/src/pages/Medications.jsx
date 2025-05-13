import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication
} from '../services/medicationService';
import MedicationList from '../components/medication/MedicationList';
import MedicationDetail from '../components/medication/MedicationDetail';
import MedicationForm from '../components/medication/MedicationForm';

function Medications() {
  useAuth(); // Ensure authentication is checked
  // State for medications data
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch medications from the API
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMedications();
        setMedications(data);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError('Failed to load medications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Handle medication selection
  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
    setShowAddForm(false);
  };

  // Toggle add medication form
  const handleAddMedication = () => {
    setSelectedMedication(null);
    setShowAddForm(true);
  };

  // Handle form submission for adding/editing medication
  const handleFormSubmit = async (medicationData) => {
    try {
      let updatedMedication;

      if (medicationData._id) {
        // Update existing medication
        updatedMedication = await updateMedication(medicationData._id, medicationData);

        // Update medications state
        setMedications(medications.map(med =>
          med._id === updatedMedication._id ? updatedMedication : med
        ));

        setSuccessMessage('Medication updated successfully!');
      } else {
        // Add new medication
        updatedMedication = await createMedication(medicationData);

        // Update medications state
        setMedications([...medications, updatedMedication]);

        setSuccessMessage('Medication added successfully!');
      }

      // Close form and select the updated/new medication
      setShowAddForm(false);
      setSelectedMedication(updatedMedication);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving medication:', err);
      setError('Failed to save medication. Please try again.');

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Handle medication deletion
  const handleDeleteMedication = async (medication) => {
    if (window.confirm(`Are you sure you want to delete ${medication.name}?`)) {
      try {
        await deleteMedication(medication._id);

        // Update medications state
        setMedications(medications.filter(med => med._id !== medication._id));

        // Clear selection
        setSelectedMedication(null);

        setSuccessMessage('Medication deleted successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting medication:', err);
        setError('Failed to delete medication. Please try again.');

        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600">Manage and track your medications</p>
          </div>
          
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Main content */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Medication List */}
            <div>
              <MedicationList
                medications={medications}
                onSelectMedication={handleMedicationSelect}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Right column - Medication Details or Form */}
            <div>
              {showAddForm ? (
                <MedicationForm
                  medication={selectedMedication}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : selectedMedication ? (
                <MedicationDetail
                  medication={selectedMedication}
                  onEdit={() => setShowAddForm(true)}
                  onDelete={() => handleDeleteMedication(selectedMedication)}
                  onClose={() => setSelectedMedication(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full ">
                  <div className="text-center">
                   
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Medication Selected</h3>
                    <p className="text-gray-500 mb-6">Select a medication from the list to view details or add a new one.</p>
                    <button
                      onClick={handleAddMedication}
                      className="inline-flex items-center px-4 py-2 border  border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Medication
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Medications;
