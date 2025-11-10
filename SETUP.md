# Framez Setup Guide

This guide will walk you through setting up the Framez mobile application from scratch.

## Step 1: Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `framez` (or any name you prefer)
   - Database Password: (choose a strong password)
   - Region: (choose the closest region to you)
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

### 3.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 3.3 Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify that all tables and policies were created successfully

### 3.4 Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it `posts`
4. Make it **Public** (toggle the public switch)
5. Click "Create bucket"

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of the project
2. Add the following content:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` with your Supabase Project URL
4. Replace `your_anon_key_here` with your Supabase anon key

**Note**: If you prefer not to use environment variables, you can directly edit `config/supabase.js` and replace the placeholder values.

## Step 5: Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code in your terminal.

## Step 6: Run on Your Device

### For iOS:
1. Open the Camera app on your iPhone
2. Scan the QR code from the terminal
3. Tap the notification to open in Expo Go

### For Android:
1. Open the Expo Go app on your Android device
2. Tap "Scan QR code"
3. Scan the QR code from the terminal

### Alternative: Using Simulator/Emulator

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

## Step 7: Test the Application

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Log in with your credentials
3. **Create Post**: Add a post with text and/or an image
4. **View Feed**: See all posts from all users
5. **View Profile**: Check your profile and your posts
6. **Logout**: Test the logout functionality

## Troubleshooting

### Issue: "Cannot connect to Supabase"
- **Solution**: Verify your environment variables are set correctly
- Check that your Supabase project is active
- Ensure your internet connection is working

### Issue: "Image upload fails"
- **Solution**: 
  - Verify the storage bucket `posts` is created
  - Check that the bucket is set to public
  - Verify storage policies are correctly set up

### Issue: "Authentication not working"
- **Solution**:
  - Check that RLS (Row Level Security) policies are enabled
  - Verify the database trigger for profile creation is set up
  - Check Supabase Auth settings

### Issue: "Real-time updates not working"
- **Solution**:
  - Verify Supabase Realtime is enabled in your project settings
  - Check that you're subscribed to the correct channels

### Issue: "App crashes on startup"
- **Solution**:
  - Clear Expo cache: `expo start -c`
  - Reinstall node_modules: `rm -rf node_modules && npm install`
  - Check that all dependencies are installed correctly

## Next Steps

- Customize the app design and colors
- Add more features (likes, comments, etc.)
- Deploy to App Store or Google Play
- Set up push notifications
- Add user search and follow functionality

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)

## Support

If you encounter any issues, please:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Check Supabase logs in your dashboard
4. Open an issue in the GitHub repository

