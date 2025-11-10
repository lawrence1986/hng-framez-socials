# Fix Metro Connection Issues

## Quick Fixes

### 1. Clear Metro Cache
```bash
npm start -- --clear
```

Or:
```bash
npx expo start -c
```

### 2. Reset Everything
```bash
# Clear Metro cache
npm start -- --clear

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start -c
```

### 3. Check Port 8081
Metro uses port 8081. If it's in use:

**Windows:**
```bash
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8081 | xargs kill
```

### 4. Restart Metro
```bash
# Stop Metro (Ctrl+C)
# Then restart
npm start
```

### 5. Check Node Version
Ensure you're using Node.js v16 or higher:
```bash
node --version
```

### 6. Update Dependencies
```bash
npm install
npx expo install --fix
```

### 7. Reset Expo
```bash
npx expo start --clear --reset-cache
```

## Still Not Working?

1. **Close all terminals** and restart
2. **Restart your computer**
3. **Check firewall** settings
4. **Verify internet connection**
5. **Try a different network**

## Common Errors

### "Cannot connect to Metro"
- Clear cache: `npm start -- --clear`
- Check port 8081 is available
- Restart Metro bundler

### "Metro bundler failed to start"
- Check Node.js version (v16+)
- Reinstall dependencies
- Clear all caches

### "Network request failed"
- Check internet connection
- Verify Supabase credentials
- Check firewall settings

