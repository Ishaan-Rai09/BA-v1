#!/usr/bin/env python3
"""
Direction Services for Blind Assistant
Provides basic direction and distance calculations
"""

import os
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import math

# Initialize geocoder
geolocator = Nominatim(user_agent="blind_assistant")

def get_coordinates(place_name):
    """Get coordinates for a place"""
    try:
        location = geolocator.geocode(place_name)
        if location:
            return (location.latitude, location.longitude)
        return None
    except Exception as e:
        print(f"Error getting coordinates for {place_name}: {e}")
        return None

def calculate_distance(coord1, coord2):
    """Calculate distance between two coordinates"""
    return geodesic(coord1, coord2).kilometers

def calculate_bearing(coord1, coord2):
    """Calculate bearing from coord1 to coord2"""
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlon = lon2 - lon1
    
    y = math.sin(dlon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    
    bearing = math.atan2(y, x)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360
    
    return bearing

def bearing_to_direction(bearing):
    """Convert bearing to compass direction"""
    directions = [
        "North", "North-East", "East", "South-East",
        "South", "South-West", "West", "North-West"
    ]
    
    index = round(bearing / 45) % 8
    return directions[index]

def get_basic_directions(start_place, end_place):
    """Get basic directions between two places"""
    print(f"\n🧭 Getting directions from {start_place} to {end_place}...")
    
    # Get coordinates
    start_coords = get_coordinates(start_place)
    end_coords = get_coordinates(end_place)
    
    if not start_coords:
        print(f"❌ Could not find coordinates for {start_place}")
        return None
    
    if not end_coords:
        print(f"❌ Could not find coordinates for {end_place}")
        return None
    
    print(f"📍 Start: {start_coords}")
    print(f"📍 End: {end_coords}")
    
    # Calculate distance and bearing
    distance = calculate_distance(start_coords, end_coords)
    bearing = calculate_bearing(start_coords, end_coords)
    direction = bearing_to_direction(bearing)
    
    print(f"\n📏 Distance: {distance:.2f} km")
    print(f"🧭 Direction: {direction} ({bearing:.1f}°)")
    
    return {
        'start_coords': start_coords,
        'end_coords': end_coords,
        'distance': distance,
        'bearing': bearing,
        'direction': direction
    }

def get_advanced_directions(start_place, end_place):
    """Get advanced directions using OpenRouteService if available"""
    
    # Check for API key
    api_key = os.getenv('OPENROUTESERVICE_API_KEY')
    if not api_key:
        print("⚠️  OpenRouteService API key not found.")
        print("   Set OPENROUTESERVICE_API_KEY environment variable for detailed directions.")
        print("   Falling back to basic directions...")
        return get_basic_directions(start_place, end_place)
    
    try:
        import openrouteservice
        
        # Get coordinates
        start_coords = get_coordinates(start_place)
        end_coords = get_coordinates(end_place)
        
        if not start_coords or not end_coords:
            return get_basic_directions(start_place, end_place)
        
        # Initialize client
        client = openrouteservice.Client(key=api_key)
        
        # Get route
        coords = ((end_coords[1], end_coords[0]), (start_coords[1], start_coords[0]))  # (lon, lat)
        route = client.directions(coords, profile='foot-walking', format='geojson')
        
        # Extract steps
        steps = route['features'][0]['properties']['segments'][0]['steps']
        
        print(f"\n🗺️  Turn-by-turn directions from {start_place} to {end_place}:")
        print("=" * 60)
        
        for i, step in enumerate(steps, 1):
            instruction = step['instruction']
            distance = step.get('distance', 0)
            duration = step.get('duration', 0)
            
            print(f"{i:2d}. {instruction}")
            if distance > 0:
                print(f"    Distance: {distance:.0f}m, Duration: {duration:.0f}s")
            print()
        
        return {
            'start_coords': start_coords,
            'end_coords': end_coords,
            'steps': steps,
            'total_distance': route['features'][0]['properties']['segments'][0]['distance'] / 1000,
            'total_duration': route['features'][0]['properties']['segments'][0]['duration'] / 60
        }
        
    except ImportError:
        print("⚠️  OpenRouteService not installed. Install with: pip install openrouteservice")
        return get_basic_directions(start_place, end_place)
    except Exception as e:
        print(f"❌ Error getting advanced directions: {e}")
        print("   Falling back to basic directions...")
        return get_basic_directions(start_place, end_place)

def main():
    """Main function to demonstrate direction services"""
    print("=" * 50)
    print("🧭 DIRECTION SERVICES DEMO")
    print("=" * 50)
    
    # Default locations
    start_place = "Kanpur Central"
    end_place = "Gopal Nagar"
    
    print(f"Getting directions from {start_place} to {end_place}...")
    
    # Try advanced directions first
    result = get_advanced_directions(start_place, end_place)
    
    if result:
        if 'steps' in result:
            print(f"\n✅ Advanced directions completed!")
            print(f"📏 Total distance: {result['total_distance']:.2f} km")
            print(f"⏱️  Estimated time: {result['total_duration']:.1f} minutes")
        else:
            print(f"\n✅ Basic directions completed!")
            print(f"📏 Distance: {result['distance']:.2f} km")
            print(f"🧭 Direction: {result['direction']}")
    else:
        print("❌ Could not get directions")

if __name__ == "__main__":
    main()
