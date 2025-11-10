# Fix Asset Not Found Error

## Error
```
Error: Asset not found: C:\Projects\STAGE 4 FE\assets\icon.png for platform: (unspecified)
```

## Cause
Metro bundler is using cached configuration that references asset files that no longer exist. The `app.json` has been updated to remove asset references, but Metro needs to clear its cache.

## Solution

### Quick Fix
1. **Stop Metro bundler** (Ctrl+C in terminal)
2. **Clear cache and restart:**
   ```powershell
   cd "C:\Projects\STAGE 4 FE"
   npx expo start --clear
   ```

### If That Doesn't Work

1. **Clear all caches:**
   ```powershell
   # Stop Metro first (Ctrl+C)
   npx expo start --clear --reset-cache
   ```

2. **Clear node_modules cache:**
   ```powershell
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   npx expo start --clear
   ```

3. **Full reset:**
   ```powershell
   # Stop Metro
   # Clear everything
   Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   npx expo start --clear
   ```

## Verification

After clearing cache, the error should be gone. The app will work without custom assets - Expo uses default icons during development.

## Current app.json Configuration

The `app.json` is correctly configured without asset references:
- No `icon` field
- No `splash.image` field  
- No `adaptiveIcon.foregroundImage` field
- No `web.favicon` field

Expo will use default assets during development.

## Adding Assets Later (Optional)

If you want to add custom assets later:

1. Create actual PNG image files:
   - `assets/icon.png` (1024x1024)
   - `assets/splash.png`
   - `assets/adaptive-icon.png` (1024x1024)
   - `assets/favicon.png`

2. Update `app.json`:
   ```json
   {
     "expo": {
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         ...
       },
       ...
     }
   }
   ```

3. Clear cache and restart:
   ```powershell
   npx expo start --clear
   ```

## For Now

The app works perfectly without custom assets. The error is just from cached configuration. Clear the cache and the error will disappear.

