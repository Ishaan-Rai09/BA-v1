#!/usr/bin/env python3
"""
Voice Navigation Assistant for Blind Assistant
Provides voice-controlled navigation and location services
"""

import speech_recognition as sr
from geopy.geocoders import Nominatim
import pyttsx3
import os

# Initialize Services
recognizer = sr.Recognizer()
geolocator = Nominatim(user_agent="blind_assistant_app")
tts_engine = pyttsx3.init()

# Configure TTS engine
tts_engine.setProperty('rate', 150)
tts_engine.setProperty('volume', 0.8)

# Check for OpenRouteService API key
ORS_API_KEY = os.getenv('OPENROUTESERVICE_API_KEY')
if ORS_API_KEY:
    try:
        import openrouteservice
        ors_client = openrouteservice.Client(key=ORS_API_KEY)
        print("✅ OpenRouteService API key found")
    except ImportError:
        print("⚠️  OpenRouteService not available. Install with: pip install openrouteservice")
        ors_client = None
else:
    print("⚠️  OpenRouteService API key not found. Set OPENROUTESERVICE_API_KEY environment variable")
    print("    for turn-by-turn directions. Basic location services will work.")
    ors_client = None

def speak(text):
    """Convert text to speech"""
    try:
        print(f"🔊 Speaking: {text}")
        tts_engine.say(text)
        tts_engine.runAndWait()
    except Exception as e:
        print(f"Speech error: {e}")

def get_destination_by_voice():
    """Get destination from voice input"""
    with sr.Microphone() as source:
        print("🎤 Please speak your destination:")
        speak("Please speak your destination")
        
        try:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source, timeout=10)
            
            print("🔄 Processing your voice...")
            destination = recognizer.recognize_google(audio)
            print(f"✅ You said: {destination}")
            return destination
            
        except sr.UnknownValueError:
            print("❌ Could not understand audio.")
            speak("Sorry, I didn't understand. Please try again.")
            return None
        except sr.RequestError as e:
            print(f"❌ API error: {e}")
            speak("Speech recognition service error. Please check your internet connection.")
            return None
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            speak("An error occurred. Please try again.")
            return None

def get_coordinates(place_name, city="Delhi"):
    """Convert place name to coordinates"""
    try:
        # Try with city first
        location = geolocator.geocode(f"{place_name}, {city}")
        
        # If not found, try without city
        if not location:
            location = geolocator.geocode(place_name)
        
        if location:
            print(f"📍 Found: {location.address}")
            return (location.longitude, location.latitude)
        else:
            return None
    except Exception as e:
        print(f"❌ Geocoding failed: {e}")
        return None

def get_basic_directions(source_coords, destination_coords):
    """Get basic distance and direction information"""
    from geopy.distance import geodesic
    
    # Calculate distance
    distance = geodesic(
        (source_coords[1], source_coords[0]),  # (lat, lon)
        (destination_coords[1], destination_coords[0])
    ).kilometers
    
    # Calculate bearing (simplified)
    lat1, lon1 = source_coords[1], source_coords[0]
    lat2, lon2 = destination_coords[1], destination_coords[0]
    
    import math
    
    def get_bearing(lat1, lon1, lat2, lon2):
        dlon = math.radians(lon2 - lon1)
        lat1 = math.radians(lat1)
        lat2 = math.radians(lat2)
        
        y = math.sin(dlon) * math.cos(lat2)
        x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
        
        bearing = math.atan2(y, x)
        bearing = math.degrees(bearing)
        bearing = (bearing + 360) % 360
        
        return bearing
    
    bearing = get_bearing(lat1, lon1, lat2, lon2)
    
    # Convert bearing to direction
    directions = [
        "North", "North-East", "East", "South-East",
        "South", "South-West", "West", "North-West"
    ]
    
    direction = directions[round(bearing / 45) % 8]
    
    return distance, direction

def provide_navigation_info(source_coords, destination_coords, destination_name):
    """Provide navigation information"""
    try:
        distance, direction = get_basic_directions(source_coords, destination_coords)
        
        info = f"Your destination {destination_name} is approximately {distance:.1f} kilometers away in the {direction} direction."
        
        print(f"📍 {info}")
        speak(info)
        
        if ors_client:
            try:
                # Get detailed route
                route = ors_client.directions(
                    coordinates=[source_coords, destination_coords],
                    profile='foot-walking',
                    format='geojson'
                )
                
                steps = route['features'][0]['properties']['segments'][0]['steps']
                
                print("\n🗺️  Turn-by-turn directions:")
                speak("Here are the turn by turn directions")
                
                for i, step in enumerate(steps[:5]):  # Limit to first 5 steps
                    instruction = step['instruction']
                    print(f"  {i+1}. {instruction}")
                    speak(instruction)
                    
                    if i < len(steps) - 1:
                        input("Press Enter for next instruction...")
                        
            except Exception as e:
                print(f"❌ Error getting detailed directions: {e}")
                speak("Detailed directions not available, but basic information provided.")
        
    except Exception as e:
        print(f"❌ Error providing navigation info: {e}")
        speak("Unable to provide navigation information")

def main():
    """Main navigation flow"""
    print("="*50)
    print("🧭 VOICE NAVIGATION ASSISTANT")
    print("="*50)
    
    # Get destination from voice
    destination = get_destination_by_voice()
    if not destination:
        return
    
    # Get coordinates for destination
    destination_coords = get_coordinates(destination)
    if not destination_coords:
        print("❌ Destination not found.")
        speak("Destination not found. Please try with a more specific location.")
        return
    
    # Use default current location (can be changed)
    source_coords = (77.2295, 28.6129)  # India Gate, Delhi (longitude, latitude)
    
    print(f"\n🚀 Navigating from India Gate to {destination}...")
    speak(f"Navigating to {destination}")
    
    # Provide navigation information
    provide_navigation_info(source_coords, destination_coords, destination)
    
    print("\n✅ Navigation complete!")
    speak("Navigation complete. Have a safe journey!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Navigation stopped by user")
        speak("Navigation stopped")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        speak("An error occurred")
