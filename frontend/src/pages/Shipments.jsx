import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment
} from '../services/shipmentService';
import { getMedications } from '../services/medicationService';
import ShipmentList from '../components/shipment/ShipmentList';
import ShipmentDetail from '../components/shipment/ShipmentDetail';
import ShipmentForm from '../components/shipment/ShipmentForm';

function Shipments() {
  useAuth(); // Ensure authentication is checked

  // State for shipments data
  const [shipments, setShipments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch shipments and medications from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch shipments
        const shipmentData = await getShipments();
        setShipments(shipmentData || []);

        // Fetch medications for the dropdown
        const medicationData = await getMedications();
        setMedications(medicationData || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle shipment selection
  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    setShowAddForm(false);
  };

  // Toggle add shipment form
  const handleAddShipment = () => {
    setSelectedShipment(null);
    setShowAddForm(true);
  };

  // Handle form submission for adding/editing shipment
  const handleFormSubmit = async (shipmentData) => {
    try {
      let updatedShipment;

      if (shipmentData._id) {
        // Update existing shipment
        updatedShipment = await updateShipment(shipmentData._id, shipmentData);

        // Update shipments state
        setShipments(shipments.map(s =>
          s._id === updatedShipment._id ? updatedShipment : s
        ));

        setSuccessMessage('Shipment updated successfully!');
      } else {
        // Add new shipment
        updatedShipment = await createShipment(shipmentData);

        // Find the medication in our medications array to add its name to the shipment object
        // This ensures the medication name shows immediately without needing a refresh
        if (updatedShipment && updatedShipment.medication) {
          const medicationId = updatedShipment.medication;
          const matchingMedication = medications.find(med =>
            med._id === medicationId || med.id === medicationId
          );

          if (matchingMedication) {
            // Create a new object with the medication details included
            updatedShipment = {
              ...updatedShipment,
              medication: {
                _id: medicationId,
                name: matchingMedication.name,
                dosage: matchingMedication.dosage
              }
            };
          }
        }

        // Update shipments state
        setShipments([...shipments, updatedShipment]);

        setSuccessMessage('Shipment added successfully!');
      }

      // Close form and select the updated/new shipment
      setShowAddForm(false);
      setSelectedShipment(updatedShipment);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving shipment:', err);
      setError('Failed to save shipment. Please try again.');

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Handle shipment deletion
  const handleDeleteShipment = async (shipment) => {
    // Get medication name for display
    const medicationName = shipment.medication?.name || shipment.medicationName || 'medication';

    if (window.confirm(`Are you sure you want to delete this shipment for ${medicationName}?`)) {
      try {
        // Get the correct ID to use
        const idToUse = shipment._id || shipment.id;

        if (!idToUse) {
          console.error('No valid ID found for shipment:', shipment);
          setError('Failed to delete shipment: No valid ID found.');
          return;
        }

        await deleteShipment(idToUse);

        // Update shipments state - handle both ID formats
        setShipments(shipments.filter(s =>
          !((s._id && s._id === idToUse) || (s.id && s.id === idToUse))
        ));

        // Clear selection
        setSelectedShipment(null);

        setSuccessMessage('Shipment deleted successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting shipment:', err);
        setError('Failed to delete shipment. Please try again.');

        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };

  // Handle shipment status update
  const handleUpdateShipmentStatus = async (shipmentId, newStatus) => {
    try {
      // Find the shipment - handle both string IDs and object IDs
      const shipment = shipments.find(s =>
        (s._id && s._id === shipmentId) ||
        (s.id && s.id === shipmentId)
      );

      if (!shipment) {
        console.error(`Shipment with ID ${shipmentId} not found`);
        return;
      }

      // Get the correct ID to use
      const idToUse = shipment._id || shipment.id;

      // Create a copy of the shipment and update the status
      const updatedShipment = {
        ...shipment,
        status: newStatus,
        // If status is delivered, set actual delivery date to today
        actualDeliveryDate: newStatus === 'delivered' ? new Date().toISOString() : shipment.actualDeliveryDate
      };

      // Update in the database
      const result = await updateShipment(idToUse, updatedShipment);

      // Update local state - handle both ID formats
      setShipments(shipments.map(s => {
        if ((s._id && s._id === idToUse) || (s.id && s.id === idToUse)) {
          return result;
        }
        return s;
      }));

      // If the selected shipment was updated, update that too
      if (selectedShipment &&
          ((selectedShipment._id && selectedShipment._id === idToUse) ||
           (selectedShipment.id && selectedShipment.id === idToUse))) {
        setSelectedShipment(result);
      }

      setSuccessMessage(`Shipment status updated to ${newStatus}!`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating shipment status:', err);
      setError('Failed to update shipment status. Please try again later.');

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipment Tracking</h1>
            <p className="text-gray-600">Track your medication deliveries</p>
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

        {/* Main content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Shipment List */}
            <div>
              <ShipmentList
                shipments={shipments}
                onSelectShipment={handleSelectShipment}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Right column - Shipment Form or Details */}
            <div>
              {showAddForm ? (
                <ShipmentForm
                  shipment={selectedShipment}
                  medications={medications}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : selectedShipment ? (
                <ShipmentDetail
                  shipment={selectedShipment}
                  onEdit={() => setShowAddForm(true)}
                  onDelete={() => handleDeleteShipment(selectedShipment)}
                  onClose={() => setSelectedShipment(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
                  <div className="text-center">
                   
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Shipment Selected</h3>
                    <p className="text-gray-500 mb-6">Select a shipment from the list to view tracking details or add a new one.</p>
                    <button
                      onClick={handleAddShipment}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Shipment
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

export default Shipments;
