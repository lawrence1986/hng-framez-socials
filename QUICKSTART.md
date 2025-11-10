# Framez Quick Start Guide

Get Framez up and running in 5 minutes!

## Prerequisites

- Node.js installed
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone
- Supabase account (free tier works)

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (5 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run `supabase-setup.sql`
4. Go to **Storage** and create bucket named `posts` (make it public)
5. Copy your Project URL and anon key from **Settings** → **API**

### 3. Configure Environment

Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### 4. Run the App
```bash
npm start
```

### 5. Open on Your Phone

- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app

## That's It! 🎉

You can now:
- Sign up for an account
- Create posts with text and images
- View the feed
- Check your profile

## Need Help?

See [SETUP.md](SETUP.md) for detailed instructions or [README.md](README.md) for full documentation.

