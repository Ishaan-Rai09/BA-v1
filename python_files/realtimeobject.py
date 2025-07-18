#!/usr/bin/env python3
"""
Real-time Object Detection for Blind Assistant
Uses OpenCV's built-in cascade classifiers for object detection
"""

import cv2
import pyttsx3
import numpy as np
import time

# Initialize TTS engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Speaking rate
engine.setProperty('volume', 0.8)  # Volume level

# Load OpenCV cascade classifiers
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
    body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
    
    print("✅ OpenCV cascades loaded successfully")
except Exception as e:
    print(f"❌ Error loading cascades: {e}")
    face_cascade = None
    eye_cascade = None
    smile_cascade = None
    body_cascade = None

# Initialize camera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Error: Could not open camera")
    exit()

print("📹 Camera started successfully")
print("🎯 Real-time object detection active")
print("Press ESC to exit")

def speak(text):
    """Convert text to speech"""
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Speech error: {e}")

def detect_objects(frame):
    """Detect objects in the frame using OpenCV cascades"""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detections = []
    
    # Face detection
    if face_cascade is not None:
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, 'Face', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            detections.append('face')
    
    # Eye detection within faces
    if eye_cascade is not None and len(faces) > 0:
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = frame[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 3)
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (255, 0, 0), 2)
    
    # Smile detection within faces
    if smile_cascade is not None and len(faces) > 0:
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = frame[y:y+h, x:x+w]
            smiles = smile_cascade.detectMultiScale(roi_gray, 1.8, 20)
            for (sx, sy, sw, sh) in smiles:
                cv2.rectangle(roi_color, (sx, sy), (sx+sw, sy+sh), (0, 0, 255), 2)
                if len(smiles) > 0:
                    detections.append('smile')
    
    # Body detection (less reliable but useful)
    if body_cascade is not None:
        bodies = body_cascade.detectMultiScale(gray, 1.1, 3)
        for (x, y, w, h) in bodies:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 0), 2)
            cv2.putText(frame, 'Person', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            detections.append('person')
    
    return detections

def main():
    """Main detection loop"""
    last_announcement_time = 0
    announcement_interval = 3  # seconds
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Error: Could not read frame")
            break
        
        # Detect objects
        detections = detect_objects(frame)
        
        # Announce detections (with time limit to avoid spam)
        current_time = time.time()
        if detections and (current_time - last_announcement_time) > announcement_interval:
            unique_detections = list(set(detections))
            
            if 'face' in unique_detections:
                speak("Person detected ahead")
            elif 'person' in unique_detections:
                speak("Person detected")
            elif 'smile' in unique_detections:
                speak("Smiling person detected")
            
            last_announcement_time = current_time
            print(f"Detected: {', '.join(unique_detections)}")
        
        # Add detection status to frame
        status_text = f"Detections: {len(detections)}"
        cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Show frame
        cv2.imshow('Blind Assistant - Real-time Detection (Press ESC to exit)', frame)
        
        # Exit on ESC key
        if cv2.waitKey(1) & 0xFF == 27:  # ESC key
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    print("👋 Object detection stopped")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Detection stopped by user")
        cap.release()
        cv2.destroyAllWindows()
