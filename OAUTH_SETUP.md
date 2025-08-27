# OAuth Setup Instructions

To enable authentication in the Lil Tracker app, you need to configure OAuth providers. Currently, the app is set up to use Google OAuth.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # In production, use your actual domain
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

# Google OAuth (required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://your-domain.com/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env.local` file

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator, but make sure it's from a trusted source.

## Production Deployment

For production deployment (e.g., on Vercel):

1. Set `NEXTAUTH_URL` to your production domain (e.g., `https://your-app.vercel.app`)
2. Add your production domain to the OAuth provider's authorized redirect URIs
3. Set all environment variables in your hosting platform's dashboard

## Testing Authentication

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Click "Sign in with Google"
4. After successful authentication, you'll be redirected to the home page

## Troubleshooting

- **"Redirect URI mismatch" error**: Make sure the redirect URI in Google Console matches exactly (including http/https and trailing slashes)
- **Session not persisting**: Check that `NEXTAUTH_SECRET` is set and consistent
- **"Unauthorized" errors in API**: Make sure the middleware is properly configured and the session is being passed correctly

## Adding Additional Providers (Future)

To add more providers like Facebook, X (Twitter), or LinkedIn:

1. Install the provider's SDK if needed
2. Add the provider configuration in `lib/auth.ts`
3. Add the provider's environment variables
4. Update the login page to show the new provider button

Example for adding Facebook:

```typescript
// In lib/auth.ts
import FacebookProvider from 'next-auth/providers/facebook'

providers: [
  GoogleProvider({...}),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  })
]
```