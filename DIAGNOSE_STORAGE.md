# Diagnose Storage Upload Issues

## Current Error
"Network request failed" when uploading images to Supabase Storage.

## Diagnostic Steps

### Step 1: Verify Storage Bucket Exists

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `atceofuytcveppcojsop`
3. Go to **Storage** → **Buckets**
4. Check if `posts` bucket exists
5. If not, create it:
   - Click "New bucket"
   - Name: `posts`
   - **Public bucket**: ON ✅
   - Click "Create bucket"

### Step 2: Verify Bucket is Public

1. Click on `posts` bucket
2. Go to **Settings**
3. Verify **"Public bucket"** is **enabled**
4. If not, enable it and save

### Step 3: Check Storage Policies

1. Go to **Storage** → **Policies**
2. Filter by bucket: `posts`
3. You should see these policies:

**Policy 1: SELECT (View)**
- Name: "Anyone can view posts images"
- Operation: SELECT
- Target roles: `public`
- USING expression: `bucket_id = 'posts'`

**Policy 2: INSERT (Upload)**
- Name: "Authenticated users can upload posts images"
- Operation: INSERT
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'posts' AND auth.role() = 'authenticated'`

### Step 4: Run Storage Setup SQL

If policies don't exist, run this in **SQL Editor**:

```sql
-- Create storage policies
DROP POLICY IF EXISTS "Anyone can view posts images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload posts images" ON storage.objects;

CREATE POLICY "Anyone can view posts images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload posts images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

### Step 5: Test Manual Upload

1. Go to **Storage** → `posts` bucket
2. Click **"Upload file"**
3. Select a small image
4. Upload it manually
5. If this fails, the issue is with Supabase setup
6. If this works, the issue is with the app code

### Step 6: Verify Authentication

1. In the app, make sure you're logged in
2. Check console for user ID
3. Verify the user ID matches your Supabase user
4. Try logging out and back in

### Step 7: Test Network Connectivity

1. Check if you can access Supabase dashboard
2. Test if your device has internet connection
3. Try on a different network (WiFi vs mobile data)
4. Check if firewall/VPN is blocking requests

### Step 8: Check Supabase Logs

1. Go to **Supabase Dashboard** → **Logs**
2. Filter by **Storage**
3. Look for errors when you try to upload
4. Check for authentication errors
5. Check for policy violations

## Common Issues and Fixes

### Issue 1: Bucket Doesn't Exist
**Error**: "Bucket not found" or 404
**Fix**: Create the `posts` bucket in Storage

### Issue 2: Bucket is Private
**Error**: "Permission denied" or 403
**Fix**: Set bucket to Public in bucket settings

### Issue 3: Missing Storage Policies
**Error**: "new row violates row-level security policy"
**Fix**: Create storage policies (see Step 4)

### Issue 4: Not Authenticated
**Error**: "JWT" or "token" errors
**Fix**: Log out and log back in

### Issue 5: Network Error
**Error**: "Network request failed"
**Possible causes**:
- Internet connection issue
- Supabase URL incorrect
- Firewall blocking requests
- Storage API endpoint unreachable

**Fixes**:
1. Check internet connection
2. Verify Supabase URL: `https://atceofuytcveppcojsop.supabase.co`
3. Test Supabase dashboard accessibility
4. Try on different network
5. Check firewall/VPN settings

### Issue 6: CORS Error (Web only)
**Error**: CORS policy error
**Fix**: Not applicable for React Native (mobile)

## Testing with App

The app now includes a storage connection test. When you try to upload an image, it will:
1. Test if storage is accessible
2. Check if bucket exists
3. Verify bucket is public
4. Check authentication
5. Provide specific error messages

## Quick Fix Checklist

- [ ] Storage bucket `posts` exists
- [ ] Bucket is set to Public
- [ ] Storage policies exist (SELECT and INSERT)
- [ ] User is logged in
- [ ] Internet connection is working
- [ ] Supabase URL is correct
- [ ] Can access Supabase dashboard
- [ ] Manual upload works in dashboard

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Check Supabase dashboard logs
3. **Test Connection**: Use the storage test function in the app
4. **Contact Support**: Supabase support or check documentation

## Next Steps

1. Verify storage bucket exists and is public
2. Create storage policies
3. Test manual upload in dashboard
4. Test upload in app
5. Check console for specific errors
6. Review Supabase logs

The app now provides better diagnostics. Check the console logs when uploading to see specific error messages.

