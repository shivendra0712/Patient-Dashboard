import React from 'react';
import { format } from 'date-fns';

const ShipmentTrackingTimeline = ({ shipment }) => {
  // Define the timeline steps based on shipment status
  const getTimelineSteps = (shipment) => {
    const steps = [
      {
        id: 'processing',
        title: 'Order Processed',
        description: 'Your order has been processed and is being prepared for shipment.',
        date: shipment.shipmentDate,
        completed: ['processing', 'shipped', 'in-transit', 'delivered'].includes(shipment.status),
        current: shipment.status === 'processing'
      },
      {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your order has been shipped and is on its way.',
        date: shipment.shipmentDate,
        completed: ['shipped', 'in-transit', 'delivered'].includes(shipment.status),
        current: shipment.status === 'shipped'
      },
      {
        id: 'in-transit',
        title: 'In Transit',
        description: 'Your order is in transit and will be delivered soon.',
        date: null, // This would typically come from tracking updates
        completed: ['in-transit', 'delivered'].includes(shipment.status),
        current: shipment.status === 'in-transit'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered.',
        date: shipment.actualDeliveryDate,
        completed: ['delivered'].includes(shipment.status),
        current: shipment.status === 'delivered'
      }
    ];

    // Handle special cases
    if (shipment.status === 'delayed') {
      // Find the last completed step
      const lastCompletedIndex = steps.findIndex(step => step.completed && !step.current);
      if (lastCompletedIndex !== -1) {
        steps.splice(lastCompletedIndex + 1, 0, {
          id: 'delayed',
          title: 'Delayed',
          description: 'Your shipment has been delayed.',
          date: null, // This would typically come from tracking updates
          completed: true,
          current: true,
          isDelayed: true
        });
      }
    } else if (shipment.status === 'cancelled') {
      steps.push({
        id: 'cancelled',
        title: 'Cancelled',
        description: 'Your order has been cancelled.',
        date: null, // This would typically be the cancellation date
        completed: true,
        current: true,
        isCancelled: true
      });
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps(shipment);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timelineSteps.map((step, stepIdx) => (
          <li key={step.id}>
            <div className="relative pb-8">
              {stepIdx !== timelineSteps.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      step.completed
                        ? step.isDelayed
                          ? 'bg-orange-500'
                          : step.isCancelled
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.completed ? (
                      step.current ? (
                        <span className="text-white font-bold text-xs">
                          {step.isDelayed ? '!' : step.isCancelled ? 'X' : '✓'}
                        </span>
                      ) : (
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <span className="text-gray-500 font-bold text-xs">{stepIdx + 1}</span>
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <div>
                    <p className={`text-sm font-medium ${
                      step.current
                        ? step.isDelayed
                          ? 'text-orange-600'
                          : step.isCancelled
                            ? 'text-red-600'
                            : 'text-green-600'
                        : step.completed
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {step.date && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-400">
                        {format(new Date(step.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentTrackingTimeline;
