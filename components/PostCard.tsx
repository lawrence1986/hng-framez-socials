import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Post = {
  id: string;
  title?: string;
  content?: string;
  image_url?: string | null;
  created_at?: string;
  user_id?: string;
  profiles?: { full_name?: string; avatar_url?: string } | null;
};

type Props = {
  post: Post;
  formatDate?: (d?: string) => string;
  currentUserId?: string | null;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
};

const PostCard: React.FC<Props> = ({ post, formatDate, currentUserId, onDelete, onLike }) => {
  const author = post.profiles || {};
  const authorName = author?.full_name || post.user_id?.slice(0, 8) || 'Unknown User';
  const authorAvatar = author?.avatar_url;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {authorAvatar ? (
          <Image source={{ uri: authorAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.dateText}>{formatDate ? formatDate(post.created_at) : post.created_at}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
        {post.image_url ? (
          <Image source={{ uri: post.image_url }} style={styles.postImage} />
        ) : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike && onLike(post.id)}>
          <Ionicons name="heart-outline" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete && onDelete(post.id)}>
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ddd',
  },
  authorName: {
    fontWeight: '700' as any,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  body: {
    padding: 12,
  },
  title: {
    fontWeight: '700' as any,
    marginBottom: 6,
  },
  content: {
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  actionButton: {
    marginRight: 16,
  },
});

export default PostCard;
