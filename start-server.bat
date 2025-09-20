@echo off
echo.
echo ========================================
echo  Free TV Sri Lanka - Local Server
echo  Cloudnextra Solutions
echo ========================================
echo.

echo Starting local development server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python detected. Starting HTTP server on port 8000...
    echo.
    echo Website will be available at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js detected. Installing http-server...
    npm install -g http-server
    echo.
    echo Starting HTTP server on port 8000...
    echo.
    echo Website will be available at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    http-server -p 8000
    goto :end
)

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo PHP detected. Starting PHP development server on port 8000...
    echo.
    echo Website will be available at: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    php -S localhost:8000
    goto :end
)

echo No suitable server found (Python, Node.js, or PHP required)
echo.
echo Please install one of the following:
echo - Python 3.x (recommended)
echo - Node.js
echo - PHP
echo.
echo Then run this script again.
echo.
pause

:end