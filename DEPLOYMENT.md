# Framez Deployment Guide

This guide covers how to deploy the Framez app for testing and production.

## Testing on Appetize.io

### Prerequisites
- A built APK (Android) or IPA (iOS) file
- An Appetize.io account ([sign up here](https://appetize.io/signup))

### Steps

1. **Build the App**
   
   For Android (APK):
   ```bash
   expo build:android -t apk
   ```
   
   For iOS (IPA) - requires Apple Developer account:
   ```bash
   expo build:ios
   ```

2. **Upload to Appetize.io**
   - Go to [Appetize.io](https://appetize.io/)
   - Click "Upload" or "New App"
   - Upload your APK or IPA file
   - Wait for the upload to complete

3. **Configure**
   - Set a title: "Framez"
   - Add a description
   - Choose device type (iPhone or Android)
   - Set orientation (Portrait)

4. **Share**
   - Copy the public URL
   - Share with testers or include in your submission

## Building for Production

### Android

#### Using Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build AAB (for Play Store)**
   ```bash
   eas build --platform android --profile production
   ```

#### Using Expo CLI (Legacy)

```bash
expo build:android
```

### iOS

#### Using EAS

1. **Install EAS CLI** (if not already installed)
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build IPA**
   ```bash
   eas build --platform ios --profile production
   ```

**Note**: iOS builds require an Apple Developer account ($99/year).

## Environment Variables for Production

Make sure to set production environment variables:

1. Create a `.env.production` file
2. Add your production Supabase credentials
3. Update your build configuration to use production variables

## App Store Submission

### Google Play Store

1. **Prepare Assets**
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (at least 2)
   - Short description (80 characters)
   - Full description (4000 characters)

2. **Create Release**
   - Go to Google Play Console
   - Create new app
   - Upload AAB file
   - Fill in store listing
   - Submit for review

### Apple App Store

1. **Prepare Assets**
   - App icon (1024x1024)
   - Screenshots for different device sizes
   - App description
   - Keywords
   - Privacy policy URL

2. **Create App**
   - Go to App Store Connect
   - Create new app
   - Upload IPA file
   - Fill in app information
   - Submit for review

## Configuration Checklist

Before deploying, ensure:

- [ ] Supabase credentials are set correctly
- [ ] Environment variables are configured
- [ ] Database is set up and migrations are applied
- [ ] Storage buckets are created and configured
- [ ] RLS policies are properly set
- [ ] App icons and splash screens are added
- [ ] App name and bundle ID are correct
- [ ] Version number is updated
- [ ] All features are tested
- [ ] Error handling is in place
- [ ] Loading states are implemented

## Testing Checklist

Before submitting:

- [ ] Authentication works (sign up, login, logout)
- [ ] Posts can be created with text
- [ ] Posts can be created with images
- [ ] Feed displays all posts correctly
- [ ] Profile shows user information
- [ ] Profile shows user's posts
- [ ] Real-time updates work
- [ ] App works on both iOS and Android
- [ ] App handles errors gracefully
- [ ] App works offline (with appropriate messaging)

## Troubleshooting

### Build Fails

- Check that all dependencies are installed
- Verify environment variables are set
- Check Expo CLI is up to date
- Review build logs for specific errors

### App Crashes on Startup

- Verify Supabase credentials
- Check database connection
- Review error logs
- Test on simulator first

### Images Don't Load

- Verify storage bucket is public
- Check storage policies
- Verify image URLs are correct
- Check network connectivity

## Additional Resources

- [Expo Deployment Guide](https://docs.expo.dev/distribution/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console/)
- [App Store Connect](https://appstoreconnect.apple.com/)

