import { Link } from 'react-router-dom';

function Dashboard() {
  // Get current date
  const today = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl text-gray-600 font-medium">Today's overall</h2>
            <h1 className="text-4xl font-bold text-gray-900">Health status</h1>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-medium text-gray-900">{formattedDate}</h3>
            <p className="text-sm text-gray-500">2/3 Medication Taken</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Patterns Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weight Patterns Overview</h3>
                  <p className="text-sm text-gray-500">June, 2023</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md font-medium">D</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">W</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">M</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">Y</button>
                  </div>
                  <Link to="/weight" className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Weight progress circle */}
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="relative w-48 h-48 mb-6 md:mb-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray="282.7"
                        strokeDashoffset="206.4"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">27%</span>
                      <span className="text-sm text-gray-500">Avg. Weight Loss</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 ml-0 md:ml-8">
                  <h4 className="text-lg font-medium mb-3">Daily Weight Trends</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    At your lowest point, you've lost 27% of your starting weight, influenced by consistent exercise and healthy eating habits. Your weight loss trend is steady, highlighting the impact of your dedication.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500">Highest Point</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold mr-1">185</span>
                        <span className="text-xs text-gray-500">lbs</span>
                        <span className="text-xs text-gray-500 ml-2">02:36 PM</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500">Lowest Point</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold mr-1">176</span>
                        <span className="text-xs text-gray-500">lbs</span>
                        <span className="text-xs text-gray-500 ml-2">11:05 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Loss Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Weight Loss Journey</h3>
                  <p className="text-sm text-gray-600">May - June 2023</p>
                </div>
                <div className="flex">
                  <Link to="/weight" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Weight Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Starting</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">185 <span className="text-sm font-normal text-gray-500">lbs</span></p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Initial weight on May 1</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Current</p>
                      <p className="text-2xl font-bold text-indigo-600 mt-1">176 <span className="text-sm font-normal text-gray-500">lbs</span></p>
                    </div>
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Latest measurement</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Goal</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">165 <span className="text-sm font-normal text-gray-500">lbs</span></p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Target weight</p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Lost</p>
                      <p className="text-2xl font-bold text-purple-600 mt-1">9 <span className="text-sm font-normal text-gray-500">lbs</span></p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Total weight lost</p>
                </div>
              </div>

              {/* Weight Progress Chart */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="h-64 relative">
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      {/* Definitions */}
                      <defs>
                        <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="goalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Background */}
                      <rect x="0" y="0" width="400" height="200" fill="#ffffff" rx="8" />

                      {/* Goal zone */}
                      <rect x="0" y="0" width="400" height="70" fill="url(#goalGradient)" rx="8" />

                      {/* Grid lines */}
                      <g>
                        {/* Horizontal grid lines */}
                        {[40, 80, 120, 160].map((y, i) => (
                          <line
                            key={`h-${i}`}
                            x1="40"
                            y1={y}
                            x2="380"
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                          />
                        ))}
                      </g>

                      {/* Goal line */}
                      <line
                        x1="40"
                        y1="70"
                        x2="380"
                        y2="70"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="5,3"
                      />

                      {/* Goal label */}
                      <rect x="320" y="55" width="60" height="20" rx="10" fill="#10b981" />
                      <text x="350" y="69" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">GOAL</text>

                      {/* Weight area fill */}
                      <path
                        d="M50,150 L100,140 L150,130 L200,120 L250,110 L300,100 L350,90 L350,200 L50,200 Z"
                        fill="url(#weightGradient)"
                      />

                      {/* Weight bars */}
                      {[
                        { x: 50, y: 150, weight: 185 },
                        { x: 100, y: 140, weight: 183 },
                        { x: 150, y: 130, weight: 181 },
                        { x: 200, y: 120, weight: 180 },
                        { x: 250, y: 110, weight: 178 },
                        { x: 300, y: 100, weight: 177 },
                        { x: 350, y: 90, weight: 176 }
                      ].map((point, i) => (
                        <rect
                          key={`bar-${i}`}
                          x={point.x - 6}
                          y={point.y}
                          width="12"
                          height={200 - point.y}
                          rx="2"
                          fill={i === 6 ? "#4f46e5" : "#cbd5e1"}
                          opacity={i === 6 ? 1 : 0.7}
                        />
                      ))}

                      {/* Weight line */}
                      <path
                        d="M50,150 L100,140 L150,130 L200,120 L250,110 L300,100 L350,90"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data points */}
                      {[
                        { x: 50, y: 150, weight: 185 },
                        { x: 100, y: 140, weight: 183 },
                        { x: 150, y: 130, weight: 181 },
                        { x: 200, y: 120, weight: 180 },
                        { x: 250, y: 110, weight: 178 },
                        { x: 300, y: 100, weight: 177 },
                        { x: 350, y: 90, weight: 176 }
                      ].map((point, i) => (
                        <g key={`point-${i}`}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="6"
                            fill="white"
                            stroke="#4f46e5"
                            strokeWidth="2"
                          />
                          {i === 6 && (
                            <>
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="10"
                                fill="#4f46e5"
                                fillOpacity="0.2"
                              />
                              <text
                                x={point.x}
                                y={point.y - 15}
                                fontSize="11"
                                fill="#4f46e5"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {point.weight} lbs
                              </text>
                            </>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Y-axis labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs font-medium text-gray-500 py-2">
                    <span>190 lbs</span>
                    <span>180 lbs</span>
                    <span>170 lbs</span>
                    <span>160 lbs</span>
                    <span>150 lbs</span>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs font-medium text-gray-500 px-10">
                    <span>May 1</span>
                    <span>May 8</span>
                    <span>May 15</span>
                    <span>May 22</span>
                    <span>May 29</span>
                    <span>Jun 5</span>
                    <span>Jun 12</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress to Goal</span>
                  <span className="text-sm font-medium text-indigo-600">45%</span>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">11 lbs to go</span>
                  <span className="text-xs text-gray-500">Est. completion: Aug 15, 2023</span>
                </div>
              </div>
            </div>

            {/* BMI and Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* BMI Calculator */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Body Mass Index (BMI)</h4>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Underweight</span>
                      <span>Normal</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">26.8</span>
                    <p className="text-xs text-gray-500">Current BMI (Overweight)</p>
                  </div>
                  <div className="mx-4 h-10 border-l border-gray-300"></div>
                  <div className="text-center">
                    <span className="text-lg font-medium text-green-500">25.1</span>
                    <p className="text-xs text-gray-500">Target BMI</p>
                  </div>
                </div>
              </div>

              {/* Progress Towards Goal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Progress Towards Goal</h4>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0%</span>
                    <span>Progress: 45%</span>
                    <span>100%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Weight to lose</p>
                    <p className="text-lg font-medium text-gray-900">11 lbs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated completion</p>
                    <p className="text-lg font-medium text-gray-900">Aug 15, 2023</p>
                  </div>
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Weekly Summary</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current week avg</p>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-gray-900">176</span>
                      <span className="text-sm text-gray-500 ml-1">lbs</span>
                      <span className="ml-2 text-xs text-green-500 font-medium">-2 lbs</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Weekly change rate</p>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-green-500">-1.1%</span>
                      <span className="ml-2 text-xs text-gray-500">Healthy rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Medication & Shipment Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Medication & Shipment Tracking</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full font-medium">Today</button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">All</button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Medications</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Shipments</button>
              </div>

              {/* Medication Status */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">2/3</span> Medications taken today
                </div>
                <button className="text-xs text-blue-600 font-medium flex items-center">
                  View all medications
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Medication List */}
              <div className="space-y-4 mb-6">
                {/* Medication 1 */}
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">Vitamin D (Cholecalciferol)</p>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Taken</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">2 Capsules (1000 IU each), 8:30 AM</p>
                          <div className="mt-2 text-xs text-gray-600">
                            <p><span className="font-medium">Type:</span> Dietary Supplement</p>
                            <p><span className="font-medium">Purpose:</span> Bone health, Immune support</p>
                            <p><span className="font-medium">Refills:</span> 3 remaining</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication 2 */}
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">Omega-3 Fish Oil</p>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Taken</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">1 Softgel (1000mg), 2:30 PM</p>
                          <div className="mt-2 text-xs text-gray-600">
                            <p><span className="font-medium">Type:</span> Dietary Supplement</p>
                            <p><span className="font-medium">Purpose:</span> Heart health, Inflammation reduction</p>
                            <p><span className="font-medium">Refills:</span> 2 remaining</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication 3 */}
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">Multivitamin</p>
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Missed</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">1 Tablet, 8:30 PM</p>
                          <div className="mt-2 text-xs text-gray-600">
                            <p><span className="font-medium">Type:</span> Dietary Supplement</p>
                            <p><span className="font-medium">Purpose:</span> General health, Nutrient support</p>
                            <p><span className="font-medium">Refills:</span> 5 remaining</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Section (Hidden by default, would be shown when tab is clicked) */}
              <div className="hidden">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">1</span> Upcoming shipment
                  </div>
                  <button className="text-xs text-blue-600 font-medium flex items-center">
                    View all shipments
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Upcoming Shipment */}
                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">June Medication Refill</p>
                          <p className="text-xs text-gray-600 mt-1">Expected delivery: June 24, 2023</p>
                          <div className="mt-3">
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium text-gray-700">Shipment Status:</span>
                              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Transit</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Processed</span>
                              <span>Shipped</span>
                              <span className="font-medium text-yellow-700">In Transit</span>
                              <span>Delivered</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center">
                            <span className="text-xs font-medium text-gray-700 mr-2">Tracking:</span>
                            <span className="text-xs text-blue-600">USP12345678901</span>
                            <button className="ml-2 text-xs text-blue-600 underline">Track</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Past Shipments */}
                <h4 className="text-sm font-medium text-gray-700 mb-3">Past Shipments</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="mr-3 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">May Medication Refill</p>
                            <p className="text-xs text-gray-500">Delivered: May 22, 2023</p>
                          </div>
                          <button className="text-xs text-blue-600">Details</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="mr-3 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">April Medication Refill</p>
                            <p className="text-xs text-gray-500">Delivered: April 24, 2023</p>
                          </div>
                          <button className="text-xs text-blue-600">Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Devices Section */}


            {/* Recommended Exercise */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Back Stretch" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="text-xs font-medium mb-1">LOW HDV</div>
                    <h3 className="text-xl font-bold">Back Stretch</h3>
                    <p className="text-sm opacity-80">4 min</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-center">
                <button className="flex items-center text-gray-700 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
