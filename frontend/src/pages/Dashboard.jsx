import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getWeightRecords, getWeightGoals } from '../services/weightService';
import { getMedications } from '../services/medicationService';
import { getShipments } from '../services/shipmentService';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

function Dashboard() {
  // State for data
  const [loading, setLoading] = useState(true);
  const [weightData, setWeightData] = useState([]);
  const [weightGoals, setWeightGoals] = useState({});
  const [medications, setMedications] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState({
    startingWeight: 0,
    currentWeight: 0,
    goalWeight: 0,
    totalLost: 0,
    progressPercentage: 0,
    weightToLose: 0,
    estimatedCompletion: '',
    weeklyAvg: 0,
    weeklyChange: 0,
    changeRate: 0
  });

  // Chart reference
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Get current date
  const today = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch weight records
        const weightRecords = await getWeightRecords();

        // Format the weight data
        const formattedWeightData = weightRecords.map(record => ({
          id: record._id,
          date: new Date(record.date).toISOString().split('T')[0],
          weight: record.weight,
          startingWeight: record.startingWeight,
          currentWeight: record.currentWeight,
          weightGoal: record.weightGoal,
          weightChange: record.weightChange,
          notes: record.notes
        }));

        // Sort by date (oldest first for proper chart display)
        formattedWeightData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setWeightData(formattedWeightData);

        // Fetch weight goals
        const goals = await getWeightGoals();
        setWeightGoals(goals);

        // Calculate stats using both data sources
        calculateStats(formattedWeightData, goals);

        // Create chart after data is loaded
        if (formattedWeightData.length > 0) {
          createOrUpdateChart(formattedWeightData);
        }

        // Fetch medications
        const medicationData = await getMedications();
        setMedications(medicationData || []);

        // Fetch shipments
        const shipmentData = await getShipments();
        setShipments(shipmentData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Function to calculate weight stats
  const calculateStats = (data, goals) => {
    if (data.length === 0) return;

    // Use goals data if available, otherwise use first and last weight entries
    const startingWeight = goals?.startingWeight || data[0].weight;
    const currentWeight = data[data.length - 1].weight;
    const goalWeight = goals?.weightGoal || 165; // Default if no goal set
    const totalLost = startingWeight - currentWeight;

    // Calculate progress percentage safely
    let progressPercentage = 0;
    if (startingWeight !== goalWeight) {
      progressPercentage = (totalLost / (startingWeight - goalWeight)) * 100;
    }

    // Calculate estimated completion date based on average weekly loss
    const weeklyLossRate = data.length > 1 ?
      (data[0].weight - data[data.length - 1].weight) / (data.length - 1) * 7 : 0;
    const weeksToGoal = weeklyLossRate > 0 ? (currentWeight - goalWeight) / weeklyLossRate : 0;
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + (weeksToGoal * 7));

    // Weekly stats
    const lastWeekData = data.slice(-2);
    const weeklyAvg = currentWeight;
    const weeklyChange = lastWeekData.length > 1 ?
      lastWeekData[1].weight - lastWeekData[0].weight : 0;
    const changeRate = lastWeekData.length > 0 && lastWeekData[0].weight > 0 ?
      (weeklyChange / lastWeekData[0].weight) * 100 : 0;

    setStats({
      startingWeight,
      currentWeight,
      goalWeight,
      totalLost,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      weightToLose: currentWeight - goalWeight,
      estimatedCompletion: estimatedCompletion.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      weeklyAvg,
      weeklyChange,
      changeRate
    });
  };

  // Function to create or update the chart
  const createOrUpdateChart = (data) => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Prepare data for chart
      const labels = data.map(entry => {
        const date = new Date(entry.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const weights = data.map(entry => entry.weight);

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Weight (lbs)',
            data: weights,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgba(79, 70, 229, 1)',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(79, 70, 229, 0.9)',
              titleColor: 'white',
              bodyColor: 'white',
              bodyFont: {
                size: 14
              },
              padding: 10,
              cornerRadius: 6,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y} lbs`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                drawBorder: false,
                color: 'rgba(229, 231, 235, 0.5)'
              },
              ticks: {
                font: {
                  size: 12
                },
                color: 'rgba(107, 114, 128, 1)'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 12
                },
                color: 'rgba(107, 114, 128, 1)'
              }
            }
          }
        }
      });
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate medication taken count
  const medicationsTaken = medications.filter(med => med.taken).length;
  const totalMedications = medications.length;
  const medicationStatus = totalMedications > 0
    ? `${medicationsTaken}/${totalMedications} Medication${totalMedications !== 1 ? 's' : ''} Taken`
    : 'No medications scheduled';

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-xl text-indigo-600 font-medium tracking-wide">Today's overview</h2>
            <h1 className="text-4xl font-bold text-gray-900 mt-1">Health Dashboard</h1>
          </div>
          <div className="text-right bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">{formattedDate}</h3>
            <p className="text-sm text-indigo-600 font-medium">{medicationStatus}</p>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6 ">
            {/* Weight Patterns Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4 ">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weight Patterns Overview</h3>
                  <p className="text-sm text-gray-500">
                    {weightData.length > 0
                      ? `${new Date(weightData[0].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${new Date(weightData[weightData.length-1].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                      : 'No data available'}
                  </p>
                </div>
                <Link to="/weight" className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {weightData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No weight data available</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">Start tracking your weight to see patterns and insights about your progress.</p>
                  <Link to="/weight" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Add Weight Entry
                  </Link>
                </div>
              ) : (
                <>
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
                            strokeDashoffset={282.7 - (282.7 * stats.progressPercentage / 100)}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-gray-900">{stats.progressPercentage.toFixed(0)}%</span>
                          <span className="text-sm text-gray-500">Progress to Goal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 ml-0 md:ml-8">
                      <h4 className="text-lg font-medium mb-3">Weight Trends</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {stats.totalLost > 0
                          ? `You've lost ${stats.totalLost.toFixed(1)} lbs (${stats.progressPercentage.toFixed(0)}% of your goal) since you started tracking. Keep up the good work!`
                          : `You're just getting started with tracking your weight. Keep consistent with your entries to see meaningful trends.`}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500">Starting Weight</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold mr-1">{stats.startingWeight}</span>
                            <span className="text-xs text-gray-500">lbs</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500">Current Weight</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold mr-1">{stats.currentWeight}</span>
                            <span className="text-xs text-gray-500">lbs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weight Chart */}
                  {/* <div className="mt-6 h-64 relative bg-amber-200 ">
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                  </div> */}
                </>
              )}
            </div>

            {/* Weight Loss Journey */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Weight Loss Journey</h3>
                  <p className="text-sm text-gray-600">
                    {weightData.length > 0
                      ? `${new Date(weightData[0].date).toLocaleDateString('en-US', { month: 'short' })} - ${new Date(weightData[weightData.length-1].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      : 'No data available'}
                  </p>
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

              {weightData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No weight data available</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">Start tracking your weight to see your journey over time.</p>
                  <Link to="/weight" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Add Weight Entry
                  </Link>
                </div>
              ) : (
                <>
                  {/* Weight Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Starting</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.startingWeight} <span className="text-sm font-normal text-gray-500">lbs</span></p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Initial weight</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Current</p>
                          <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.currentWeight} <span className="text-sm font-normal text-gray-500">lbs</span></p>
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
                          <p className="text-2xl font-bold text-green-600 mt-1">{stats.goalWeight} <span className="text-sm font-normal text-gray-500">lbs</span></p>
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
                          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalLost.toFixed(1)} <span className="text-sm font-normal text-gray-500">lbs</span></p>
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

                  {/* Progress Bar */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress to Goal</span>
                      <span className="text-sm font-medium text-indigo-600">{stats.progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${stats.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">{stats.weightToLose.toFixed(1)} lbs to go</span>
                      <span className="text-xs text-gray-500">Est. completion: {stats.estimatedCompletion}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Weekly Summary and Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Weekly Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Weekly Summary</h4>
                {weightData.length < 2 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Not enough data to show weekly summary.</p>
                    <p className="text-sm text-gray-400 mt-1">Add more weight entries to see weekly trends.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current week avg</p>
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold text-gray-900">{stats.weeklyAvg}</span>
                        <span className="text-sm text-gray-500 ml-1">lbs</span>
                        <span className={`ml-2 text-xs ${stats.weeklyChange < 0 ? 'text-green-500' : stats.weeklyChange > 0 ? 'text-red-500' : 'text-gray-500'} font-medium`}>
                          {stats.weeklyChange < 0 ? '-' : stats.weeklyChange > 0 ? '+' : ''}
                          {Math.abs(stats.weeklyChange).toFixed(1)} lbs
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Weekly change rate</p>
                      <div className="flex items-baseline">
                        <span className={`text-xl font-bold ${stats.changeRate < 0 ? 'text-green-500' : stats.changeRate > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {stats.changeRate.toFixed(1)}%
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {Math.abs(stats.changeRate) < 2 ? 'Healthy rate' : Math.abs(stats.changeRate) < 3 ? 'Moderate rate' : 'Rapid rate'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>



            </div>
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-6">
            {/* Medication Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Medication Tracking</h3>
                <Link to="/medications" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Medication Status */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{medicationsTaken}/{totalMedications}</span> Medications taken today
                </div>
                <Link to="/medications" className="text-xs text-blue-600 font-medium flex items-center">
                  Manage medications
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Medication List */}
              {medications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">Start tracking your medications to get reminders and manage your health better.</p>
                  <Link to="/medications" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Add Medication
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {medications.slice(0, 2).map((medication) => (
                    <div key={medication._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start">
                        <div className={`mr-3 w-10 h-10 ${medication.taken ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center ${medication.taken ? 'text-green-600' : 'text-blue-600'} mt-1`}>
                          {medication.taken ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium text-gray-900">{medication.name}</p>
                                {medication.taken ? (
                                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Taken</span>
                                ) : (
                                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Pending</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{medication.dosage}, {medication.frequency}</p>
                              <div className="mt-2 text-xs text-gray-600">
                                <p><span className="font-medium">Type:</span> {medication.type || 'Not specified'}</p>
                                <p><span className="font-medium">Purpose:</span> {medication.purpose || 'Not specified'}</p>
                                <p><span className="font-medium">Refills:</span> {medication.refills || 0} remaining</p>
                              </div>
                            </div>
                            <Link to={`/medications/${medication._id}`} className="text-blue-600 hover:text-blue-800">
                              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg> */}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {medications.length > 2 && (
                    <div className="text-center mt-4">
                      <Link to="/medications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all {medications.length} medications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipment Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Tracking</h3>
                <Link to="/shipments" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {/* Shipment List */}
              {shipments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">Track your medication shipments to know when they'll arrive.</p>
                  <Link to="/shipments" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Add Shipment
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upcoming Shipments */}
                  {shipments.filter(s => s.status !== 'delivered').length > 0 && (
                    <>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming Shipments</h4>
                      {shipments
                        .filter(s => s.status !== 'delivered')
                        .slice(0, 1)
                        .map(shipment => (
                          <div key={shipment._id} className="p-4 border border-blue-100 bg-blue-50 rounded-lg mb-4">
                            <div className="flex items-start">
                              <div className="mr-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {shipment.medication?.name || 'Medication'} Shipment
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Expected delivery: {shipment.expectedDeliveryDate ? new Date(shipment.expectedDeliveryDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      }) : 'Not specified'}
                                    </p>
                                    <div className="mt-3">
                                      <div className="flex items-center mb-1">
                                        <span className="text-xs font-medium text-gray-700">Shipment Status:</span>
                                        <span className={`ml-2 px-2 py-0.5 ${
                                          shipment.status === 'processing' ? 'bg-gray-100 text-gray-800' :
                                          shipment.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                          shipment.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-green-100 text-green-800'
                                        } text-xs rounded-full`}>
                                          {shipment.status === 'processing' ? 'Processing' :
                                           shipment.status === 'shipped' ? 'Shipped' :
                                           shipment.status === 'in-transit' ? 'In Transit' :
                                           'Out for Delivery'}
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full ${
                                            shipment.status === 'processing' ? 'bg-gray-500' :
                                            shipment.status === 'shipped' ? 'bg-blue-500' :
                                            shipment.status === 'in-transit' ? 'bg-yellow-500' :
                                            'bg-green-500'
                                          } rounded-full`}
                                          style={{
                                            width: shipment.status === 'processing' ? '25%' :
                                                  shipment.status === 'shipped' ? '50%' :
                                                  shipment.status === 'in-transit' ? '75%' : '90%'
                                          }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span className={shipment.status === 'processing' ? 'font-medium text-gray-700' : ''}>Processed</span>
                                        <span className={shipment.status === 'shipped' ? 'font-medium text-blue-700' : ''}>Shipped</span>
                                        <span className={shipment.status === 'in-transit' ? 'font-medium text-yellow-700' : ''}>In Transit</span>
                                        <span className={shipment.status === 'out-for-delivery' ? 'font-medium text-green-700' : ''}>Out for Delivery</span>
                                      </div>
                                    </div>
                                    {shipment.trackingNumber && (
                                      <div className="mt-3 flex items-center">
                                        <span className="text-xs font-medium text-gray-700 mr-2">Tracking:</span>
                                        <span className="text-xs text-blue-600">{shipment.trackingNumber}</span>
                                        <Link to={`/shipments/${shipment._id}`} className="ml-2 text-xs text-blue-600 underline">Track</Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Recent Deliveries */}
                  {shipments.filter(s => s.status === 'delivered').length > 0 && (
                    <>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Deliveries</h4>
                      <div className="space-y-3">
                        {shipments
                          .filter(s => s.status === 'delivered')
                          .slice(0, 2)
                          .map(shipment => (
                            <div key={shipment._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <div className="flex items-center">
                                <div className="mr-3 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {shipment.medication?.name || 'Medication'} Shipment
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Delivered: {shipment.actualDeliveryDate ? new Date(shipment.actualDeliveryDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        }) : 'Not specified'}
                                      </p>
                                    </div>
                                    <Link to={`/shipments/${shipment._id}`} className="text-xs text-blue-600">Details</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  {shipments.length > 3 && (
                    <div className="text-center mt-4">
                      <Link to="/shipments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all {shipments.length} shipments
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
