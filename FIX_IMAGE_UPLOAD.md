# Fix Image Upload Issues

## Common Image Upload Problems

### 1. Storage Bucket Not Found

**Error:** "Bucket not found" or "404"

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name it: `posts`
4. Set it to **Public** (toggle switch)
5. Click "Create bucket"
6. Run the storage policies from `supabase-setup.sql`

### 2. Permission Denied (RLS Policy)

**Error:** "new row violates row-level security policy" or "Permission denied"

**Solution:**
1. Go to Supabase Dashboard → Storage → Policies
2. Make sure these policies exist for the `posts` bucket:
   - **SELECT**: "Anyone can view posts images" - `bucket_id = 'posts'`
   - **INSERT**: "Authenticated users can upload posts images" - `bucket_id = 'posts' AND auth.role() = 'authenticated'`
3. Or run the entire `supabase-setup.sql` script in SQL Editor

### 3. Network Error

**Error:** "Network request failed" or "Failed to fetch"

**Solutions:**
1. Check your internet connection
2. Verify Supabase URL is correct in `.env` or `config/supabase.js`
3. Test Supabase connection in browser
4. Check if firewall is blocking requests
5. Try on a different network

### 4. Authentication Error

**Error:** "JWT" or "token" errors

**Solutions:**
1. Log out and log back in
2. Check Supabase credentials are correct
3. Verify session is still valid
4. Clear app cache and restart

### 5. Image Too Large

**Error:** Upload times out or fails silently

**Solutions:**
1. Try a smaller image
2. The app compresses images to 80% quality
3. Consider reducing image size before upload
4. Check Supabase storage limits

## Step-by-Step Setup

### 1. Create Storage Bucket

1. Open Supabase Dashboard
2. Go to **Storage** in left sidebar
3. Click **"New bucket"**
4. Enter name: `posts`
5. Toggle **"Public bucket"** to ON
6. Click **"Create bucket"**

### 2. Set Up Storage Policies

Run this in Supabase SQL Editor:

```sql
-- Create storage policies
CREATE POLICY "Anyone can view posts images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload posts images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

Or run the entire `supabase-setup.sql` script.

### 3. Verify Setup

1. Go to Storage → `posts` bucket
2. Check it shows "Public"
3. Go to Storage → Policies
4. Verify policies exist for `posts` bucket

### 4. Test Upload

1. Open the app
2. Go to Create Post
3. Select an image
4. Try to upload
5. Check console logs for errors

## Debugging

### Check Console Logs

The app now logs detailed information:
- Image URI
- File path
- Blob size
- Upload progress
- Error details

### Verify Supabase Connection

1. Check `config/supabase.js` has correct URL and key
2. Test in browser: `https://your-project.supabase.co`
3. Check Supabase dashboard is accessible

### Test Storage Manually

1. Go to Supabase Dashboard → Storage
2. Try uploading a file manually to `posts` bucket
3. If manual upload works, the issue is in the app code
4. If manual upload fails, the issue is in Supabase setup

## Quick Fix Checklist

- [ ] Storage bucket `posts` exists
- [ ] Bucket is set to Public
- [ ] Storage policies are set
- [ ] User is logged in
- [ ] Internet connection is working
- [ ] Supabase URL and key are correct
- [ ] App has latest code (clear cache)

## Still Not Working?

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for storage errors

2. **Test with Smaller Image:**
   - Try a very small image first
   - If small works, issue is file size

3. **Verify Authentication:**
   - Check user is logged in
   - Verify session is valid
   - Try logging out and back in

4. **Check Network:**
   - Test on different network
   - Check if VPN is interfering
   - Verify firewall settings

5. **Review Error Messages:**
   - Check console for specific errors
   - The app now shows detailed error messages
   - Use error messages to identify the issue

## Need More Help?

1. Check `TROUBLESHOOTING.md` for general issues
2. Review Supabase Storage documentation
3. Check React Native file upload best practices
4. Verify all setup steps in `SETUP.md`

