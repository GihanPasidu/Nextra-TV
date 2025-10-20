#!/usr/bin/env python3
"""
Simple HTTP server for testing Free TV locally
Run this script and then open http://localhost:8000 in your browser
"""

import http.server
import socketserver
import os
import webbrowser
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.realpath(__file__)), **kwargs)

def start_server():
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"✅ Free TV Server running at http://localhost:{PORT}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🚀 Opening browser...")
            print(f"❌ Press Ctrl+C to stop the server")
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
            except:
                print(f"💡 Please manually open: http://localhost:{PORT}")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped")
    except OSError as e:
        if e.errno == 10048:  # Port already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"💡 Try using a different port or close the other application")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    print("🎬 Free TV - Local Development Server")
    print("=" * 40)
    start_server()