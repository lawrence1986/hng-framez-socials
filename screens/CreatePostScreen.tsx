import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { testStorageConnection } from '../utils/testStorage';

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      console.log('Starting image upload...');
      console.log('Image URI:', uri);
      console.log('User ID:', user?.id);

      // Verify user is authenticated
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Test storage connection first
      console.log('Testing storage connection...');
      const connectionTest = await testStorageConnection();
      
      if (!connectionTest.success) {
        console.error('Storage connection test failed:', connectionTest);
        throw new Error(connectionTest.error || 'Storage connection failed. Please check your Supabase storage setup.');
      }
      
      console.log('Storage connection test passed!');

      // Get file extension from URI
      const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(`Uploading to path: ${filePath}`);

      // Read the image file - React Native compatible approach
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to read image file: ${response.status} ${response.statusText}`);
      }

      // Convert to blob
      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Failed to create image blob or image is empty');
      }

      console.log(`Image blob created: ${blob.size} bytes, type: ${blob.type}`);

      // Determine content type
      const contentType = blob.type || `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;
      console.log(`Content type: ${contentType}`);

      // Verify session before upload
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Session expired. Please log out and log back in.');
      }
      console.log('Session verified for user:', session.user.id);
      console.log('Access token exists:', !!session.access_token);

      // Upload to Supabase Storage
      console.log('Uploading to Supabase Storage...');
      console.log('Storage endpoint:', `${supabase.supabaseUrl}/storage/v1/object/posts/${filePath}`);
      
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(filePath, blob, {
          contentType: contentType,
          upsert: false,
        });

      if (error) {
        console.error('Supabase Storage Error:', error);
        console.error('Error code:', error.statusCode);
        console.error('Error message:', error.message);
        
        // Check for specific error types
        if (error.statusCode === '404' || error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
          throw new Error('Storage bucket "posts" not found!\n\nPlease:\n1. Go to Supabase Dashboard → Storage\n2. Create a bucket named "posts"\n3. Set it to Public\n4. Run the storage policies from supabase-setup.sql');
        }
        
        if (error.message?.includes('new row violates row-level security policy') || error.message?.includes('RLS') || error.statusCode === '42501') {
          throw new Error('Permission denied!\n\nPlease check:\n1. Storage policies are set correctly\n2. Run supabase-setup.sql in Supabase SQL Editor\n3. Ensure "Authenticated users can upload" policy exists');
        }
        
        if (error.message?.includes('JWT') || error.message?.includes('token') || error.statusCode === '401') {
          throw new Error('Authentication error!\n\nPlease:\n1. Log out and log back in\n2. Check your Supabase credentials');
        }
        
        if (error.message?.includes('duplicate') || error.statusCode === '409') {
          // Try with a different filename
          const newFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const newFilePath = `${user.id}/${newFileName}`;
          console.log('Retrying with new filename:', newFilePath);
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('posts')
            .upload(newFilePath, blob, {
              contentType: contentType,
              upsert: false,
            });
          
          if (retryError) {
            throw new Error(`Upload failed: ${retryError.message || 'Unknown error'}`);
          }
          
          const { data: urlData } = supabase.storage
            .from('posts')
            .getPublicUrl(newFilePath);
          
          return urlData.publicUrl;
        }
        
        throw new Error(`Upload failed: ${error.message || 'Unknown error (Code: ' + error.statusCode + ')'}`);
      }

      if (!data) {
        throw new Error('Upload failed: No data returned from Supabase');
      }

      console.log('Upload successful! Data:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Upload succeeded but failed to get public URL');
      }

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
      
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error));
      
      // Provide user-friendly error messages
      const errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch') || errorMessage.includes('Network request failed')) {
        throw new Error('Network error!\n\nPlease check:\n1. Your internet connection\n2. Supabase URL is correct in config\n3. You can access Supabase from your network');
      }
      
      // Re-throw with the error message (already formatted above)
      throw error;
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Error', 'Please add some content or an image to your post');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;

      if (image) {
        try {
          console.log('Uploading image...');
          imageUrl = await uploadImage(image);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          const errorMsg = uploadError.message || 'Failed to upload image. Please try again.';
          Alert.alert(
            'Upload Error', 
            errorMsg,
            [{ text: 'OK' }]
          );
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          content: content.trim() || null,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        console.error('Post creation error:', error);
        throw error;
      }

      Alert.alert('Success', 'Post created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setContent('');
            setImage(null);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#0095f6" />
          <Text style={styles.imageButtonText}>
            {image ? 'Change Image' : 'Add Image'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, uploading && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#0095f6',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  postButton: {
    backgroundColor: '#0095f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreatePostScreen;

