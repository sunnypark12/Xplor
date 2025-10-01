#!/usr/bin/env python3
"""
Run the Xplor AI Travel Agent API server
"""
import os
import sys
import uvicorn
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from config.settings import settings

def main():
    """Main function to run the API server"""
    print("🚀 Starting Xplor AI Travel Agent API...")
    print(f"📊 OpenAI Model: {settings.OPENAI_MODEL}")
    print(f"🌐 Server: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 API Docs: http://{settings.API_HOST}:{settings.API_PORT}/docs")
    print("-" * 50)
    
    # Validate required settings
    try:
        settings.validate_settings()
        print("✅ Settings validated successfully")
    except ValueError as e:
        print(f"❌ Settings validation failed: {e}")
        print("Please check your environment variables or settings.py")
        return 1
    
    try:
        uvicorn.run(
            "api.endpoints:app",
            host=settings.API_HOST,
            port=settings.API_PORT,
            reload=settings.API_RELOAD,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
        return 0
    except Exception as e:
        print(f"❌ Server error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())

