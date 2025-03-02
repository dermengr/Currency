# Currency Manager and Converter

## 🌟 Overview
A full-stack application for managing and converting currencies with user authentication and admin capabilities. This application provides real-time currency conversion, administrative controls for managing exchange rates, and a secure user authentication system.

## ✨ Features
- 🔄 Real-time currency conversion
- 🔐 User authentication and authorization
- 👑 Admin dashboard for managing exchange rates
- 💱 Support for multiple currency pairs
- 🎯 RESTful API architecture
- 🛡️ Secure JWT-based authentication
- 📱 Responsive web design

## 🛠️ Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express-validator for input validation

### Frontend
- React.js
- Context API for state management
- Bootstrap for styling
- Axios for API communication
- React Router for navigation

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dermengr/Currency.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Currency
   ```

3. Create a .env file in the backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

5. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Usage

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. Start the frontend application in a new terminal:
   ```bash
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## 👥 User Roles

### Regular Users Can:
- Convert currencies using available exchange rates
- View conversion history
- Manage their profile

### Administrators Can:
- Add/Edit/Delete currency pairs
- Manage exchange rates
- View system logs
- Monitor user activity

## 🔑 API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Currency Operations
- GET /api/currency - Get all currency pairs
- POST /api/currency - Create new currency pair (Admin only)
- PUT /api/currency/:id - Update currency pair (Admin only)
- DELETE /api/currency/:id - Delete currency pair (Admin only)
- POST /api/currency/convert - Convert between currencies

## 💻 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 🔧 Configuration

### Backend Configuration
The backend can be configured using environment variables in the `.env` file:
- `NODE_ENV` - Development/Production mode
- `PORT` - Server port number
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend Configuration
Frontend configuration can be modified in `frontend/src/config.js`:
- API base URL
- Authentication settings
- Theme configuration

## 🚨 Error Handling
The application implements comprehensive error handling:
- Validation errors
- Authentication errors
- Database operation errors
- Network request errors

## 🔒 Security Features
- JWT-based authentication
- Password hashing
- Input validation
- XSS protection
- CORS configuration
- Rate limiting

## 📦 Project Structure
```
currency/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Entry point
├── frontend/
│   ├── public/        # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/    # React context
│       ├── services/   # API services
│       └── App.js      # Main component
└── README.md
```

## 🤝 Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Contribution Guidelines
- Write clear, descriptive commit messages
- Update documentation as needed
- Add tests for new features
- Follow the existing code style

## 🐛 Bug Reports
Please report bugs by creating an issue with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments
- Thanks to all contributors
- Built with [React](https://reactjs.org/)
- Powered by [Node.js](https://nodejs.org/)
- Database by [MongoDB](https://www.mongodb.com/)
