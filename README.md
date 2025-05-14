# Patient Dashboard

A comprehensive health management application for patients to track weight, medications, and shipments.

![Patient Dashboard](https://via.placeholder.com/800x400?text=Patient+Dashboard)

## Features

- **User Authentication**: Secure registration and login system
- **Weight Tracking**: Record and visualize weight measurements over time
- **Medication Management**: Track medications and monitor adherence
- **Shipment Tracking**: Monitor medication deliveries and shipment status
- **User Profile**: Manage personal and health information

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- [Git](https://git-scm.com/)

## Installation

Follow these steps to set up the project locally:



## Running the Application

### 1. Start the backend server

```bash
# From the backend directory
nodemon server.js
```

The backend server will start on http://localhost:5000.

### 2. Start the frontend development server

```bash
# From the frontend directory
npm run dev
```

The frontend development server will start on http://localhost:5173.

### 3. Access the application

Open your browser and navigate to:

```
http://localhost:5173
```

## API Documentation

The backend provides the following API endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Weight Management

- `GET /api/weight` - Get all weight records
- `POST /api/weight` - Create a weight record
- `GET /api/weight/:id` - Get a specific weight record
- `PUT /api/weight/:id` - Update a weight record
- `DELETE /api/weight/:id` - Delete a weight record
- `GET /api/weight/goals` - Get weight goals
- `POST /api/weight/goals` - Update weight goals

### Medication Management

- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create a medication
- `GET /api/medications/:id` - Get a specific medication
- `PUT /api/medications/:id` - Update a medication
- `DELETE /api/medications/:id` - Delete a medication

### Shipment Tracking

- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create a shipment
- `GET /api/shipments/:id` - Get a specific shipment
- `PUT /api/shipments/:id` - Update a shipment
- `DELETE /api/shipments/:id` - Delete a shipment

## Testing the Application

### Creating a Test User

1. Navigate to the registration page at http://localhost:5173/register
2. Fill in the registration form with test user details
3. Submit the form to create a new user account
4. You will be automatically logged in and redirected to the dashboard

### Adding Test Data

#### Weight Records

1. Navigate to the Weight page
2. Use the "Add Weight Entry" button to add weight measurements
3. Set weight goals using the "Set Weight Goals" button

#### Medications

1. Navigate to the Medications page
2. Use the "Add Medication" button to add new medications
3. Update medication status as needed

#### Shipments

1. Navigate to the Shipments page
2. Use the "Add Shipment" button to add new shipment records
3. Update shipment status as needed

## Troubleshooting

### Common Issues

#### Backend Connection Issues

If the frontend cannot connect to the backend:

1. Ensure the backend server is running
2. Check that the `Backend_URL` in the frontend `.env` file is correct
3. Verify that CORS is properly configured in the backend

#### Database Connection Issues

If the backend cannot connect to MongoDB:

1. Ensure MongoDB is running (if using local installation)
2. Check the `MONGO_URI` in the backend `.env` file
3. Verify network connectivity to MongoDB Atlas (if using cloud)

#### Authentication Issues

If you encounter login or registration problems:

1. Check the browser console for error messages
2. Verify that the `JWT_SECRET` is properly set in the backend `.env` file
3. Clear browser localStorage and try again

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Deployment

### Deploying the Frontend to Vercel

1. Create an account on [Vercel](https://vercel.com/shivendra0712s-projects/patient-dashboard) if you don't have one
2. Connect your GitHub repository to Vercel
3. Configure the build settings:
   - Build Command: npm run build
   - Output Directory: dist
4. Set up environment variables:
   - Go to Project Settings > Environment Variables
   - Add VITE_BACKEND_URL with your production backend URL (e.g., https://your-backend.onrender.com/api)
5. Deploy the application

### Deploying the Backend to Render

1. Create an account on [Render](https://dashboard.render.com/web/srv-d0hoateuk2gs73c1e040) if you don't have one
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the build settings:
   - Root Directory: backend (if your backend is in a subdirectory)
   - Build Command: npm install
   - Start Command: npm start
5. Set up environment variables:
   - Add all the variables from your .env file
   - Make sure to update FRONTEND_URL to your Vercel frontend URL
   - Set up your MongoDB connection string
6. Deploy the service


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
