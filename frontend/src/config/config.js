// API Configuration
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/graphql',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development'
};

export default config;