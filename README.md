# Framez - Mobile Social Application

Framez is a modern mobile social application built with React Native and Expo, allowing users to share posts with text and images. The app features user authentication, a real-time feed, and user profiles.

## Features

- 🔐 **Authentication**: Secure sign-up, login, and logout with persistent sessions
- 📝 **Posts**: Create and share posts with text and/or images
- 🏠 **Feed**: View all posts from all users in chronological order
- 👤 **Profile**: View your profile with all your posts
- 🎨 **Instagram-inspired UI**: Clean and modern designs
- ⚡ **Real-time Updates**: Posts update in real-time using Supabase subscriptions

## Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase (Authentication, Database, Storage)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Context API
- **Image Picker**: Expo Image Picker
- **Secure Storage**: Expo Secure Store

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)
- A [Supabase](https://supabase.com/) account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd framez
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to **Settings** → **API** and copy your:
   - Project URL
   - Anon/public key

### 4. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create posts table
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for posts
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for posts
INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);

-- Create storage policies
CREATE POLICY "Anyone can view posts images" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Authenticated users can upload posts images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own posts images" ON storage.objects FOR UPDATE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own posts images" ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `posts`
3. Make it public (for image access)

### 6. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Replace the placeholder values in `config/supabase.js` if you prefer not to use environment variables.

### 7. Start the Development Server

```bash
npm start
```

### 8. Run on Your Device

- **iOS**: Press `i` in the terminal or scan the QR code with your iPhone camera
- **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app

## Project Structure

```
framez/
├── assets/              # Images and icons (replace placeholders)
├── components/          # Reusable components
│   └── PostCard.js     # Post card component
├── config/             # Configuration files
│   └── supabase.js     # Supabase client configuration
├── context/            # Context providers
│   └── AuthContext.js  # Authentication context
├── navigation/         # Navigation configuration
│   ├── AuthNavigator.js
│   └── MainNavigator.js
├── screens/           # Screen components
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── FeedScreen.js
│   ├── CreatePostScreen.js
│   └── ProfileScreen.js
├── App.js             # Main app component
├── app.json           # Expo configuration
├── package.json       # Dependencies
├── supabase-setup.sql # Database setup script
├── README.md          # This file
├── SETUP.md           # Detailed setup instructions
├── QUICKSTART.md      # Quick start guide
└── DEPLOYMENT.md      # Deployment guide
```

## Documentation

- **[README.md](README.md)** - Overview and features
- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for production
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Troubleshooting guide
- **[FIX_METRO.md](FIX_METRO.md)** - Fix Metro connection issues
- **[FIX_RELATIONSHIP_ERROR.md](FIX_RELATIONSHIP_ERROR.md)** - Fix relationship error
- **[FIX_IMAGE_UPLOAD.md](FIX_IMAGE_UPLOAD.md)** - Fix image upload issues
- **[VERIFY_STORAGE_SETUP.md](VERIFY_STORAGE_SETUP.md)** - Verify storage setup
- **[supabase-setup.sql](supabase-setup.sql)** - Database setup script

## Key Features Implementation

### Authentication
- Uses Supabase Auth for secure authentication
- Sessions persist using Expo Secure Store
- Automatic session restoration on app restart

### Posts
- Create posts with text and/or images
- Images are uploaded to Supabase Storage
- Posts display author name and timestamp
- Real-time updates using Supabase subscriptions

### Feed
- Chronological display of all posts
- Pull-to-refresh functionality
- Real-time updates when new posts are created

### Profile
- Display user information (name, email, avatar)
- Show all posts created by the user
- Logout functionality

## Deployment

### Testing on Appetize.io

1. Build the app for web or create an APK/IPA
2. Upload to [Appetize.io](https://appetize.io/)
3. Share the public link

### Building for Production

```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

## Troubleshooting

**📖 See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions to common issues.**

### Quick Fixes

1. **Metro Connection Issues:**
   ```bash
   npm start -- --clear
   # or
   npx expo start -c
   ```
   See [FIX_METRO.md](FIX_METRO.md) for more solutions.

2. **Image Upload Errors:**
   - See [FIX_IMAGE_UPLOAD.md](FIX_IMAGE_UPLOAD.md) for detailed solutions
   - See [VERIFY_STORAGE_SETUP.md](VERIFY_STORAGE_SETUP.md) to verify setup
   - Verify storage bucket `posts` exists and is public
   - Check storage policies in Supabase dashboard
   - Run `supabase-setup.sql` to ensure policies are set
   - Ensure internet connection is stable
   - Check console logs for detailed error messages

3. **Common Issues:**
   - **Supabase connection errors**: Verify your environment variables are set correctly
   - **Image upload fails**: Check that the storage bucket is created and policies are set
   - **Authentication not working**: Ensure RLS policies are correctly configured
   - **Real-time updates not working**: Check that Supabase subscriptions are enabled

## Future Enhancements

- [ ] Like and comment functionality
- [ ] User search and follow system
- [ ] Push notifications
- [ ] Edit and delete posts
- [ ] User avatars and profile customization
- [ ] Hashtags and mentions
- [ ] Stories feature

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built as part of a mobile development project demonstrating React Native skills.

## Important Notes

### Assets
The app includes placeholder assets that should be replaced:
- `assets/icon.png` - App icon (1024x1024 recommended)
- `assets/splash.png` - Splash screen
- `assets/adaptive-icon.png` - Adaptive icon for Android
- `assets/favicon.png` - Web favicon

### Environment Variables
Make sure to set your Supabase credentials in `.env` file or directly in `config/supabase.js`.

### Database Setup
Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor before using the app.

## Support

For issues and questions, please open an issue in the GitHub repository.

