import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { supabase } from '@config/supabase';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Ionicons } from '@expo/vector-icons';

const FeedScreen = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch posts from Supabase
   */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
  .from('posts')
  .select(`
    id,
    content,
    image_url,
    created_at,
    user_id,
    profiles (
      full_name,
      avatar_url
    )
  `)
  .order('created_at', { ascending: false });


      if (error) throw error;

      setPosts(data || []);
    } catch (error: any) {
      console.error('❌ Error fetching posts:', error.message);
      Alert.alert('Error', 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  /**
   * ✅ Delete Post Logic
   */
  const handleDelete = async (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('posts').delete().eq('id', postId);
            if (error) throw error;

            // Update local state
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            Alert.alert('Deleted', 'Post has been removed.');
          } catch (error: any) {
            console.error('❌ Error deleting post:', error.message);
            Alert.alert('Error', error.message || 'Failed to delete post.');
          }
        },
      },
    ]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0095f6" style={{ marginTop: 32 }} />
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No posts yet. Start by creating one!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              currentUserId={user?.id}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0095f6" />
          }
          contentContainerStyle={{ padding: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 12,
    color: '#888',
    fontSize: 16,
  },
});

export default FeedScreen;
