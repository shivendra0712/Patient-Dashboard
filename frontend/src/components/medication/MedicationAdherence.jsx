import React from 'react';

const MedicationAdherence = ({ adherenceStats, todaysMedications, onUpdateStatus }) => {
  const { taken, missed, upcoming, adherenceRate } = adherenceStats;

  // Determine the color for the adherence rate
  const getAdherenceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get the progress bar color
  const getProgressBarColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Medication Adherence</h2>
      </div>

      <div className="p-6">
        {/* Adherence Rate */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Overall Adherence Rate</h3>
            <span className={`text-2xl font-bold ${getAdherenceColor(adherenceRate)}`}>
              {adherenceRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressBarColor(adherenceRate)}`}
              style={{ width: `${adherenceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <span className="text-2xl font-bold text-green-600">{taken}</span>
            <p className="text-sm text-gray-600">Taken</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <span className="text-2xl font-bold text-red-600">{missed}</span>
            <p className="text-sm text-gray-600">Missed</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <span className="text-2xl font-bold text-blue-600">{upcoming}</span>
            <p className="text-sm text-gray-600">Today</p>
          </div>
        </div>

        {/* Today's Medications */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Medications</h3>

          {todaysMedications.length === 0 ? (
            <p className="text-gray-500 text-sm">No medications scheduled for today.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todaysMedications.map((med) => {
                // Get today's doses
                const today = new Date().toISOString().split('T')[0];
                const todayDoses = med.schedule.filter(dose => dose.date === today);

                return (
                  <li key={med.id} className="py-3">
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
                        <p className="text-sm font-medium text-gray-900">{med.name}</p>
                        <p className="text-xs text-gray-500">{med.dosage} • {med.timeOfDay || med.frequency}</p>
                      </div>
                    </div>

                    {/* Dose status indicators */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {todayDoses.map((dose, index) => {
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
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationAdherence;
