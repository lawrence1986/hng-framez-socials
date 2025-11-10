# Troubleshooting Guide

## Common Issues and Solutions

### 1. Image Upload Error: StorageUnknownError

**Symptoms:**
- Error message: "StorageUnknownError: Network request failed"
- Images fail to upload

**Solutions:**

1. **Check Supabase Storage Configuration:**
   - Go to your Supabase dashboard → Storage
   - Verify that the `posts` bucket exists
   - Ensure the bucket is set to **Public**
   - Check that storage policies are correctly set (run `supabase-setup.sql`)

2. **Verify Storage Policies:**
   - Go to Storage → Policies
   - Ensure these policies exist for the `posts` bucket:
     - "Anyone can view posts images" (SELECT)
     - "Authenticated users can upload posts images" (INSERT)
     - "Users can update their own posts images" (UPDATE)
     - "Users can delete their own posts images" (DELETE)

3. **Check Network Connection:**
   - Ensure your device has internet connectivity
   - Try uploading from a different network
   - Check if Supabase is accessible from your network

4. **Verify Supabase Credentials:**
   - Check that `EXPO_PUBLIC_SUPABASE_URL` is correct
   - Check that `EXPO_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Verify credentials in `.env` file or `config/supabase.js`

5. **Check File Size:**
   - Large images may fail to upload
   - Try with a smaller image first
   - Consider implementing image compression

### 2. Foreign Key Relationship Error

**Symptoms:**
- Error: "Could not find a relationship between 'posts' and 'user_id'"
- Posts don't load in the feed

**Solution:**
- This has been fixed in the latest code update
- The app now fetches posts and profiles separately
- If you still see this error, clear the app cache and restart

### 3. SecureStore Warning: Value Too Large

**Symptoms:**
- Warning: "Value being stored in SecureStore is larger than 2048 bytes"

**Solution:**
- This has been fixed with AsyncStorage fallback
- The app now automatically uses AsyncStorage for large values
- No action needed - the app will handle this automatically

### 4. Cannot Connect to Metro

**Symptoms:**
- Metro bundler fails to start
- App won't load on device

**Solutions:**

1. **Clear Cache:**
   ```bash
   npm start -- --clear
   # or
   expo start -c
   ```

2. **Reset Metro Cache:**
   ```bash
   npx expo start --clear
   ```

3. **Check Node Version:**
   - Ensure you're using Node.js v16 or higher
   - Update Node.js if needed

4. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

5. **Check Port:**
   - Ensure port 8081 is not in use
   - Kill any processes using port 8081:
     ```bash
     # Windows
     netstat -ano | findstr :8081
     taskkill /PID <PID> /F
     
     # Mac/Linux
     lsof -ti:8081 | xargs kill
     ```

6. **Restart Metro:**
   ```bash
   npm start
   ```

### 5. Posts Not Loading

**Symptoms:**
- Feed is empty
- Posts don't appear

**Solutions:**

1. **Check Database:**
   - Verify posts table exists
   - Check RLS policies are enabled
   - Verify policies allow SELECT for all users

2. **Check Supabase Connection:**
   - Verify Supabase URL and key are correct
   - Test connection in Supabase dashboard

3. **Check Console Logs:**
   - Look for error messages in terminal
   - Check Expo Go app logs

### 6. Authentication Not Working

**Symptoms:**
- Can't sign up or login
- Session doesn't persist

**Solutions:**

1. **Check Supabase Auth:**
   - Verify Auth is enabled in Supabase
   - Check email confirmation settings
   - Verify RLS policies for profiles table

2. **Check Environment Variables:**
   - Verify Supabase credentials are set
   - Check `.env` file exists and is correct

3. **Clear App Data:**
   - Uninstall and reinstall Expo Go
   - Clear app cache

### 7. Profile Not Created on Sign Up

**Symptoms:**
- User signs up but profile doesn't exist
- Profile screen shows errors

**Solutions:**

1. **Check Database Trigger:**
   - Verify `handle_new_user()` function exists
   - Verify trigger `on_auth_user_created` is active
   - Re-run `supabase-setup.sql` if needed

2. **Check RLS Policies:**
   - Verify profiles table policies allow INSERT
   - Check that users can insert their own profile

### 8. Real-time Updates Not Working

**Symptoms:**
- New posts don't appear automatically
- Need to refresh manually

**Solutions:**

1. **Check Supabase Realtime:**
   - Verify Realtime is enabled in Supabase
   - Check Realtime settings in dashboard

2. **Check Database:**
   - Verify tables have Realtime enabled
   - Enable Realtime for posts table if needed

### 9. App Crashes on Startup

**Symptoms:**
- App crashes immediately
- White screen or error screen

**Solutions:**

1. **Check Dependencies:**
   ```bash
   npm install
   ```

2. **Check Expo Version:**
   ```bash
   expo --version
   npx expo install --fix
   ```

3. **Clear Cache:**
   ```bash
   npm start -- --clear
   ```

4. **Check Console:**
   - Look for error messages
   - Check for missing dependencies

### 10. Images Not Displaying

**Symptoms:**
- Images don't show in posts
- Broken image icons

**Solutions:**

1. **Check Image URLs:**
   - Verify images uploaded successfully
   - Check image URLs are correct

2. **Check Storage Policies:**
   - Verify storage bucket is public
   - Check SELECT policy allows viewing

3. **Check Network:**
   - Verify internet connection
   - Check if Supabase is accessible

## Getting Help

If you're still experiencing issues:

1. **Check Logs:**
   - Terminal logs (Metro bundler)
   - Expo Go app logs
   - Supabase dashboard logs

2. **Verify Setup:**
   - Run through SETUP.md again
   - Verify all steps completed

3. **Test Components:**
   - Test Supabase connection
   - Test authentication
   - Test storage upload

4. **Common Fixes:**
   - Clear cache and restart
   - Reinstall dependencies
   - Verify environment variables
   - Check Supabase configuration

## Debug Mode

To enable debug logging:

1. Check terminal for error messages
2. Use React Native Debugger
3. Check Supabase dashboard logs
4. Enable network logging in Expo

## Still Need Help?

- Check Supabase documentation
- Check Expo documentation
- Review error messages carefully
- Verify all configuration steps

