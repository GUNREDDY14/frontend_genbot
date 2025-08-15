# Google Sign-In Implementation

This project now includes Google Sign-In functionality using Google's Identity Services library.

## Features

- **Google Sign-In Button**: Added to both signin and signup pages
- **Automatic Script Loading**: Google Identity Services script is loaded dynamically
- **Backend Integration**: Sends ID tokens to your FastAPI backend at `http://127.0.0.1:8000/auth/api/auth/google`
- **User Management**: Integrates with the existing AuthContext for user state management

## Configuration

The Google Sign-In is configured with your credentials:
- **Client ID**: `509838209146-4n5t374u95tjumcof4r6milatqro07is.apps.googleusercontent.com`
- **Project ID**: `genbotai-469112`
- **JavaScript Origins**: `http://localhost:3000`

## How It Works

### 1. Frontend Implementation

The Google Sign-In button is automatically rendered on both the signin and signup pages. The button:
- Uses Google's official styling and branding
- Handles the OAuth flow automatically
- Calls the `handleCredentialResponse` function when authentication is complete

### 2. Backend Integration

When a user signs in with Google:
1. Google returns an ID token
2. The frontend sends this token to your FastAPI backend
3. Your backend verifies the token and creates/updates the user
4. The frontend receives user data and updates the authentication state

### 3. API Endpoint

Your backend should implement this endpoint:
```
POST http://127.0.0.1:8000/auth/api/auth/google
Content-Type: application/json

{
  "id_token": "google_id_token_here"
}
```

## Files Modified

- `types/google-auth.ts` - Shared TypeScript interfaces for Google authentication
- `contexts/AuthContext.tsx` - Added `googleLogin` function
- `app/auth/signin/page.tsx` - Added Google Sign-In button and functionality
- `app/auth/signup/page.tsx` - Added Google Sign-In button and functionality

## Testing

1. Navigate to `/auth/signin` or `/auth/signup`
2. You'll see a Google Sign-In button above the email/password form
3. Click the button to test the Google authentication flow
4. The button will redirect to Google's OAuth consent screen
5. After successful authentication, the ID token will be sent to your backend

## Backend Requirements

Your FastAPI backend needs to:

1. **Verify the ID Token**: Use Google's libraries to verify the JWT token
2. **Extract User Information**: Parse the token payload for user details
3. **Create/Update User**: Store or update user information in your database
4. **Return User Data**: Send back user information for frontend state management

Example backend response:
```json
{
  "user_id": "unique_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "company_id": "company_id_here"
}
```

## Security Notes

- The client ID is public and safe to include in frontend code
- The ID token is a JWT that should be verified on the backend
- Never trust user data from the frontend without verification
- Implement proper session management and JWT handling on the backend

## Troubleshooting

If the Google Sign-In button doesn't appear:
1. Check the browser console for JavaScript errors
2. Verify the Google Identity Services script is loading
3. Ensure your domain is added to the JavaScript origins in Google Cloud Console
4. Check that the client ID is correct

## Next Steps

1. Implement the backend endpoint at `/auth/api/auth/google`
2. Test the complete authentication flow
3. Add error handling for various failure scenarios
4. Implement proper user session management
5. Add logout functionality for Google-authenticated users
