#!/usr/bin/env python3
"""
Simple Website Launcher for Blind Assistant
Provides instructions and launches the batch file
"""

import subprocess
import sys
import os
import webbrowser
import time

def main():
    """Main launcher function"""
    print("=" * 60)
    print("🌐 BLIND ASSISTANT - WEBSITE LAUNCHER")
    print("=" * 60)
    print()
    print("🎯 Full-Featured Assistive Technology Platform")
    print()
    print("✨ Features:")
    print("• 🎤 Voice Command Recognition")
    print("• 👁️ Real-time Object Detection")
    print("• 🗺️ Navigation & Location Services") 
    print("• 🚨 Emergency Services")
    print("• ♿ Accessibility Features")
    print("• 🔐 User Authentication")
    print("• 📱 Cross-platform Support")
    print()
    print("=" * 60)
    print()
    
    # Show available launch options
    print("🚀 Launch Options:")
    print("1. 🌟 Launch Full Website (Recommended)")
    print("2. 📡 Launch Backend API Only")
    print("3. 🌐 Launch Frontend Only")
    print("4. 🔧 System Check")
    print("5. ❌ Exit")
    print()
    
    while True:
        choice = input("Enter your choice (1-5): ").strip()
        
        if choice == "1":
            launch_full_website()
            break
        elif choice == "2":
            launch_backend_only()
            break
        elif choice == "3":
            launch_frontend_only()
            break
        elif choice == "4":
            run_system_check()
            break
        elif choice == "5":
            print("👋 Thank you for using Blind Assistant!")
            sys.exit(0)
        else:
            print("❌ Invalid choice. Please enter 1-5.")

def launch_full_website():
    """Launch the full website using batch file"""
    print()
    print("🌟 Launching Full Website...")
    print("=" * 40)
    print()
    print("📋 What's happening:")
    print("• Starting FastAPI Backend Server (Port 8000)")
    print("• Starting Next.js Frontend Server (Port 3000)")
    print("• Opening browser automatically")
    print()
    print("🔗 URLs:")
    print("• Web App: http://localhost:3000")
    print("• API: http://localhost:8000")
    print("• API Docs: http://localhost:8000/docs")
    print()
    print("⚠️  Important:")
    print("• Allow microphone and camera permissions")
    print("• Two command windows will open")
    print("• Press Ctrl+C in each window to stop")
    print()
    
    input("Press Enter to continue...")
    
    # Launch using batch file
    batch_file = os.path.join(os.path.dirname(__file__), "start_website.bat")
    subprocess.Popen([batch_file], shell=True)
    
    # Wait and try to open browser
    print("🚀 Services are starting...")
    print("🌐 Opening web application in 10 seconds...")
    time.sleep(10)
    
    try:
        webbrowser.open("http://localhost:3000")
        print("✅ Browser opened successfully!")
    except Exception as e:
        print(f"⚠️  Could not open browser: {e}")
        print("   Please manually visit: http://localhost:3000")
    
    print()
    print("🎉 Blind Assistant is now running!")
    print("👋 You can close this window.")

def launch_backend_only():
    """Launch only the backend API"""
    print()
    print("📡 Launching Backend API...")
    print("=" * 30)
    print()
    print("🔗 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print()
    
    input("Press Enter to continue...")
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    subprocess.run([sys.executable, "main.py"], cwd=backend_dir)

def launch_frontend_only():
    """Launch only the frontend"""
    print()
    print("🌐 Launching Frontend...")
    print("=" * 25)
    print()
    print("🔗 Web App will be available at: http://localhost:3000")
    print("⚠️  Note: API features won't work without backend")
    print()
    
    input("Press Enter to continue...")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), "web_app")
    subprocess.run(["npm", "run", "dev"], cwd=frontend_dir, shell=True)

def run_system_check():
    """Run system check"""
    print()
    print("🔧 Running System Check...")
    print("=" * 30)
    print()
    
    check_script = os.path.join(os.path.dirname(__file__), "check.py")
    subprocess.run([sys.executable, check_script])
    
    print()
    input("Press Enter to return to main menu...")
    main()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
