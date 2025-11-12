import * as FileSystem from 'expo-file-system/legacy'; // ✅ new import for SDK 52+
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
import { Buffer } from 'buffer';
import { supabase } from '@config/supabase';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * ✅ Universal image uploader for Supabase (Expo SDK 52+ compatible)
 * — Uses the new FileSystem "File" API
 */
/**
 * ✅ Universal image uploader for Supabase (Expo-compatible fallback)
 * — Uses expo-file-system/legacy for managed workflow stability
 */
const uploadImageAsync = async (uri: string, userId: string) => {
  try {
    if (!uri) return null;
    if (!userId) throw new Error('User not authenticated');

    const bucket = 'posts';
    const fileExt = uri.split('.').pop() || 'jpg';
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // ✅ Use legacy FileSystem readAsStringAsync for Expo Go compatibility
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const fileBuffer = Buffer.from(base64, 'base64');

    // ✅ Determine MIME type manually
    const contentType =
      uri.endsWith('.png') ? 'image/png' :
      uri.endsWith('.jpg') || uri.endsWith('.jpeg') ? 'image/jpeg' :
      'application/octet-stream';

    // ✅ Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    console.log('🌍 Image public URL:', data.publicUrl);
    return data.publicUrl;
  } catch (error: any) {
    console.error('❌ uploadImageAsync failed:', error.message);
    Alert.alert('Upload Error', error.message);
    return null;
  }
};


const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  /**
   * ✅ Pick image from gallery (mobile + web safe)
   */
  const pickImage = async () => {
    try {
      if (!ImagePicker?.launchImageLibraryAsync) {
        throw new Error('expo-image-picker module failed to load');
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('📸 Permission status:', status);

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? 1,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('📁 Picker result:', result);

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        console.log('✅ Image selected:', uri);
      } else {
        console.log('🚫 Image picker canceled.');
      }
    } catch (error: any) {
      console.error('❌ Error picking image:', error);
      Alert.alert('Error', 'Could not open image picker. Please try again.');
    }
  };

  /**
   * ✅ Create a new post
   */
  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert('Error', 'Please add some content or an image.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a post.');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;
      if (image) {
        console.log('🚀 Uploading image...');
        imageUrl = await uploadImageAsync(image, user.id);
      }

      const { error } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          content: content.trim() || null,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

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
    } catch (error: any) {
      console.error('❌ Error creating post:', error);
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
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#0095f6" />
          <Text style={styles.imageButtonText}>{image ? 'Change Image' : 'Add Image'}</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  contentContainer: { padding: 16 },
  inputContainer: { marginBottom: 16 },
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
  image: { width: '100%', height: 300, backgroundColor: '#f5f5f5' },
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
  postButtonDisabled: { opacity: 0.6 },
  postButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CreatePostScreen;
