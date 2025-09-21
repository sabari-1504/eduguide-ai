@echo off
echo Building the project...
npm run build

echo.
echo Choose your hosting platform:
echo 1. Firebase Hosting (Recommended - you already have Firebase setup)
echo 2. Netlify (Drag and drop dist folder)
echo 3. GitHub Pages (Push to GitHub with workflow)
echo 4. Vercel (Manual deployment)

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Deploying to Firebase Hosting...
    firebase login
    firebase init hosting
    firebase deploy
) else if "%choice%"=="2" (
    echo.
    echo To deploy to Netlify:
    echo 1. Go to https://app.netlify.com/
    echo 2. Drag and drop the 'dist' folder
    echo 3. Your site will be live instantly!
) else if "%choice%"=="3" (
    echo.
    echo To deploy to GitHub Pages:
    echo 1. Push your code to GitHub
    echo 2. Enable GitHub Pages in repository settings
    echo 3. The workflow will automatically deploy
) else if "%choice%"=="4" (
    echo.
    echo To deploy to Vercel:
    echo 1. Go to https://vercel.com/
    echo 2. Import your GitHub repository
    echo 3. Deploy automatically
) else (
    echo Invalid choice!
)

pause 