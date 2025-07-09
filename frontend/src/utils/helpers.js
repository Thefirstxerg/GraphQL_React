// Error handling utilities
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.networkError) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const handleFormError = (field, value) => {
  if (!value || value.trim() === '') {
    return `${field} is required`;
  }
  
  if (field === 'email' && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }
  
  if (field === 'password' && value.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};