#!/usr/bin/env python3
"""
Simple test script to verify the Xplor setup
"""
import sys
import os

def test_frontend():
    """Test frontend setup"""
    print("🌐 Testing Frontend Setup...")
    
    # Check if package.json exists
    if os.path.exists('package.json'):
        print("✅ package.json found")
    else:
        print("❌ package.json not found")
        return False
    
    # Check if src directory exists
    if os.path.exists('src'):
        print("✅ src directory found")
    else:
        print("❌ src directory not found")
        return False
    
    # Check key files
    key_files = [
        'src/services/api.ts',
        'src/components/common/DateRangePicker.tsx',
        'src/pages/Itinerary.tsx',
        'src/pages/TripPlanning.tsx',
        'src/contexts/TravelContext.tsx'
    ]
    
    for file in key_files:
        if os.path.exists(file):
            print(f"✅ {file} found")
        else:
            print(f"❌ {file} not found")
            return False
    
    return True

def test_backend():
    """Test backend setup"""
    print("\n🤖 Testing Backend Setup...")
    
    # Check if ai directory exists
    if os.path.exists('ai'):
        print("✅ ai directory found")
    else:
        print("❌ ai directory not found")
        return False
    
    # Check key files
    key_files = [
        'ai/run_server.py',
        'ai/config/settings.py',
        'ai/api/endpoints.py',
        'ai/agents/travel_agent.py',
        'ai/models/recommendation_engine.py',
        'ai/requirements.txt'
    ]
    
    for file in key_files:
        if os.path.exists(file):
            print(f"✅ {file} found")
        else:
            print(f"❌ {file} not found")
            return False
    
    return True

def test_scripts():
    """Test startup scripts"""
    print("\n🚀 Testing Startup Scripts...")
    
    scripts = ['start-backend.sh', 'start-frontend.sh']
    
    for script in scripts:
        if os.path.exists(script):
            print(f"✅ {script} found")
            # Check if executable
            if os.access(script, os.X_OK):
                print(f"✅ {script} is executable")
            else:
                print(f"⚠️  {script} is not executable (run: chmod +x {script})")
        else:
            print(f"❌ {script} not found")
            return False
    
    return True

def main():
    """Main test function"""
    print("🧪 Xplor Setup Test")
    print("=" * 50)
    
    frontend_ok = test_frontend()
    backend_ok = test_backend()
    scripts_ok = test_scripts()
    
    print("\n📊 Test Results:")
    print("=" * 50)
    print(f"Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    print(f"Backend:  {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"Scripts:  {'✅ PASS' if scripts_ok else '❌ FAIL'}")
    
    if frontend_ok and backend_ok and scripts_ok:
        print("\n🎉 All tests passed! Your Xplor setup is ready.")
        print("\nNext steps:")
        print("1. Configure your API keys in ai/.env")
        print("2. Run ./start-backend.sh in one terminal")
        print("3. Run ./start-frontend.sh in another terminal")
        print("4. Open http://localhost:3000 in your browser")
        return True
    else:
        print("\n❌ Some tests failed. Please check the setup.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
