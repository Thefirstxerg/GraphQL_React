# Netlify Deployment Instructions

## Environment Variables

Make sure to set the following environment variables in your Netlify site settings:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment variables
3. Add these variables:

```
REACT_APP_API_URL=https://graphql-react-backend.onrender.com/graphql
REACT_APP_ENVIRONMENT=production
```

## Build Settings

Ensure your build settings are configured correctly:

- Build command: `npm run build` or `yarn build`
- Publish directory: `build`

## Redirects

The `_redirects` file should be set up to handle React Router. Make sure it contains:

```
/*    /index.html   200
```

## Troubleshooting

If your site continues to have API connection issues:

1. Verify that environment variables are correctly set in Netlify
2. Try rebuilding the site with a cleared cache (in Netlify dashboard: Deploys > Trigger deploy > Clear cache and deploy site)
3. Check that your backend on Render is up and running
4. Ensure CORS is properly configured on your backend to allow requests from your Netlify domain
