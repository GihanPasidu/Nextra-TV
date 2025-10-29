@echo off
REM Simple HTTP Server for Nextra TV
REM This script uses Python to serve the website locally

echo.
echo ╔════════════════════════════════════════╗
echo ║       Nextra TV - Local Server         ║
echo ╚════════════════════════════════════════╝
echo.

python -m http.server 8000 --directory .

if %errorlevel% neq 0 (
    echo.
    echo Error: Python not found or not installed.
    echo.
    echo You can still use the website by:
    echo 1. Simply opening index.html in your browser, OR
    echo 2. Using any other local server (e.g., Live Server extension in VS Code)
    echo.
    pause
)
