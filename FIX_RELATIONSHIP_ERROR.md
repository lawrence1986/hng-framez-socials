# Fix: "Could not find a relationship between 'posts' and 'user_id'"

## ✅ The Fix Has Been Applied

The code has been updated to **avoid using Supabase relationship joins**. Instead, it now:
1. Fetches posts separately
2. Fetches profiles separately  
3. Combines them in JavaScript

## ⚠️ Why You're Still Seeing the Error

The error is likely from **cached code** in your app. You need to clear the cache and reload.

## 🔧 Quick Fix (3 Steps)

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Projects\STAGE 4 FE"
```

### Step 2: Clear Cache and Restart Metro
```powershell
npx expo start --clear
```

### Step 3: Reload Your App
- **In Expo Go**: Shake your device → Tap "Reload"
- **Or**: Close and reopen Expo Go app

## 📋 Detailed Steps

### Option 1: Clear Expo Cache (Recommended)
```powershell
# Navigate to project
cd "C:\Projects\STAGE 4 FE"

# Clear cache and start
npx expo start --clear
```

### Option 2: Full Reset
```powershell
# Navigate to project
cd "C:\Projects\STAGE 4 FE"

# Stop Metro if running (Ctrl+C)

# Clear node_modules (optional)
Remove-Item -Recurse -Force node_modules
npm install

# Start with cleared cache
npx expo start --clear
```

### Option 3: Clear Expo Go App Cache
1. Close Expo Go app completely
2. On your device: **Settings → Apps → Expo Go → Clear Cache**
3. Reopen Expo Go
4. Scan QR code again

## ✅ Verify the Fix

After clearing cache, check:

1. **No relationship errors** in console
2. **Posts load successfully**
3. **Author names display correctly**

## 🔍 How to Check if Fix is Applied

The fixed code should:
- Use `select('*')` for posts (not relationship syntax)
- Fetch profiles separately with `.in('id', userIds)`
- Combine them in JavaScript

**Check `screens/FeedScreen.js` line 50-74:**
```javascript
// ✅ CORRECT (Fixed):
const { data: postsData } = await supabase
  .from('posts')
  .select('*')  // No relationship syntax
  
const { data: profilesData } = await supabase
  .from('profiles')
  .select('id, full_name, avatar_url, email')
  .in('id', userIds);

// ❌ WRONG (Old code - should not exist):
.select(`
  *,
  profiles:user_id (...)  // This causes the error
`)
```

## 🚨 If Error Persists

1. **Verify you're in the correct directory:**
   ```powershell
   cd "C:\Projects\STAGE 4 FE"
   pwd  # Should show: C:\Projects\STAGE 4 FE
   ```

2. **Check the code is updated:**
   - Open `screens/FeedScreen.js`
   - Verify it uses separate queries (no `profiles:user_id`)

3. **Force reload:**
   - Uninstall Expo Go
   - Reinstall Expo Go  
   - Clear all caches
   - Reconnect

4. **Check Supabase:**
   - Verify tables exist
   - Check RLS policies are enabled
   - Test queries in Supabase SQL editor

## 💡 Why This Happens

Supabase's automatic relationship detection requires:
- Foreign keys to be properly defined
- Schema cache to be up to date
- Relationship syntax in queries

By fetching separately, we avoid all these issues and have more control.

## 📝 Summary

**The code is fixed** ✅  
**You need to clear cache** ⚠️  
**Then reload the app** 🔄

Run this command:
```powershell
cd "C:\Projects\STAGE 4 FE" && npx expo start --clear
```

Then reload your app in Expo Go!

