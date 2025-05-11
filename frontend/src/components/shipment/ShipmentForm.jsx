import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ShipmentForm = ({ shipment, medications, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    medication: '',
    shipmentDate: format(new Date(), 'yyyy-MM-dd'),
    expectedDeliveryDate: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default to 5 days from now
    actualDeliveryDate: '',
    trackingNumber: '',
    status: 'processing',
    quantity: 1,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If editing an existing shipment, populate the form
  useEffect(() => {
    if (shipment) {
      // Handle different ways the medication ID might be stored
      let medicationId = '';
      if (typeof shipment.medication === 'object' && shipment.medication?._id) {
        medicationId = shipment.medication._id;
      } else if (typeof shipment.medication === 'string') {
        medicationId = shipment.medication;
      }

      setFormData({
        medication: medicationId,
        shipmentDate: shipment.shipmentDate ? format(new Date(shipment.shipmentDate), 'yyyy-MM-dd') : '',
        expectedDeliveryDate: shipment.expectedDeliveryDate ? format(new Date(shipment.expectedDeliveryDate), 'yyyy-MM-dd') : '',
        actualDeliveryDate: shipment.actualDeliveryDate ? format(new Date(shipment.actualDeliveryDate), 'yyyy-MM-dd') : '',
        trackingNumber: shipment.trackingNumber || '',
        status: shipment.status || 'processing',
        quantity: shipment.quantity || 1,
        notes: shipment.notes || ''
      });
    }
  }, [shipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medication) {
      newErrors.medication = 'Medication is required';
    }

    if (!formData.shipmentDate) {
      newErrors.shipmentDate = 'Shipment date is required';
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'Expected delivery date is required';
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Format dates for API
        const formattedData = {
          ...formData,
          shipmentDate: formData.shipmentDate ? new Date(formData.shipmentDate).toISOString() : null,
          expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : null,
          actualDeliveryDate: formData.actualDeliveryDate ? new Date(formData.actualDeliveryDate).toISOString() : null,
          quantity: parseInt(formData.quantity, 10)
        };

        // If editing, include the ID
        if (shipment && (shipment._id || shipment.id)) {
          formattedData._id = shipment._id || shipment.id;
        }

        await onSubmit(formattedData);
      } catch (error) {
        console.error('Error submitting form:', error);
        // Show error to user
        setErrors({
          ...errors,
          form: 'Failed to save shipment. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {shipment ? 'Edit Shipment' : 'Add New Shipment'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {errors.form && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p>{errors.form}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Information</h3>
          </div>

          {/* Medication */}
          <div>
            <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
              Medication*
            </label>
            <select
              name="medication"
              id="medication"
              value={formData.medication}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm ${
                errors.medication ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select a medication</option>
              {medications && medications.length > 0 ? (
                medications.map(med => (
                  <option key={med._id} value={med._id}>
                    {med.name} ({med.dosage})
                  </option>
                ))
              ) : (
                <option value="" disabled>No medications available. Please add medications first.</option>
              )}
            </select>
            {errors.medication && <p className="mt-1 text-sm text-red-600">{errors.medication}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity*
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm ${
                errors.quantity ? 'border-red-300' : ''
              }`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>

          {/* Shipment Date */}
          <div>
            <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700">
              Shipment Date*
            </label>
            <input
              type="date"
              name="shipmentDate"
              id="shipmentDate"
              value={formData.shipmentDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm ${
                errors.shipmentDate ? 'border-red-300' : ''
              }`}
            />
            {errors.shipmentDate && <p className="mt-1 text-sm text-red-600">{errors.shipmentDate}</p>}
          </div>

          {/* Expected Delivery Date */}
          <div>
            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">
              Expected Delivery Date*
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              id="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm ${
                errors.expectedDeliveryDate ? 'border-red-300' : ''
              }`}
            />
            {errors.expectedDeliveryDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDeliveryDate}</p>}
          </div>

          {/* Actual Delivery Date */}
          <div>
            <label htmlFor="actualDeliveryDate" className="block text-sm font-medium text-gray-700">
              Actual Delivery Date (Optional)
            </label>
            <input
              type="date"
              name="actualDeliveryDate"
              id="actualDeliveryDate"
              value={formData.actualDeliveryDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank if not delivered yet</p>
          </div>

          {/* Tracking Number */}
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700">
              Tracking Number (Optional)
            </label>
            <input
              type="text"
              name="trackingNumber"
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status*
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              id="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional information about this shipment"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Shipment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm;
