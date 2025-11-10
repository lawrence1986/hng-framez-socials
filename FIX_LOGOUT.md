# Fix Logout Issues

## Problem
Logout is not working - user remains logged in after clicking logout.

## Causes
1. Storage not being cleared properly
2. Auth state change not triggering navigation update
3. Session persisting in storage

## Solution Applied

### 1. Enhanced signOut Function
- Added explicit state clearing (`setUser(null)`, `setSession(null)`)
- Added error handling with state clearing even on error
- Added logging for debugging

### 2. Improved Storage Clearing
- Enhanced `removeItem` in storage adapter
- Better error handling for storage operations
- Clears both SecureStore and AsyncStorage

### 3. Better Auth State Monitoring
- Added logging to auth state change listener
- Monitors all auth events (including SIGNED_OUT)

### 4. Improved Logout Handler
- Added try-catch for error handling
- Added logging for debugging
- Better error messages

## How It Works

1. User clicks logout button
2. Confirmation alert appears
3. User confirms logout
4. `signOut()` is called:
   - Calls `supabase.auth.signOut()`
   - Clears user and session state
   - Supabase triggers `onAuthStateChange` with `SIGNED_OUT` event
   - Listener updates state to null
   - App.js detects user is null
   - Navigation switches to Auth screen

## Testing

1. **Test Logout:**
   - Click logout button
   - Confirm logout
   - Should redirect to login screen
   - Should not be able to access protected screens

2. **Test Session Persistence:**
   - Logout
   - Close app
   - Reopen app
   - Should show login screen (not auto-login)

3. **Check Console Logs:**
   - Look for "Signing out..."
   - Look for "Auth state changed: SIGNED_OUT"
   - Look for "Signed out successfully"

## If Logout Still Doesn't Work

### Check 1: Verify Storage is Cleared
```javascript
// Check if storage is being cleared
// Look for console logs about storage operations
```

### Check 2: Verify Auth State Change
```javascript
// Check console for "Auth state changed" messages
// Should see "SIGNED_OUT" event
```

### Check 3: Force Clear Storage
If logout still doesn't work, you can manually clear storage:
```javascript
// In ProfileScreen, add this before signOut:
await AsyncStorage.clear();
await SecureStore.deleteItemAsync('supabase.auth.token');
```

### Check 4: Verify Navigation
Make sure App.js is properly reacting to user state changes:
- User becomes null
- Navigation should switch to Auth screen
- Check if RootNavigator is re-rendering

## Debugging

1. **Enable Logging:**
   - Check console for logout messages
   - Verify auth state changes
   - Check for errors

2. **Check Supabase:**
   - Verify session is cleared in Supabase
   - Check Supabase dashboard for active sessions

3. **Check Storage:**
   - Verify AsyncStorage is cleared
   - Verify SecureStore is cleared
   - Check for any remaining tokens

## Common Issues

### Issue: User stays logged in after logout
**Fix:** Clear storage manually and verify auth state listener is working

### Issue: Navigation doesn't update
**Fix:** Check if App.js is re-rendering when user state changes

### Issue: Session persists after app restart
**Fix:** Verify storage is being cleared on logout

## Expected Behavior

After logout:
1. User state becomes null
2. Session becomes null
3. Navigation switches to Auth screen
4. User cannot access protected screens
5. On app restart, user stays logged out

## Still Having Issues?

1. Check console logs for errors
2. Verify Supabase credentials are correct
3. Check if storage adapter is working
4. Test with a fresh app install
5. Clear all app data and try again

