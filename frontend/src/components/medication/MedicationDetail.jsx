import React, { useState } from 'react';
import { format } from 'date-fns';

const MedicationDetail = ({ medication, onEdit, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!medication) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {medication.image ? (
            <img
              src={medication.image}
              alt={medication.name}
              className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-white"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 border-2 border-white">
              <span className="text-blue-800 font-bold text-xl">
                {medication.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{medication.name}</h2>
            <p className="text-blue-100">{medication.dosage} • {medication.frequency}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white"
            title="Edit medication"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-blue-700 hover:bg-red-600 text-white"
            title="Delete medication"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white"
            title="Close details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Information
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                medication.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {medication.active ? 'Active' : 'Inactive'}
              </span>
              {medication.active && medication.endDate && (
                <span className="ml-2 text-sm text-gray-500">
                  Until {format(new Date(medication.endDate), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dosage</h3>
                <p className="mt-1 text-sm text-gray-900">{medication.dosage || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Frequency</h3>
                <p className="mt-1 text-sm text-gray-900">{medication.frequency || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {medication.startDate ? format(new Date(medication.startDate), 'MMMM d, yyyy') : 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {medication.endDate ? format(new Date(medication.endDate), 'MMMM d, yyyy') : 'Ongoing'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-line">
                {medication.notes || 'No notes available for this medication.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
