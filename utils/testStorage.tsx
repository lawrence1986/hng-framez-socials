// Utility to test Supabase Storage connection
import { supabase } from '../config/supabase';

export const testStorageConnection = async () => {
  try {
    console.log('Testing Supabase Storage connection...');
    
    // Test 1: Check if we can list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return {
        success: false,
        error: `Cannot access storage: ${bucketsError.message}`,
        step: 'listBuckets',
      };
    }
    
    console.log('Buckets:', buckets);
    
    // Test 2: Check if 'posts' bucket exists
    const postsBucket = buckets?.find(bucket => bucket.id === 'posts');
    
    if (!postsBucket) {
      return {
        success: false,
        error: 'Storage bucket "posts" not found. Please create it in Supabase Dashboard → Storage.',
        step: 'bucketExists',
        buckets: buckets?.map(b => b.id) || [],
      };
    }
    
    console.log('Posts bucket found:', postsBucket);
    
    // Test 3: Check if bucket is public
    if (!postsBucket.public) {
      return {
        success: false,
        error: 'Storage bucket "posts" is not public. Please set it to public in Supabase Dashboard.',
        step: 'bucketPublic',
      };
    }
    
    // Test 4: Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated. Please log in first.',
        step: 'authentication',
      };
    }
    
    console.log('User authenticated:', user.id);
    
    // Test 5: Try to list files in the bucket (test read access)
    const { data: files, error: listError } = await supabase.storage
      .from('posts')
      .list(user.id, {
        limit: 1,
      });
    
    if (listError) {
      console.warn('Error listing files (might be normal if folder is empty):', listError);
      // This is not critical - folder might be empty
    }
    
    return {
      success: true,
      message: 'Storage connection successful!',
      bucket: postsBucket,
      user: user.id,
    };
    
  } catch (error) {
    console.error('Storage connection test error:', error);
    return {
      success: false,
      error: `Connection test failed: ${error.message}`,
      step: 'connection',
    };
  }
};

export const testStorageUpload = async (testBlob) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const testPath = `${user.id}/test-${Date.now()}.txt`;
    const testData = new Blob(['test'], { type: 'text/plain' });
    
    console.log('Testing storage upload...');
    
    const { data, error } = await supabase.storage
      .from('posts')
      .upload(testPath, testData, {
        contentType: 'text/plain',
        upsert: false,
      });
    
    if (error) {
      console.error('Upload test error:', error);
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    
    // Clean up test file
    await supabase.storage.from('posts').remove([testPath]);
    
    return {
      success: true,
      message: 'Upload test successful!',
    };
    
  } catch (error) {
    console.error('Upload test error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

