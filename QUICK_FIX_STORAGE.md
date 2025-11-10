# Quick Fix for Storage Upload "Network request failed"

## Immediate Action Required

The error "Network request failed" typically means one of these:

### 1. Storage Bucket Doesn't Exist ⚠️ MOST LIKELY

**Fix this first:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Storage** → **Buckets**
4. Check if `posts` bucket exists
5. If NOT, click **"New bucket"**:
   - Name: `posts`
   - **Public bucket**: ON ✅
   - Click **"Create bucket"**

### 2. Storage Policies Not Set

**Run this in Supabase SQL Editor:**

```sql
-- Create storage policies
CREATE POLICY IF NOT EXISTS "Anyone can view posts images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload posts images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

### 3. Bucket is Private

1. Go to **Storage** → `posts` bucket
2. Click **Settings**
3. Enable **"Public bucket"**
4. Save

## Test Steps

1. **Test in Supabase Dashboard:**
   - Go to Storage → `posts` bucket
   - Click "Upload file"
   - Upload a small image
   - If this fails, Supabase setup is wrong
   - If this works, the issue is in the app

2. **Check Console Logs:**
   - The app now tests storage connection before upload
   - Look for "Storage connection test failed" messages
   - Check what specific error it reports

3. **Verify Authentication:**
   - Make sure you're logged in
   - Check console for user ID
   - Try logging out and back in

## Most Common Issue

**The storage bucket `posts` doesn't exist!**

Create it now:
1. Supabase Dashboard → Storage
2. New bucket → Name: `posts` → Public: ON
3. Create bucket
4. Run storage policies SQL
5. Try upload again

## After Fixing

1. Clear app cache: `npx expo start --clear`
2. Reload app
3. Try uploading again
4. Check console for detailed error messages

The app now includes better diagnostics - it will tell you exactly what's wrong!

