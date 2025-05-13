import React from 'react';
import { format } from 'date-fns';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import ShipmentTrackingTimeline from './ShipmentTrackingTimeline';

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

const ShipmentDetail = ({ shipment, onEdit, onDelete, onClose }) => {
  if (!shipment) return null;

  // Mock carrier data based on tracking number
  const getCarrierInfo = (trackingNumber) => {
    if (!trackingNumber) return { name: 'Unknown', logo: null };

    if (trackingNumber.startsWith('1Z')) {
      return {
        name: 'UPS',
        logo: 'ttps://www.fedex.com/content/dam/fedex-com/logos/logo.png',
        trackingUrl: `https://www.ups.com/track?tracknum=${trackingNumber}`
      };
    } else if (trackingNumber.length === 12 || trackingNumber.length === 15) {
      return {
        name: 'FedEx',
        logo: 'https://www.fedex.com/content/dam/fedex-com/logos/logo.png',
        trackingUrl: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
      };
    } else if (trackingNumber.length === 22 || trackingNumber.startsWith('9')) {
      return {
        name: 'USPS',
        logo: 'https://www.usps.com/global-elements/header/images/utility-header/logo-sb.svg',
        trackingUrl: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      };
    } else {
      return { name: 'Other', logo: null, trackingUrl: null };
    }
  };

  const carrierInfo = getCarrierInfo(shipment.trackingNumber);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Shipment Details</h2>
          <p className="text-amber-100">Tracking #{shipment.trackingNumber || 'Not available yet'}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full bg-amber-700 hover:bg-amber-600 text-white"
            title="Edit shipment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-amber-700 hover:bg-amber-600 text-white"
            title="Delete shipment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-amber-700 hover:bg-amber-600 text-white"
            title="Close details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status and Dates */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <ShipmentStatusBadge status={shipment.status} />
            <div className="text-sm text-gray-500">
              {shipment.status === 'delivered' ? 'Delivered on ' : 'Expected delivery: '}
              <span className="font-medium">
                {shipment.status === 'delivered' && shipment.actualDeliveryDate
                  ? format(new Date(shipment.actualDeliveryDate), 'MMMM d, yyyy')
                  : shipment.expectedDeliveryDate
                    ? format(new Date(shipment.expectedDeliveryDate), 'MMMM d, yyyy')
                    : 'Not available'}
              </span>
            </div>
          </div>

          {/* Carrier Information */}
          {shipment.trackingNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {carrierInfo.logo ? (
                    <img
                      src={carrierInfo.logo}
                      alt={carrierInfo.name}
                      className="h-8 mr-3 object-contain"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-amber-800 font-bold">{carrierInfo.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{carrierInfo.name}</p>
                    <p className="text-xs text-gray-500">Tracking #{shipment.trackingNumber}</p>
                  </div>
                </div>
                {carrierInfo.trackingUrl && (
                  <a
                    href={carrierInfo.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-amber-600 hover:text-amber-500"
                  >
                    Track on carrier site
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Timeline</h3>
            <ShipmentTrackingTimeline shipment={shipment} />
          </div>

          {/* Shipment Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Medication</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {getMedicationDisplayName(shipment)}
                </p>
                {!shipment.medication?.name && !shipment.medicationName && typeof shipment.medication !== 'string' && (
                  <p className="mt-1 text-xs text-red-500">
                    Medication information not available. This may be due to the medication being deleted.
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                <p className="mt-1 text-sm text-gray-900">{shipment.quantity || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Shipment Date</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {shipment.shipmentDate
                    ? format(new Date(shipment.shipmentDate), 'MMMM d, yyyy')
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Expected Delivery</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {shipment.expectedDeliveryDate
                    ? format(new Date(shipment.expectedDeliveryDate), 'MMMM d, yyyy')
                    : 'Not specified'}
                </p>
              </div>
              {shipment.actualDeliveryDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Actual Delivery</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(shipment.actualDeliveryDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {shipment.notes && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{shipment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
