import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getWeightRecords,
  createWeightRecord,
  deleteWeightRecord,
  getWeightGoals,
  updateWeightGoals
} from '../services/weightService';
import Chart from 'chart.js/auto';

const Weight = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weightData, setWeightData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [newWeight, setNewWeight] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFormData, setGoalFormData] = useState({
    startingWeight: '',
    weightGoal: ''
  });
  const [weightGoals, setWeightGoals] = useState({
    startingWeight: null,
    currentWeight: null,
    weightGoal: null,
    weightChange: 0
  });
  const [stats, setStats] = useState({
    startingWeight: 0,
    currentWeight: 0,
    goalWeight: 0,
    totalLost: 0,
    bmi: 0,
    targetBmi: 0,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch weight records
        const data = await getWeightRecords();

        // Format the data
        const formattedData = data.map(record => ({
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
        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setWeightData(formattedData);

        // Fetch weight goals
        const goals = await getWeightGoals();
        setWeightGoals(goals);

        // Calculate stats using both data sources
        calculateStats(formattedData, goals);

        // Create chart after data is loaded
        if (formattedData.length > 0) {
          createOrUpdateChart(formattedData, goals);
        }
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
  }, [timeRange]);

  // Function to create or update the chart
  const createOrUpdateChart = (data, goals) => {
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

  const calculateStats = (data, goals) => {
    if (data.length === 0) return;

    // Use goals data if available, otherwise use first and last weight entries
    const startingWeight = goals?.startingWeight || data[0].weight;
    const currentWeight = data[data.length - 1].weight;
    const goalWeight = goals?.weightGoal || 165; // Default if no goal set
    const totalLost = startingWeight - currentWeight;

    const height = user?.height || 175; // Height in cm
    const heightInMeters = height / 100;
    const bmi = currentWeight / (heightInMeters * heightInMeters) * 0.45359237; // Convert lbs to kg
    const targetBmi = 25;
    const weightToLose = currentWeight - goalWeight;

    // Calculate progress percentage safely
    let progressPercentage = 0;
    if (startingWeight !== goalWeight) {
      progressPercentage = (totalLost / (startingWeight - goalWeight)) * 100;
    }

    // Calculate estimated completion date based on average weekly loss
    const weeklyLossRate = data.length > 1 ?
      (data[0].weight - data[data.length - 1].weight) / (data.length - 1) * 7 : 0;
    const weeksToGoal = weeklyLossRate > 0 ? weightToLose / weeklyLossRate : 0;
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
      bmi: bmi.toFixed(1),
      targetBmi,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      weightToLose,
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

  const [addingWeight, setAddingWeight] = useState(false);
  const [addError, setAddError] = useState('');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [updatingGoals, setUpdatingGoals] = useState(false);
  const [goalError, setGoalError] = useState('');

  // Handle weight goal form changes
  const handleGoalFormChange = (e) => {
    const { name, value } = e.target;
    setGoalFormData({
      ...goalFormData,
      [name]: value ? parseFloat(value) : ''
    });
  };

  // Handle weight goal form submission
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    setGoalError('');

    if (!goalFormData.startingWeight && !goalFormData.weightGoal) {
      setGoalError('Please enter at least one value');
      return;
    }

    try {
      setUpdatingGoals(true);

      // Create goal data object
      const goalData = {};

      if (goalFormData.startingWeight) {
        goalData.startingWeight = parseFloat(goalFormData.startingWeight);
      }

      if (goalFormData.weightGoal) {
        goalData.weightGoal = parseFloat(goalFormData.weightGoal);
      }

      // Update weight goals
      const updatedGoals = await updateWeightGoals(goalData);

      // Update state with the new goals
      setWeightGoals({
        startingWeight: updatedGoals.startingWeight,
        currentWeight: updatedGoals.currentWeight,
        weightGoal: updatedGoals.weightGoal,
        weightChange: updatedGoals.weightChange
      });

      // Fetch updated weight data to ensure we have the latest
      const data = await getWeightRecords();

      // Format the data
      const formattedData = data.map(record => ({
        id: record._id,
        date: new Date(record.date).toISOString().split('T')[0],
        weight: record.weight,
        startingWeight: record.startingWeight,
        currentWeight: record.currentWeight || record.weight, // Ensure currentWeight is set
        weightGoal: record.weightGoal,
        weightChange: record.weightChange,
        notes: record.notes
      }));

      // Sort by date (oldest first for proper chart display)
      formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setWeightData(formattedData);
      calculateStats(formattedData, updatedGoals);
      createOrUpdateChart(formattedData, updatedGoals);

      // Show success message
      setGoalError({ type: 'success', message: 'Weight goals updated successfully!' });

      // Reset form after a delay
      setTimeout(() => {
        setGoalFormData({
          startingWeight: '',
          weightGoal: ''
        });
        setShowGoalForm(false);
        setGoalError('');
      }, 2000);
    } catch (error) {
      setGoalError({ type: 'error', message: error.toString() });
    } finally {
      setUpdatingGoals(false);
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newWeight || isNaN(newWeight)) {
      setAddError('Please enter a valid weight');
      return;
    }

    try {
      setAddingWeight(true);

      // Create new weight record with current weight
      const weightData = {
        weight: parseFloat(newWeight),
        date: weightDate || new Date().toISOString().split('T')[0],
        // The backend will automatically set this as currentWeight
      };

      const newEntry = await createWeightRecord(weightData);

      // Format the new entry to match our state format
      const formattedEntry = {
        id: newEntry._id,
        date: new Date(newEntry.date).toISOString().split('T')[0],
        weight: newEntry.weight,
        startingWeight: newEntry.startingWeight,
        currentWeight: newEntry.currentWeight || newEntry.weight, // Ensure currentWeight is set
        weightGoal: newEntry.weightGoal,
        weightChange: newEntry.weightChange
      };

      // Fetch all weight data to ensure we have the latest
      const allWeightData = await getWeightRecords();

      // Format the data
      const formattedData = allWeightData.map(record => ({
        id: record._id,
        date: new Date(record.date).toISOString().split('T')[0],
        weight: record.weight,
        startingWeight: record.startingWeight,
        currentWeight: record.currentWeight || record.weight,
        weightGoal: record.weightGoal,
        weightChange: record.weightChange,
        notes: record.notes
      }));

      // Sort by date
      formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Fetch updated goals
      const goals = await getWeightGoals();
      setWeightGoals(goals);

      setWeightData(formattedData);
      calculateStats(formattedData, goals);
      createOrUpdateChart(formattedData, goals);

      // Show success message
      setAddError({ type: 'success', message: 'Weight entry added successfully!' });

      // Reset form after a delay
      setTimeout(() => {
        setNewWeight('');
        setWeightDate(new Date().toISOString().split('T')[0]);
        setShowAddForm(false);
        setAddError('');
      }, 2000);
    } catch (error) {
      setAddError({ type: 'error', message: error.toString() });
    } finally {
      setAddingWeight(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Function to delete a weight record
  const handleDeleteWeight = async (id) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      try {
        await deleteWeightRecord(id);

        // Update state after successful deletion
        const updatedData = weightData.filter(entry => entry.id !== id);
        setWeightData(updatedData);

        if (updatedData.length > 0) {
          calculateStats(updatedData);
          createOrUpdateChart(updatedData);
        }
      } catch (error) {
        console.error('Error deleting weight record:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weight Tracking</h1>
            <p className="text-gray-600">Monitor and track your weight loss journey</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowGoalForm(!showGoalForm);
                if (showAddForm) setShowAddForm(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {showGoalForm ? 'Cancel' : 'Set Weight Goals'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showGoalForm) setShowGoalForm(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showAddForm ? 'Cancel' : 'Add Weight Entry'}
            </button>
          </div>
        </div>

        {/* Weight Goals Form */}
        {showGoalForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Weight Goals</h3>
            {goalError && typeof goalError === 'string' && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <p>{goalError}</p>
              </div>
            )}
            {goalError && typeof goalError === 'object' && (
              <div className={`mb-4 ${goalError.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'} p-4 rounded-md`}>
                <p>{goalError.message}</p>
              </div>
            )}
            <form onSubmit={handleGoalSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startingWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Weight (lbs)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="startingWeight"
                    name="startingWeight"
                    value={goalFormData.startingWeight}
                    onChange={handleGoalFormChange}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder={weightGoals.startingWeight || "Enter starting weight"}
                    step="0.1"
                    min="50"
                    max="500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {weightGoals.startingWeight ? `Current: ${weightGoals.startingWeight} lbs` : "Your initial weight when you began"}
                </p>
              </div>

              <div>
                <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Weight (lbs)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="weightGoal"
                    name="weightGoal"
                    value={goalFormData.weightGoal}
                    onChange={handleGoalFormChange}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder={weightGoals.weightGoal || "Enter goal weight"}
                    step="0.1"
                    min="50"
                    max="500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {weightGoals.weightGoal ? `Current: ${weightGoals.weightGoal} lbs` : "Your target weight to achieve"}
                </p>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={updatingGoals}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                  {updatingGoals ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Goals'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Weight Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Weight Entry</h3>
            {addError && typeof addError === 'string' && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <p>{addError}</p>
              </div>
            )}
            {addError && typeof addError === 'object' && (
              <div className={`mb-4 ${addError.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'} p-4 rounded-md`}>
                <p>{addError.message}</p>
              </div>
            )}
            <form onSubmit={handleAddWeight} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="weight"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter your weight"
                    step="0.1"
                    min="50"
                    max="500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={addingWeight}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                  {addingWeight ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Entry'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Weight Loss Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">Weight Loss Progress</h3>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {stats.totalLost > 0
              ? `You've lost ${stats.totalLost} lbs since you started tracking. Keep up the good work!`
              : 'Start tracking your weight to see your progress over time.'}
          </p>

          {/* Historical Weight Chart */}
          <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header with tabs */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Weight Tracking</h3>
                <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
                  <button
                    onClick={() => handleTimeRangeChange('week')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      timeRange === 'week'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => handleTimeRangeChange('month')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      timeRange === 'month'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => handleTimeRangeChange('year')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      timeRange === 'year'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    Year
                  </button>
                  <button
                    onClick={() => handleTimeRangeChange('all')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      timeRange === 'all'
                        ? 'bg-white text-indigo-700'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Weight Stats Cards */}
              {/* <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="col-span-4 md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">Starting</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {weightGoals.startingWeight ? weightGoals.startingWeight : stats.startingWeight}
                    </div>
                    <div className="text-xs text-gray-500">lbs</div>
                    {!weightGoals.startingWeight && (
                      <button
                        onClick={() => {
                          setShowGoalForm(true);
                          setShowAddForm(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Set starting weight
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-span-4 md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">Current</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      {weightGoals.currentWeight ? weightGoals.currentWeight : stats.currentWeight}
                    </div>
                    <div className="text-xs text-gray-500">lbs</div>
                    {!weightGoals.currentWeight && weightData.length === 0 && (
                      <button
                        onClick={() => {
                          setShowAddForm(true);
                          setShowGoalForm(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Add weight entry
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-span-4 md:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Goal</div>
                    <div className="text-3xl font-bold text-green-600">
                      {weightGoals.weightGoal ? weightGoals.weightGoal : stats.goalWeight}
                    </div>
                    <div className="text-xs text-gray-500">lbs</div>
                    {!weightGoals.weightGoal && (
                      <button
                        onClick={() => {
                          setShowGoalForm(true);
                          setShowAddForm(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Set goal weight
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-span-4 md:col-span-1 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-1">
                      {weightGoals.weightChange <= 0 ? 'Lost' : 'Gained'}
                    </div>
                    <div className={`text-3xl font-bold ${weightGoals.weightChange <= 0 ? 'text-purple-600' : 'text-red-500'}`}>
                      {weightGoals.startingWeight && weightGoals.currentWeight ?
                        Math.abs(weightGoals.weightChange).toFixed(1) :
                        stats.totalLost
                      }
                    </div>
                    <div className="text-xs text-gray-500">lbs</div>
                    {!weightGoals.startingWeight && !weightGoals.currentWeight && (
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        Set starting and current weight
                      </div>
                    )}
                  </div>
                </div>
              </div> */}

              {/* Weight Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="h-72 relative">
                  {weightData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No weight data</h3>
                        <p className="mt-1 text-sm text-gray-500">Start by adding your first weight entry.</p>
                      </div>
                    </div>
                  ) : (
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Progress to Goal</h4>
                  <span className="text-sm font-bold text-indigo-600">{stats.progressPercentage.toFixed(0)}%</span>
                </div>

                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${stats.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Weight Lost</p>
                    <p className="text-lg font-bold text-green-600">-{stats.totalLost} lbs</p>
                    <p className="text-xs text-gray-500 mt-1">Since starting</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">To Lose</p>
                    <p className="text-lg font-bold text-indigo-600">{stats.weightToLose.toFixed(1)} lbs</p>
                    <p className="text-xs text-gray-500 mt-1">To reach goal</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Est. Completion</p>
                    <p className="text-lg font-bold text-gray-800">{stats.estimatedCompletion}</p>
                    <p className="text-xs text-gray-500 mt-1">At current rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Starting Weight</p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">{stats.startingWeight}</span>
                <span className="text-xs text-gray-500 ml-1">lbs</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Current Weight</p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">{stats.currentWeight}</span>
                <span className="text-xs text-gray-500 ml-1">lbs</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Goal Weight</p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">{stats.goalWeight}</span>
                <span className="text-xs text-gray-500 ml-1">lbs</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Lost</p>
              <div className="flex items-baseline">
                <span className={`text-xl font-bold ${stats.totalLost > 0 ? 'text-green-500' : 'text-gray-900'}`}>
                  {stats.totalLost > 0 ? `-${stats.totalLost}` : stats.totalLost}
                </span>
                <span className="text-xs text-gray-500 ml-1">lbs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight History Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight History</h3>
          {weightData.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No weight records</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first weight entry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    // Sort by date descending for the table (newest first)
                    const sortedData = [...weightData].sort((a, b) => new Date(b.date) - new Date(a.date));

                    return sortedData.map((currentEntry, i) => {
                      const nextEntry = i < sortedData.length - 1 ? sortedData[i + 1] : null;
                      const change = nextEntry ? currentEntry.weight - nextEntry.weight : 0;

                      return (
                        <tr key={currentEntry.id || currentEntry.date} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(currentEntry.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {currentEntry.weight} lbs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {!nextEntry ? (
                              <span className="text-gray-500">-</span>
                            ) : (
                              <span className={change < 0 ? 'text-green-500 font-medium' : change > 0 ? 'text-red-500 font-medium' : 'text-gray-500'}>
                                {change < 0 ? '↓' : change > 0 ? '↑' : ''}
                                {' '}
                                {Math.abs(change).toFixed(1)} lbs
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteWeight(currentEntry.id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BMI and Progress Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* BMI Calculator */}

        {/* Weekly Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current week avg</p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">{stats.weeklyAvg}</span>
                <span className="text-sm text-gray-500 ml-1">lbs</span>
                {stats.weeklyChange !== 0 && (
                  <span className={`ml-2 text-xs font-medium ${stats.weeklyChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.weeklyChange < 0 ? '-' : '+'}{Math.abs(stats.weeklyChange)} lbs
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Weekly change rate</p>
              <div className="flex items-baseline">
                <span className={`text-xl font-bold ${stats.changeRate < 0 ? 'text-green-500' : stats.changeRate > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                  {stats.changeRate < 0 ? '' : '+'}{stats.changeRate.toFixed(1)}%
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {Math.abs(stats.changeRate) < 2 ? 'Healthy rate' : Math.abs(stats.changeRate) < 5 ? 'Moderate rate' : 'High rate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weight;
