# Google OAuth Setup Guide for LearnLoop

This guide will help you set up Google OAuth authentication for your LearnLoop application.

## Prerequisites

- A Google Cloud Platform account
- Access to Google Cloud Console
- Your LearnLoop application running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Services API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "LearnLoop"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email) if in testing mode

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the following:
   - Name: "LearnLoop Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001`
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `http://localhost:3000`
5. Click "Create"
6. **Save the Client ID and Client Secret** - you'll need these for configuration

## Step 4: Configure Environment Variables

### Backend Configuration

1. Copy `backend/env.example` to `backend/.env`
2. Add your Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
```

### Frontend Configuration

1. Copy `frontend/env.local.example` to `frontend/.env.local`
2. Add your Google OAuth client ID:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

## Step 5: Install Dependencies

Make sure you have the Google Auth Library installed in your backend:

```bash
cd backend
npm install google-auth-library
```

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3000/login`
4. Click the "Continue with Google" button
5. Complete the Google OAuth flow

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Client ID not configured" error**
   - Verify your environment variables are set correctly
   - Restart your servers after changing environment variables

3. **"Google Identity Services not loading"**
   - Check browser console for JavaScript errors
   - Ensure the Google Identity Services script is loading

4. **"Token verification failed"**
   - Verify your Google Client ID is correct
   - Check that the Google+ API is enabled

### Debug Mode

To enable debug logging, add this to your backend `.env`:

```env
DEBUG=true
```

## Security Considerations

1. **Never commit your Client Secret to version control**
2. **Use environment variables for all sensitive data**
3. **Implement proper CORS settings for production**
4. **Use HTTPS in production**
5. **Regularly rotate your Client Secret**

## Production Deployment

When deploying to production:

1. Update authorized origins in Google Cloud Console:
   - Add your production domain
   - Remove localhost URLs

2. Update environment variables:
   - Set `NODE_ENV=production`
   - Update `GOOGLE_REDIRECT_URI` to your production domain
   - Update `FRONTEND_URL` to your production domain

3. Ensure HTTPS is enabled on your production server

## API Endpoints

The following endpoints are now available:

- `POST /api/auth/google` - Handle Google OAuth token verification
- `GET /api/auth/google/url` - Get Google OAuth URL

## User Flow

1. User clicks "Continue with Google" button
2. Google Identity Services handles the OAuth flow
3. Google returns an ID token
4. Frontend sends token to backend
5. Backend verifies token with Google
6. Backend creates/updates user and returns JWT
7. User is logged in and redirected to dashboard

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure Google Cloud Console configuration is correct 