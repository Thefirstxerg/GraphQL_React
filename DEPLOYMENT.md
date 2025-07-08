# EasyEvent Deployment Guide

This guide provides instructions for deploying the EasyEvent application to various hosting platforms.

## 🚀 Quick Start

### Development
```bash
# Backend
npm start

# Frontend  
cd frontend
npm start
```

### Production Build
```bash
cd frontend
npm run build:prod
```

## ☁️ Hosting Options

### 1. Netlify (Frontend)

1. **Build Settings**
   - Build command: `cd frontend && npm run build:prod`
   - Publish directory: `frontend/build`

2. **Environment Variables**
   ```
   REACT_APP_BACKEND_URL=https://your-backend-domain.com/graphql
   REACT_APP_ENVIRONMENT=production
   ```

### 2. Vercel (Frontend)

1. **vercel.json** (in frontend directory):
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "buildCommand": "npm run build:prod"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

### 3. Heroku (Backend)

1. **Procfile**:
   ```
   web: node app.js
   ```

2. **Environment Variables**:
   ```
   MONGO_USER=your_mongodb_user
   MONGO_PASSWORD=your_mongodb_password
   MONGO_DB=your_database_name
   JWT_KEY=your_jwt_secret_key
   PORT=8000
   ```

### 4. Railway (Full Stack)

1. **Backend Service**:
   - Root directory: `/`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Frontend Service**:
   - Root directory: `/frontend`
   - Build command: `npm run build:prod`
   - Start command: `npm run serve`

## 🗄️ Database Setup

### MongoDB Atlas
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Add to environment variables

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

## 🔧 Environment Configuration

### Backend (.env)
```env
MONGO_USER=your_mongodb_user
MONGO_PASSWORD=your_mongodb_password
MONGO_DB=easyevent
JWT_KEY=your_super_secret_jwt_key_here
PORT=8000
NODE_ENV=production
```

### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com/graphql
REACT_APP_ENVIRONMENT=production
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure for production domains
3. **JWT Secret**: Use strong, unique keys
4. **Database**: Enable authentication and use strong passwords
5. **HTTPS**: Always use SSL in production

## 📊 Monitoring

### Error Tracking
- Sentry integration for error monitoring
- Custom error boundaries in React

### Analytics
- Google Analytics for user tracking
- Performance monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: |
        npm install
        cd frontend && npm install
        
    - name: Build frontend
      run: cd frontend && npm run build:prod
      
    - name: Deploy to hosting
      # Add your deployment steps here
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**: Use legacy OpenSSL provider
   ```bash
   NODE_OPTIONS="--openssl-legacy-provider" npm run build
   ```

2. **CORS Errors**: Update backend CORS settings
3. **Environment Variables**: Ensure all required vars are set
4. **Database Connection**: Check MongoDB connection string

### Performance Optimization

1. **Bundle Analysis**:
   ```bash
   npm install -g webpack-bundle-analyzer
   npx webpack-bundle-analyzer frontend/build/static/js/*.js
   ```

2. **Lighthouse Audit**: Run performance audits
3. **Image Optimization**: Compress and optimize images
4. **Code Splitting**: Implement React.lazy for route-based splitting

---

For support or questions, please refer to the main README.md or create an issue in the repository.