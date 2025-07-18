#!/usr/bin/env python3
"""
Blind Assistant Backend API
Provides REST API endpoints for the Blind Assistant features
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import base64
import cv2
import numpy as np
from geopy.geocoders import Nominatim

app = FastAPI(title="Blind Assistant API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class VoiceCommandRequest(BaseModel):
    command: str
    language: Optional[str] = "en"

class ObjectDetectionRequest(BaseModel):
    image_data: str  # base64 encoded image

# Initialize services
geolocator = Nominatim(user_agent="blind_assistant_app")

# Load OpenCV cascades for basic object detection
try:
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
except Exception as e:
    print(f"Warning: Could not load OpenCV cascades: {e}")
    face_cascade = None
    eye_cascade = None

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Blind Assistant API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "blind_assistant_api"}

@app.post("/api/voice/process")
async def process_voice_command(request: VoiceCommandRequest):
    """Process voice commands and return appropriate responses"""
    command = request.command.lower()
    
    responses = {
        "navigate": "Navigation feature ready. Please specify destination.",
        "help": "Available commands: navigate, location, detect, camera, weather",
        "location": "Location services are available. Say a place name.",
        "detect": "Object detection is ready. Point camera at objects.",
        "camera": "Camera is active and ready for detection.",
        "weather": "Weather information feature is in development.",
        "traffic": "Traffic monitoring is active.",
        "emergency": "Emergency services contact feature available."
    }
    
    for keyword, response in responses.items():
        if keyword in command:
            return JSONResponse(status_code=200, content={
                "success": True, 
                "response": response,
                "command_type": keyword
            })
    
    return JSONResponse(status_code=200, content={
        "success": False, 
        "response": "Command not recognized. Say 'help' for available commands.",
        "command_type": "unknown"
    })

@app.post("/api/detect")
async def detect_objects(request: ObjectDetectionRequest):
    """Perform basic object detection on uploaded image"""
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image_data)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        detected_objects = []
        
        # Basic face detection
        if face_cascade is not None:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                detected_objects.append({
                    "type": "face",
                    "confidence": 0.85,
                    "bbox": [int(x), int(y), int(w), int(h)],
                    "description": "Human face detected"
                })
        
        return JSONResponse(status_code=200, content={
            "objects": detected_objects,
            "count": len(detected_objects)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")

@app.get("/api/geocode")
async def geocode_location(name: str):
    """Convert place name to coordinates"""
    try:
        location = geolocator.geocode(name)
        if location:
            return {
                "success": True,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "address": location.address,
                "place_name": name
            }
        else:
            raise HTTPException(status_code=404, detail="Location not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Geocoding error: {str(e)}")

@app.get("/api/reverse-geocode")
async def reverse_geocode(lat: float, lon: float):
    """Convert coordinates to place name"""
    try:
        location = geolocator.reverse((lat, lon))
        if location:
            return {
                "success": True,
                "address": location.address,
                "latitude": lat,
                "longitude": lon
            }
        else:
            raise HTTPException(status_code=404, detail="Address not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reverse geocoding error: {str(e)}")

@app.get("/api/features")
async def get_features():
    """Get list of available features"""
    return {
        "features": [
            {
                "name": "Voice Commands",
                "description": "Process voice commands for navigation and control",
                "endpoint": "/api/voice/process"
            },
            {
                "name": "Object Detection",
                "description": "Detect objects in images using computer vision",
                "endpoint": "/api/detect"
            },
            {
                "name": "Geocoding",
                "description": "Convert place names to coordinates",
                "endpoint": "/api/geocode"
            },
            {
                "name": "Reverse Geocoding",
                "description": "Convert coordinates to place names",
                "endpoint": "/api/reverse-geocode"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
