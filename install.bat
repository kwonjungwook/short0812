@echo off
echo ========================================
echo    Viral Content Finder Setup
echo ========================================
echo.

echo [1/3] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo X Node.js is not installed.
    echo Please download Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js OK

echo.
echo [2/3] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo X Package installation failed
    pause
    exit /b 1
)
echo Package installation completed

echo.
echo [3/3] Checking environment settings...
if exist .env.local (
    echo Environment file found
) else (
    echo Warning: .env.local file not found
    echo Please create it manually
)

echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo How to run:
echo   Development: npm run dev
echo   Build: npm run build
echo   Production: npm start
echo.
echo Open browser and go to http://localhost:3000
echo ========================================
pause
