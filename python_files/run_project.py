#!/usr/bin/env python3
"""
Blind Assistant Project Runner
This script helps you run different components of the Blind Assistant project.
"""

import os
import sys
import subprocess

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'kivy', 'cv2', 'speech_recognition', 'gtts', 'playsound',
        'geopy', 'openrouteservice', 'pyttsx3', 'numpy', 'folium'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'cv2':
                import cv2
            elif package == 'speech_recognition':
                import speech_recognition
            else:
                __import__(package)
            print(f"✓ {package} is installed")
        except ImportError:
            print(f"✗ {package} is missing")
            missing_packages.append(package)
    
    return missing_packages

def install_dependencies():
    """Install missing dependencies"""
    print("Installing dependencies...")
    try:
        # Get the parent directory path
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        requirements_path = os.path.join(parent_dir, "requirements.txt")
        
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_path])
        print("✓ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False

def run_component(component):
    """Run a specific component of the project"""
    components = {
        '1': ('Voice Command Test', 'voicecommand.py'),
        '2': ('Location Services', 'anylocation.py'),
        '3': ('Real-time Object Detection', 'realtimeobject.py'),
        '4': ('Main GUI Application', 'main.py'),
        '5': ('Camera Check', 'check.py'),
        '6': ('Simple Location Map', 'location.py'),
        '7': ('Get Coordinates', 'lattitude_longitude.py')
    }
    
    if component in components:
        name, script = components[component]
        print(f"\nRunning {name}...")
        try:
            # Run the script from the current directory
            script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script)
            subprocess.run([sys.executable, script_path])
        except KeyboardInterrupt:
            print(f"\n{name} stopped by user")
        except Exception as e:
            print(f"Error running {name}: {e}")
    else:
        print("Invalid component selection")

def main():
    print("=" * 50)
    print("BLIND ASSISTANT PROJECT")
    print("=" * 50)
    
    # Check if we're in the right directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if not os.path.exists(os.path.join(script_dir, 'main.py')):
        print("Error: Please run this script from the python_files directory")
        return
    
    # Check dependencies
    print("\nChecking dependencies...")
    missing = check_dependencies()
    
    if missing:
        print(f"\nMissing packages: {', '.join(missing)}")
        install = input("Would you like to install missing dependencies? (y/n): ")
        if install.lower() == 'y':
            if not install_dependencies():
                return
        else:
            print("Cannot run project without required dependencies")
            return
    
    # Show menu
    while True:
        print("\n" + "=" * 50)
        print("SELECT COMPONENT TO RUN:")
        print("=" * 50)
        print("1. Voice Command Test")
        print("2. Location Services (Voice to Coordinates)")
        print("3. Real-time Object Detection (Requires YOLO weights)")
        print("4. Main GUI Application (Full App)")
        print("5. Camera Check")
        print("6. Simple Location Map")
        print("7. Get Coordinates")
        print("0. Exit")
        print("=" * 50)
        
        choice = input("Enter your choice (0-7): ")
        
        if choice == '0':
            print("Goodbye!")
            break
        elif choice in ['1', '2', '3', '4', '5', '6', '7']:
            run_component(choice)
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()