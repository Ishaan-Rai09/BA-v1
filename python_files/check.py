#!/usr/bin/env python3
"""
System Check Script for Blind Assistant
Tests camera and speech recognition functionality
"""

import cv2
import speech_recognition as sr
import sys

def test_camera():
    """Test camera functionality"""
    print("Testing camera...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open camera")
        return False
    
    print("✅ Camera initialized successfully")
    print("📹 Camera feed starting (press 'q' to quit)...")
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Error: Could not read frame from camera")
            break
        
        frame_count += 1
        cv2.putText(frame, f"Frame: {frame_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Camera Test - Press 'q' to quit", frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Camera test completed")
    return True

def test_speech_recognition():
    """Test speech recognition functionality"""
    print("\nTesting speech recognition...")
    
    r = sr.Recognizer()
    
    # Test microphone access
    try:
        with sr.Microphone() as source:
            print("✅ Microphone access successful")
            print("🎤 Adjusting for ambient noise...")
            r.adjust_for_ambient_noise(source)
            print("🎤 Say something (you have 5 seconds):")
            audio = r.listen(source, timeout=5, phrase_time_limit=5)
            print("✅ Audio captured successfully")
            
        # Test Google Speech Recognition
        print("🔄 Processing speech...")
        text = r.recognize_google(audio)
        print(f"✅ Speech recognized: '{text}'")
        return True
        
    except sr.UnknownValueError:
        print("❌ Could not understand the audio")
        return False
    except sr.RequestError as e:
        print(f"❌ Error with speech recognition service: {e}")
        return False
    except sr.WaitTimeoutError:
        print("❌ No speech detected within timeout")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main function to run all tests"""
    print("="*50)
    print("BLIND ASSISTANT - SYSTEM CHECK")
    print("="*50)
    
    # Test camera
    camera_ok = test_camera()
    
    # Test speech recognition
    speech_ok = test_speech_recognition()
    
    # Summary
    print("\n" + "="*50)
    print("SYSTEM CHECK RESULTS:")
    print("="*50)
    print(f"Camera: {'✅ WORKING' if camera_ok else '❌ FAILED'}")
    print(f"Speech Recognition: {'✅ WORKING' if speech_ok else '❌ FAILED'}")
    
    if camera_ok and speech_ok:
        print("\n🎉 All systems working! Ready to run Blind Assistant.")
        return 0
    else:
        print("\n⚠️  Some systems failed. Please check your hardware and internet connection.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

