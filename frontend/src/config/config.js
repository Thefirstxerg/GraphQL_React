// API Configuration
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://graphql-react-backend.onrender.com/graphql',
  environment: process.env.REACT_APP_ENVIRONMENT || 'production',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development'
};

export default config;