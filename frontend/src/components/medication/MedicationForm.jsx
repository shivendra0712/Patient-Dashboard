import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const MedicationForm = ({ medication, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timeOfDay: '',
    purpose: '',
    prescribedBy: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    instructions: '',
    sideEffects: '',
    refills: '',
    nextRefillDate: '',
    pharmacy: {
      name: '',
      phone: '',
      address: ''
    },
    status: 'active',
    notes: '',
    image: ''
  });

  const [errors, setErrors] = useState({});

  // If editing an existing medication, populate the form
  useEffect(() => {
    if (medication) {
      setFormData({
        ...medication,
        startDate: medication.startDate ? format(new Date(medication.startDate), 'yyyy-MM-dd') : '',
        endDate: medication.endDate ? format(new Date(medication.endDate), 'yyyy-MM-dd') : '',
        nextRefillDate: medication.nextRefillDate ? format(new Date(medication.nextRefillDate), 'yyyy-MM-dd') : '',
        pharmacy: {
          name: medication.pharmacy?.name || '',
          phone: medication.pharmacy?.phone || '',
          address: medication.pharmacy?.address || ''
        }
      });
    }
  }, [medication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('pharmacy.')) {
      const pharmacyField = name.split('.')[1];
      setFormData({
        ...formData,
        pharmacy: {
          ...formData.pharmacy,
          [pharmacyField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    
    if (!formData.frequency.trim()) {
      newErrors.frequency = 'Frequency is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format dates for API
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        nextRefillDate: formData.nextRefillDate ? new Date(formData.nextRefillDate).toISOString() : null
      };
      
      onSubmit(formattedData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {medication ? 'Edit Medication' : 'Add New Medication'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          </div>

          {/* Medication Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Medication Name*
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm ${
                errors.name ? '' : ''
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Dosage */}
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
              Dosage*
            </label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 10mg, 1 tablet"
              className={`mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm sm:text-sm ${
                errors.dosage ? 'border-red-300' : ''
              }`}
            />
            {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
          </div>

          {/* Frequency */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency*
            </label>
            <select
              name="frequency"
              id="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-smsm:text-sm ${
                errors.frequency ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Four times daily">Four times daily</option>
              <option value="Every other day">Every other day</option>
              <option value="Weekly">Weekly</option>
              <option value="As needed">As needed</option>
              <option value="Other">Other</option>
            </select>
            {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
          </div>

          {/* Time of Day */}
          <div>
            <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700">
              Time of Day
            </label>
            <input
              type="text"
              name="timeOfDay"
              id="timeOfDay"
              value={formData.timeOfDay}
              onChange={handleChange}
              placeholder="e.g., Morning, Evening, With meals"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm sm:text-sm"
            />
          </div>

          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <input
              type="text"
              name="purpose"
              id="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Blood Pressure, Pain Relief"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Prescribed By */}
          <div>
            <label htmlFor="prescribedBy" className="block text-sm font-medium text-gray-700">
              Prescribed By
            </label>
            <input
              type="text"
              name="prescribedBy"
              id="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              placeholder="Doctor's name"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date*
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm ${
                errors.startDate ? 'border-red-300' : ''
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank if ongoing</p>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              name="instructions"
              id="instructions"
              rows={2}
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g., Take with food, Take on empty stomach"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Side Effects */}
          <div className="md:col-span-2">
            <label htmlFor="sideEffects" className="block text-sm font-medium text-gray-700">
              Potential Side Effects
            </label>
            <textarea
              name="sideEffects"
              id="sideEffects"
              rows={2}
              value={formData.sideEffects}
              onChange={handleChange}
              placeholder="List potential side effects"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Refill Information */}
          <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Refill Information</h3>
          </div>

          {/* Refills */}
          <div>
            <label htmlFor="refills" className="block text-sm font-medium text-gray-700">
              Refills Remaining
            </label>
            <input
              type="text"
              name="refills"
              id="refills"
              value={formData.refills}
              onChange={handleChange}
              placeholder="Number of refills or 'OTC'"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Next Refill Date */}
          <div>
            <label htmlFor="nextRefillDate" className="block text-sm font-medium text-gray-700">
              Next Refill Date
            </label>
            <input
              type="date"
              name="nextRefillDate"
              id="nextRefillDate"
              value={formData.nextRefillDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Pharmacy Information */}
          <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pharmacy Information</h3>
          </div>

          {/* Pharmacy Name */}
          <div>
            <label htmlFor="pharmacy.name" className="block text-sm font-medium text-gray-700">
              Pharmacy Name
            </label>
            <input
              type="text"
              name="pharmacy.name"
              id="pharmacy.name"
              value={formData.pharmacy.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Pharmacy Phone */}
          <div>
            <label htmlFor="pharmacy.phone" className="block text-sm font-medium text-gray-700">
              Pharmacy Phone
            </label>
            <input
              type="text"
              name="pharmacy.phone"
              id="pharmacy.phone"
              value={formData.pharmacy.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Pharmacy Address */}
          <div className="md:col-span-2">
            <label htmlFor="pharmacy.address" className="block text-sm font-medium text-gray-700">
              Pharmacy Address
            </label>
            <input
              type="text"
              name="pharmacy.address"
              id="pharmacy.address"
              value={formData.pharmacy.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Additional Information */}
          <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Medication Image URL
            </label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-sm  sm:text-sm"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this medication"
              className="mt-1 block w-full rounded-md border-2 px-2 py-1 shadow-smsm:text-sm"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {medication ? 'Update Medication' : 'Add Medication'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationForm;
