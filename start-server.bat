@echo off
echo.
echo ==========================================
echo   Free TV - Local Development Server
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo 💡 Please install Python from https://python.org
    echo    or open index.html directly in your browser
    pause
    exit /b 1
)

echo ✅ Python found! Starting server...
echo.

REM Start the Python server
python serve.py

pause