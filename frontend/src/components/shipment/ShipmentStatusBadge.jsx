import React from 'react';

const ShipmentStatusBadge = ({ status }) => {
  // Define colors and labels based on status
  const getStatusConfig = (status) => {
    switch (status) {
      case 'processing':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'Processing'
        };
      case 'shipped':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          label: 'Shipped'
        };
      case 'in-transit':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'In Transit'
        };
      case 'delivered':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'Delivered'
        };
      case 'delayed':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          label: 'Delayed'
        };
      case 'cancelled':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: 'Cancelled'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: 'Unknown'
        };
    }
  };

  const { bgColor, textColor, label } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default ShipmentStatusBadge;
