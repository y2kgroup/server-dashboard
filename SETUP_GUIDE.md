# Google SSO Setup Guide for Y2K Server Management Dashboard

This guide will help you set up Google Single Sign-On (SSO) for your Server Management Dashboard.

## Prerequisites

- Google Cloud Console account
- Supabase project access (admin-db.y2khost.com)
- Dashboard repository access

## Step 1: Set up Google OAuth App

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to: APIs & Services → Library
   - Search for "Google+ API" and enable it

3. **Configure OAuth Consent Screen**
   - Go to: APIs & Services → OAuth consent screen
   - Select "External" and click Create
   - Fill in:
     - App name: "Y2K Server Management Dashboard"
     - User support email: `david@y2kgroupit.com`
     - Developer contact: `david@y2kgroupit.com`
   - Add scopes: `openid`, `email`, `profile`

4. **Create OAuth Credentials**
   - Go to: APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Y2K Dashboard"
   - Authorized redirect URIs:
     ```
     https://admin.y2khost.com/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase Auth

1. **Access Supabase Studio**
   - Go to: https://admin-db.y2khost.com
   - Login with your admin credentials

2. **Enable Google Provider**
   - Navigate to: Authentication → Providers
   - Find "Google" and enable it
   - Paste your Google Client ID and Client Secret
   - Save the configuration

3. **Configure Redirect URLs**
   - Go to: Authentication → URL Configuration
   - Add redirect URLs:
     ```
     https://admin.y2khost.com/auth/callback
     http://localhost:3000/auth/callback
     ```

## Step 3: Deploy to Vercel

1. **Connect Repository to Vercel**
   - Go to: https://vercel.com/dashboard
   - Add new project → Import Git Repository
   - Select: `y2kgroup/server-dashboard`

2. **Configure Environment Variables**
   Add these in Vercel:
   ```
   REACT_APP_SUPABASE_URL=https://api.y2khost.com
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   REACT_APP_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Access at: https://admin.y2khost.com

## Step 4: Test Google SSO

1. **Visit Dashboard**
   - Go to: https://admin.y2khost.com
   - Click "Sign in with Google"

2. **First-Time Setup**
   - Select your Google account
   - Grant permissions
   - You'll be redirected back to the dashboard

3. **Configure Admin User**
   - First user needs admin role manually set:
     - Go to Supabase Studio → Authentication → Users
     - Find your user and edit metadata
     - Add `role: "admin"`

## Step 5: Manage Users

As an admin, you can:

1. **View All Users**
   - Navigate to User Management tab
   - See all users who signed up via Google SSO

2. **Update User Roles**
   - Use the role dropdown next to each user
   - Set users as "admin" or "user"

3. **Admin Capabilities**
   - Admins can access User Management
   - Regular users only see Dashboard and Chat

## Troubleshooting

**Issue: Google Sign-In button doesn't work**
- Check Google Cloud Console redirect URLs
- Verify Supabase Google provider is enabled
- Check browser console for errors

**Issue: User Management shows "Admin permissions not configured"**
- Ensure REACT_APP_SUPABASE_SERVICE_KEY is set correctly
- Verify service role key has admin privileges
- Check Supabase API is accessible

**Issue: Users can't access after sign-in**
- Check email verification settings in Supabase
- Verify redirect URL configuration
- Check user metadata for role assignment

## Security Notes

- **Never** commit service role keys to git
- **Always** use environment variables for sensitive data
- **Regularly** rotate OAuth credentials
- **Monitor** user activity in Supabase logs

## Support

For issues or questions:
- Email: david@y2kgroupit.com
- Documentation: https://supabase.com/docs/guides/auth/social-login/auth-google