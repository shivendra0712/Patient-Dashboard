import React, { useState } from 'react';
import { format, addDays } from 'date-fns';

const MedicationReminders = ({ medications, onUpdateStatus }) => {
  const [viewDays, setViewDays] = useState(7);

  // Get today and next few days
  const today = new Date();
  const dateRange = Array.from({ length: viewDays }, (_, i) =>
    format(addDays(today, i), 'yyyy-MM-dd')
  );

  // Get upcoming medications for the date range
  const upcomingMedications = dateRange.map(date => {
    const medsForDay = medications
      .filter(med => med.status === 'active')
      .filter(med => {
        // Check if medication is scheduled for this date
        return med.schedule?.some(dose => dose.date === date);
      })
      .map(med => {
        // Get doses for this date
        const doses = med.schedule
          .filter(dose => dose.date === date)
          .map(dose => ({
            ...dose,
            medicationId: med.id,
            medicationName: med.name,
            medicationImage: med.image,
            dosage: med.dosage
          }));

        return { ...med, doses };
      });

    return {
      date,
      medications: medsForDay
    };
  });

  // Format date for display
  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

    return {
      day: format(date, 'EEE'),
      date: format(date, 'd'),
      month: format(date, 'MMM'),
      isToday
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Upcoming Medications</h2>
        <select
          value={viewDays}
          onChange={(e) => setViewDays(Number(e.target.value))}
          className="bg-blue-700 text-white border border-blue-500 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value={3}>Next 3 days</option>
          <option value={7}>Next 7 days</option>
          <option value={14}>Next 14 days</option>
          <option value={30}>Next 30 days</option>
        </select>
      </div>

      <div className="p-4">
        {upcomingMedications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming medications found.</p>
        ) : (
          <div className="space-y-6">
            {upcomingMedications.map((day) => {
              const { day: dayName, date, month, isToday } = formatDateDisplay(day.date);

              return (
                <div key={day.date} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center mr-4 ${
                      isToday ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <span className="text-xs font-medium">{dayName}</span>
                      <span className="text-lg font-bold leading-none">{date}</span>
                      <span className="text-xs">{month}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {isToday ? 'Today' : format(new Date(day.date), 'EEEE, MMMM d')}
                    </h3>
                    {isToday && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Today
                      </span>
                    )}
                  </div>

                  {day.medications.length === 0 ? (
                    <p className="text-sm text-gray-500 pl-16">No medications scheduled.</p>
                  ) : (
                    <ul className="space-y-3 pl-16">
                      {day.medications.map((med) => (
                        <li key={med.id} className="text-sm">
                          <div className="flex items-center">
                            {med.image ? (
                              <img
                                src={med.image}
                                alt={med.name}
                                className="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-blue-800 font-bold text-sm">
                                  {med.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{med.name}</p>
                              <p className="text-gray-500">{med.dosage} • {med.frequency}</p>
                            </div>
                          </div>

                          {/* Dose times */}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {med.doses.map((dose, index) => {
                              // Find the index of this dose in the medication's schedule
                              const doseIndex = med.schedule.findIndex(d =>
                                d.date === dose.date && d.time === dose.time && d.status === dose.status
                              );

                              return (
                                <div key={index} className="flex items-center space-x-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      dose.status === 'taken'
                                        ? 'bg-green-100 text-green-800'
                                        : dose.status === 'missed'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {dose.time || 'Scheduled'}: {dose.status === 'taken' ? 'Taken' : dose.status === 'missed' ? 'Missed' : 'Upcoming'}
                                  </span>

                                  {dose.status === 'upcoming' && onUpdateStatus && (
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => onUpdateStatus(med.id, doseIndex, 'taken')}
                                        className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-800"
                                        title="Mark as taken"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => onUpdateStatus(med.id, doseIndex, 'missed')}
                                        className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-800"
                                        title="Mark as missed"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationReminders;
