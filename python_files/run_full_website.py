#!/usr/bin/env python3
"""
Full Website Launcher for Blind Assistant
Starts both FastAPI backend and Next.js frontend
"""

import os
import sys
import subprocess
import time
import signal
import threading
from pathlib import Path

class BlindAssistantLauncher:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_dir = self.project_root / "backend"
        self.frontend_dir = self.project_root / "web_app"
        self.backend_process = None
        self.frontend_process = None
        self.running = False
        
    def print_header(self):
        """Print the startup header"""
        print("=" * 60)
        print("🌐 BLIND ASSISTANT - FULL WEBSITE LAUNCHER")
        print("=" * 60)
        print()
        print("🎯 Features:")
        print("• Voice Command Recognition")
        print("• Real-time Object Detection")
        print("• Navigation & Location Services")
        print("• Emergency Services")
        print("• Accessibility Features")
        print("• User Authentication")
        print()
        print("=" * 60)
        print()
        
    def check_dependencies(self):
        """Check if required dependencies are installed"""
        print("🔍 Checking dependencies...")
        
        # Check Python dependencies
        try:
            import fastapi
            import uvicorn
            import cv2
            import geopy
            import numpy
            print("✅ Python dependencies OK")
        except ImportError as e:
            print(f"❌ Missing Python dependency: {e}")
            print("Installing Python dependencies...")
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            
        # Check Node.js
        try:
            result = subprocess.run(["node", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Node.js {result.stdout.strip()}")
            else:
                print("❌ Node.js not found")
                return False
        except FileNotFoundError:
            print("❌ Node.js not installed")
            return False
            
        # Check npm dependencies
        if not (self.frontend_dir / "node_modules").exists():
            print("📦 Installing Node.js dependencies...")
            subprocess.run(["npm", "install"], cwd=self.frontend_dir)
            
        return True
        
    def start_backend(self):
        """Start the FastAPI backend"""
        print("📡 Starting FastAPI Backend...")
        try:
            self.backend_process = subprocess.Popen(
                [sys.executable, "main.py"],
                cwd=self.backend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            print("✅ Backend started successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            return False
            
    def start_frontend(self):
        """Start the Next.js frontend"""
        print("🌟 Starting Next.js Frontend...")
        try:
            self.frontend_process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.frontend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            print("✅ Frontend started successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return False
            
    def monitor_processes(self):
        """Monitor both processes"""
        backend_ready = False
        frontend_ready = False
        
        while self.running:
            # Check backend
            if self.backend_process and self.backend_process.poll() is not None:
                print("❌ Backend process stopped")
                break
                
            # Check frontend
            if self.frontend_process and self.frontend_process.poll() is not None:
                print("❌ Frontend process stopped")
                break
                
            # Check if services are ready
            if not backend_ready:
                try:
                    import requests
                    response = requests.get("http://localhost:8000/api/health", timeout=1)
                    if response.status_code == 200:
                        backend_ready = True
                        print("✅ Backend API ready at http://localhost:8000")
                except:
                    pass
                    
            if not frontend_ready:
                try:
                    import requests
                    response = requests.get("http://localhost:3000", timeout=1)
                    if response.status_code == 200:
                        frontend_ready = True
                        print("✅ Frontend ready at http://localhost:3000")
                except:
                    pass
                    
            if backend_ready and frontend_ready:
                self.print_running_info()
                break
                
            time.sleep(2)
            
    def print_running_info(self):
        """Print running service information"""
        print()
        print("=" * 60)
        print("🎉 BLIND ASSISTANT IS RUNNING!")
        print("=" * 60)
        print()
        print("📡 Backend API:      http://localhost:8000")
        print("📚 API Docs:         http://localhost:8000/docs")
        print("🌐 Frontend Web:     http://localhost:3000")
        print()
        print("=" * 60)
        print()
        print("🚀 Opening web application in your browser...")
        
        # Try to open the browser
        try:
            import webbrowser
            webbrowser.open("http://localhost:3000")
            print("✅ Browser opened successfully")
        except Exception as e:
            print(f"⚠️  Could not open browser: {e}")
            print("   Please manually visit: http://localhost:3000")
            
        print()
        print("⌨️  Press Ctrl+C to stop both servers")
        print()
        
    def stop_services(self):
        """Stop both services"""
        print("\n🛑 Stopping services...")
        self.running = False
        
        if self.backend_process:
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
                print("✅ Backend stopped")
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
                print("🔥 Backend force killed")
                
        if self.frontend_process:
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
                print("✅ Frontend stopped")
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
                print("🔥 Frontend force killed")
                
        print("👋 Thank you for using Blind Assistant!")
        
    def run(self):
        """Main run method"""
        self.print_header()
        
        # Check dependencies
        if not self.check_dependencies():
            print("❌ Dependency check failed")
            return
            
        # Start services
        self.running = True
        
        # Start backend
        if not self.start_backend():
            return
            
        # Wait a moment for backend to initialize
        time.sleep(3)
        
        # Start frontend
        if not self.start_frontend():
            self.stop_services()
            return
            
        # Monitor processes
        try:
            self.monitor_processes()
            
            # Keep running until interrupted
            while self.running:
                time.sleep(1)
                
        except KeyboardInterrupt:
            print("\n🛑 Received interrupt signal")
        finally:
            self.stop_services()

def main():
    """Main function"""
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\n🛑 Received shutdown signal")
        launcher.stop_services()
        sys.exit(0)
        
    signal.signal(signal.SIGINT, signal_handler)
    
    # Create and run launcher
    launcher = BlindAssistantLauncher()
    launcher.run()

if __name__ == "__main__":
    main()
