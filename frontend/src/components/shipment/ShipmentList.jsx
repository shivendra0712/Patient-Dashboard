import React from 'react';
import { format } from 'date-fns';
import ShipmentStatusBadge from './ShipmentStatusBadge';

// Helper function to get medication display name
const getMedicationDisplayName = (shipment) => {
  // Case 1: Medication is an object with name property
  if (typeof shipment.medication === 'object' && shipment.medication?.name) {
    return `${shipment.medication.name}${shipment.medication.dosage ? ` (${shipment.medication.dosage})` : ''}`;
  }

  // Case 2: MedicationName is available
  if (shipment.medicationName) {
    return shipment.medicationName;
  }

  // Case 3: Medication is just an ID (string)
  if (typeof shipment.medication === 'string') {
    return 'Medication ID: ' + shipment.medication.substring(0, 6) + '...';
  }

  // Default case
  return 'Medication Shipment';
};

const ShipmentList = ({
  shipments,
  onSelectShipment,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery
}) => {
  // Filter shipments based on filter status and search query
  const filteredShipments = shipments.filter(shipment => {
    // Filter by status
    if (filterStatus !== 'all' && shipment.status !== filterStatus) return false;

    // Filter by search query (tracking number or medication name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const trackingMatch = shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(query);

      // Check if medication name matches the search query
      const medicationDisplayName = getMedicationDisplayName(shipment);
      const medicationMatch = medicationDisplayName.toLowerCase().includes(query);

      if (!trackingMatch && !medicationMatch) return false;
    }

    return true;
  });

  // Sort shipments by date (most recent first)
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    // Use shipment date as fallback if expected delivery date is not available
    const dateA = a.expectedDeliveryDate || a.shipmentDate;
    const dateB = b.expectedDeliveryDate || b.shipmentDate;

    return new Date(dateB) - new Date(dateA);
  });

  // Get active shipments (not delivered or cancelled)
  const activeShipments = shipments.filter(shipment =>
    !['delivered', 'cancelled'].includes(shipment.status)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search by tracking # or medication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter dropdown */}
          <div>
            <select
              className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Shipments</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Active shipments summary */}
        {activeShipments.length > 0 && (
          <div className="mt-4 bg-amber-50 p-3 rounded-md">
            <p className="text-sm text-amber-700">
              <span className="font-medium">{activeShipments.length}</span> active shipment{activeShipments.length !== 1 ? 's' : ''} in progress
            </p>
          </div>
        )}
      </div>

      {/* Shipment List */}
      <div className="overflow-hidden">
        {sortedShipments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No shipments found. {searchQuery && (
              <button
                className="text-amber-600 hover:text-amber-800 font-medium"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sortedShipments.map((shipment, index) => {
              // Determine if this is a recent shipment (within the last 3 days)
              const isRecent = shipment.shipmentDate &&
                (new Date() - new Date(shipment.shipmentDate)) / (1000 * 60 * 60 * 24) < 3;

              return (
                <li
                  key={shipment._id || shipment.id || index}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    isRecent ? 'border-l-4 border-amber-500' : ''
                  }`}
                  onClick={() => onSelectShipment(shipment)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-amber-600 truncate">
                            {getMedicationDisplayName(shipment)}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {shipment.trackingNumber
                              ? `Tracking #: ${shipment.trackingNumber}`
                              : 'No tracking number yet'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        <ShipmentStatusBadge status={shipment.status} />
                        <span className="text-gray-500 mt-1">
                          {shipment.expectedDeliveryDate && (
                            <>
                              {shipment.status === 'delivered' ? 'Delivered: ' : 'Expected: '}
                              {format(new Date(shipment.expectedDeliveryDate), 'MMM d, yyyy')}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Additional shipment info */}
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Shipped: {shipment.shipmentDate
                            ? format(new Date(shipment.shipmentDate), 'MMM d, yyyy')
                            : 'Not yet shipped'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-1-1h-8a1 1 0 00-.8.4L8.4 8H5V5a1 1 0 00-1-1H3z" />
                        </svg>
                        Qty: {shipment.quantity || 'N/A'}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShipmentList;
