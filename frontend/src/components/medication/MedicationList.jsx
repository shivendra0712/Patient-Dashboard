import React from 'react';
import { format } from 'date-fns';

const MedicationList = ({
  medications,
  onSelectMedication,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) => {
  // Filter medications based on active tab and search query
  const filteredMedications = medications.filter(med => {
    // Filter by tab
    if (activeTab === 'current' && !med.active) return false;
    if (activeTab === 'past' && med.active) return false;

    // Filter by search query
    if (searchQuery && !med.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs and Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'current'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Active Medications
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'past'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Inactive Medications
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Medication List */}
      <div className="overflow-hidden">
        {filteredMedications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No medications found. {searchQuery && (
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredMedications.map((medication) => (
              <li
                key={medication._id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => onSelectMedication(medication)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <span className="text-blue-800 font-bold">
                          {medication.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">{medication.name}</p>
                        <p className="text-sm text-gray-500 truncate">{medication.dosage} • {medication.frequency}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        medication.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {medication.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500 mt-1">
                        {medication.startDate && `Started: ${format(new Date(medication.startDate), 'MMM d, yyyy')}`}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
