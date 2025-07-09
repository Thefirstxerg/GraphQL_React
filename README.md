# EasyEvent - GraphQL Event Management System

![EasyEvent Authentication](https://github.com/user-attachments/assets/12fd8c76-0175-4748-9940-7cb600b88193)

A modern, full-stack event management application built with **React**, **GraphQL**, and **Node.js**. This project demonstrates proficiency in modern web development technologies, responsive design, and API development.

## 🚀 Features

- **User Authentication** - Secure login and registration system with JWT tokens
- **Event Management** - Create, view, and manage events with detailed information
- **Booking System** - Book events and view bookings in list or chart format
- **Real-time Updates** - GraphQL subscriptions for live data updates
- **Responsive Design** - Modern UI that works seamlessly across all devices
- **Professional Styling** - Clean, contemporary design with smooth animations

## 🛠️ Technology Stack

### Frontend
- **React 16.7** - Component-based UI library
- **React Router** - Client-side routing
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **Chart.js** - Data visualization for booking analytics

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **GraphQL** - Query language and runtime for APIs
- **MongoDB** - NoSQL database for data persistence
- **JWT** - JSON Web Tokens for authentication

## 📱 Screenshots

### Authentication Page
![Authentication](https://github.com/user-attachments/assets/12fd8c76-0175-4748-9940-7cb600b88193)

### Events Dashboard
![Events Page](https://github.com/user-attachments/assets/4bbeae08-d679-415f-b41a-79d7142c69a1)

## 🏗️ Architecture

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── context/         # React Context for state management
│   │   └── config/          # Environment configuration
│   └── public/              # Static assets
├── graphql/                 # GraphQL schema and resolvers
├── models/                  # MongoDB data models
├── middleware/              # Express middleware
└── app.js                   # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thefirstxerg/GraphQL_React.git
   cd GraphQL_React
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Setup**
   
   Backend `.env`:
   ```
   MONGO_USER=your_mongodb_user
   MONGO_PASSWORD=your_mongodb_password
   MONGO_DB=your_database_name
   JWT_KEY=your_jwt_secret_key
   ```
   
   Frontend `.env`:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8000/graphql
   REACT_APP_ENVIRONMENT=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   NODE_OPTIONS="--openssl-legacy-provider" npm start
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - GraphQL Playground: `http://localhost:8000/graphql`

## 🏭 Production Deployment

### Build for Production

```bash
cd frontend
NODE_OPTIONS="--openssl-legacy-provider" npm run build
```

### Environment Configuration

For production deployment, update the environment variables:

```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com/graphql
REACT_APP_ENVIRONMENT=production
```

## 📊 GraphQL API

The application uses GraphQL for all data operations. Key operations include:

### Queries
- `events` - Fetch all events
- `bookings` - Fetch user bookings
- `login` - Authenticate user

### Mutations
- `createEvent` - Create a new event
- `bookEvent` - Book an event
- `cancelBooking` - Cancel a booking
- `createUser` - Register new user

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional interface design
- **Responsive Layout** - Mobile-first approach with flexible grid system
- **Smooth Animations** - CSS transitions and hover effects
- **Professional Typography** - Inter font family for better readability
- **Consistent Color Scheme** - Purple gradient theme throughout the application
- **Accessible Components** - ARIA labels and keyboard navigation support

## 🔧 Key Development Practices

- **Component Reusability** - Modular React components
- **Environment Configuration** - Flexible deployment settings
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Loading States** - Professional loading indicators
- **Code Organization** - Clear folder structure and separation of concerns

## 🚀 Performance Optimizations

- **Code Splitting** - React lazy loading for better performance
- **Optimized Builds** - Webpack bundling with minification
- **Efficient Queries** - GraphQL query optimization
- **Responsive Images** - Optimized asset loading

## 📈 Future Enhancements

- Real-time notifications
- Advanced event filtering and search
- Payment integration
- Social sharing features
- Mobile app development
- Admin dashboard
- Analytics and reporting

## 👨‍💻 Developer

**Thefirstxerg**
- GitHub: [@Thefirstxerg](https://github.com/Thefirstxerg)

---

This project showcases modern full-stack development skills and is ready for production deployment. It demonstrates proficiency in React, GraphQL, Node.js, and modern web development best practices.