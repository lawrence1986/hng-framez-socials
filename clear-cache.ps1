# Clear Cache Script for Framez App
# Run this script to clear all caches and restart Metro

Write-Host "Clearing Framez app cache..." -ForegroundColor Green

# Navigate to project directory
Set-Location "C:\Projects\STAGE 4 FE"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Clear Expo cache
Write-Host "Clearing Expo cache..." -ForegroundColor Cyan
npx expo start --clear

Write-Host "`nCache cleared! Reload your app in Expo Go." -ForegroundColor Green
Write-Host "Shake your device and tap 'Reload' to see the changes." -ForegroundColor Yellow

