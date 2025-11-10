# Verify Storage Setup - Quick Checklist

## ✅ Step 1: Check Storage Bucket Exists

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Storage** in the left sidebar
4. Look for a bucket named **`posts`**
5. If it doesn't exist, create it:
   - Click **"New bucket"**
   - Name: `posts`
   - Toggle **"Public bucket"** to **ON** ✅
   - Click **"Create bucket"**

## ✅ Step 2: Verify Bucket is Public

1. Go to Storage → `posts` bucket
2. Check the bucket settings
3. Make sure **"Public bucket"** is **enabled** ✅
4. If not, click the bucket → Settings → Enable "Public bucket"

## ✅ Step 3: Check Storage Policies

1. Go to Storage → Policies
2. Filter by bucket: `posts`
3. Verify these policies exist:

### Policy 1: View Images (SELECT)
- **Name**: "Anyone can view posts images" (or similar)
- **Operation**: SELECT
- **Condition**: `bucket_id = 'posts'`

### Policy 2: Upload Images (INSERT)
- **Name**: "Authenticated users can upload posts images" (or similar)
- **Operation**: INSERT
- **Condition**: `bucket_id = 'posts' AND auth.role() = 'authenticated'`

### If Policies Don't Exist:

Run this in Supabase SQL Editor:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view posts images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload posts images" ON storage.objects;

-- Create storage policies
CREATE POLICY "Anyone can view posts images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload posts images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

Or run the entire `supabase-setup.sql` script.

## ✅ Step 4: Test Manual Upload

1. Go to Storage → `posts` bucket
2. Click **"Upload file"**
3. Select a small image
4. Upload it
5. If upload succeeds, storage is configured correctly ✅
6. If upload fails, check your policies

## ✅ Step 5: Verify Authentication

1. Make sure you're logged into the app
2. Check that your user session is valid
3. Try logging out and back in
4. Verify user ID exists in profiles table

## ✅ Step 6: Check Supabase Credentials

1. Verify `EXPO_PUBLIC_SUPABASE_URL` is correct
2. Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Check `.env` file exists and has correct values
4. Or check `config/supabase.js` has correct values

## ✅ Step 7: Test in App

1. Clear app cache: `npx expo start --clear`
2. Reload the app
3. Go to Create Post
4. Select an image
5. Try to upload
6. Check console for detailed error messages

## Common Issues

### Issue: "Bucket not found"
- **Fix**: Create the `posts` bucket in Storage

### Issue: "Permission denied"
- **Fix**: Create storage policies (see Step 3)

### Issue: "Bucket is private"
- **Fix**: Set bucket to Public (see Step 2)

### Issue: "Authentication error"
- **Fix**: Log out and log back in

### Issue: "Network error"
- **Fix**: Check internet connection and Supabase URL

## Quick Fix Command

If you need to set up everything from scratch, run this in Supabase SQL Editor:

```sql
-- Create bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policies
CREATE POLICY IF NOT EXISTS "Anyone can view posts images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload posts images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

## Still Having Issues?

1. Check `FIX_IMAGE_UPLOAD.md` for detailed troubleshooting
2. Check console logs for specific errors
3. Verify all steps above are completed
4. Test with a very small image first

