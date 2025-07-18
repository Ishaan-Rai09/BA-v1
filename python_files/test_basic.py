#!/usr/bin/env python3
"""
Basic functionality test for Blind Assistant
Tests individual components without heavy dependencies
"""

import sys
import os

def test_imports():
    """Test basic imports"""
    print("Testing imports...")
    
    # Test basic Python libraries
    try:
        import os
        import sys
        import threading
        import time
        print("✅ Basic Python libraries OK")
    except Exception as e:
        print(f"❌ Basic Python libraries failed: {e}")
        return False
    
    # Test speech recognition
    try:
        import speech_recognition as sr
        print("✅ Speech recognition OK")
    except Exception as e:
        print(f"❌ Speech recognition failed: {e}")
        return False
    
    # Test TTS
    try:
        import pyttsx3
        print("✅ pyttsx3 TTS OK")
    except Exception as e:
        print(f"❌ pyttsx3 TTS failed: {e}")
        return False
    
    # Test OpenCV
    try:
        import cv2
        print("✅ OpenCV OK")
    except Exception as e:
        print(f"❌ OpenCV failed: {e}")
        return False
    
    # Test location services
    try:
        from geopy.geocoders import Nominatim
        print("✅ Geopy OK")
    except Exception as e:
        print(f"❌ Geopy failed: {e}")
        return False
    
    return True

def test_speech_synthesis():
    """Test speech synthesis"""
    print("\nTesting speech synthesis...")
    
    try:
        import pyttsx3
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 0.8)
        
        # Test speech
        print("🔊 Testing speech output...")
        engine.say("Speech synthesis test successful")
        engine.runAndWait()
        
        print("✅ Speech synthesis OK")
        return True
        
    except Exception as e:
        print(f"❌ Speech synthesis failed: {e}")
        return False

def test_camera():
    """Test camera access"""
    print("\nTesting camera access...")
    
    try:
        import cv2
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("❌ Camera not accessible")
            return False
        
        # Try to read a frame
        ret, frame = cap.read()
        if not ret:
            print("❌ Could not read frame from camera")
            cap.release()
            return False
        
        print(f"✅ Camera OK - Frame size: {frame.shape}")
        cap.release()
        return True
        
    except Exception as e:
        print(f"❌ Camera test failed: {e}")
        return False

def test_location_services():
    """Test location services"""
    print("\nTesting location services...")
    
    try:
        from geopy.geocoders import Nominatim
        geolocator = Nominatim(user_agent="blind_assistant_test")
        
        # Test geocoding
        location = geolocator.geocode("Delhi, India")
        if location:
            print(f"✅ Geocoding OK - Delhi: {location.latitude}, {location.longitude}")
            return True
        else:
            print("❌ Geocoding failed - no result")
            return False
            
    except Exception as e:
        print(f"❌ Location services failed: {e}")
        return False

def test_opencv_cascades():
    """Test OpenCV cascade classifiers"""
    print("\nTesting OpenCV cascades...")
    
    try:
        import cv2
        
        # Test face cascade
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        if face_cascade.empty():
            print("❌ Face cascade not loaded")
            return False
        
        # Test eye cascade
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        if eye_cascade.empty():
            print("❌ Eye cascade not loaded")
            return False
        
        print("✅ OpenCV cascades OK")
        return True
        
    except Exception as e:
        print(f"❌ OpenCV cascades failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("🔧 BLIND ASSISTANT - BASIC FUNCTIONALITY TEST")
    print("=" * 50)
    
    tests = [
        ("Imports", test_imports),
        ("Speech Synthesis", test_speech_synthesis),
        ("Camera Access", test_camera),
        ("Location Services", test_location_services),
        ("OpenCV Cascades", test_opencv_cascades)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All tests passed! Blind Assistant is ready to use.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
