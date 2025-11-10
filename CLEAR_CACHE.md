# Clear Cache and Fix Relationship Error

## The Error
"Could not find a relationship between 'posts' and 'user_id' in the schema cache"

## Solution
This error occurs when the app is using cached code. The fix has been applied, but you need to clear the cache.

## Steps to Fix

### 1. Stop the Metro Bundler
Press `Ctrl+C` in the terminal where Metro is running.

### 2. Clear Expo Cache
```bash
cd "C:\Projects\STAGE 4 FE"
npx expo start --clear
```

Or:
```bash
cd "C:\Projects\STAGE 4 FE"
npm start -- --clear
```

### 3. Clear Metro Cache
```bash
cd "C:\Projects\STAGE 4 FE"
npx react-native start --reset-cache
```

### 4. Clear Node Modules (if needed)
```bash
cd "C:\Projects\STAGE 4 FE"
rm -rf node_modules
npm install
```

### 5. Reload the App
- Shake your device (or press `Ctrl+M` in Android emulator)
- Select "Reload" from the menu
- Or close and reopen the Expo Go app

### 6. Hard Reload (if still not working)
- Close Expo Go app completely
- Clear Expo Go app cache (Settings → Apps → Expo Go → Clear Cache)
- Reopen Expo Go and scan QR code again

## Verify the Fix

The code has been updated to fetch posts and profiles separately, which avoids the relationship error. After clearing cache, you should see:

1. Posts load without errors
2. Author names display correctly
3. No relationship errors in console

## If Error Persists

1. **Check you're in the right directory:**
   ```bash
   cd "C:\Projects\STAGE 4 FE"
   ```

2. **Verify the code is updated:**
   - Check `screens/FeedScreen.js` - should use separate queries
   - Check `screens/ProfileScreen.js` - should use separate queries
   - No `profiles:user_id` syntax should exist

3. **Force reload:**
   - Uninstall Expo Go
   - Reinstall Expo Go
   - Scan QR code again

## Quick Fix Command

Run this from the project directory:
```bash
cd "C:\Projects\STAGE 4 FE" && npx expo start --clear
```

Then reload the app in Expo Go.

