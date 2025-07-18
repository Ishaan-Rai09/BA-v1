# Blind Assistant - AI-Powered Navigation and Object Detection

A comprehensive assistive technology solution for visually impaired users, providing voice-controlled navigation, real-time object detection, and location services.

## Features

### 🎤 Voice Commands
- Voice-controlled navigation
- Speech recognition for commands
- Text-to-speech feedback
- Multi-language support

### 👁️ Computer Vision
- Real-time object detection using OpenCV
- Face and person detection
- Visual obstacle identification
- Camera-based navigation assistance

### 🗺️ Location Services
- Voice-to-location conversion
- Geocoding and reverse geocoding
- Distance and direction calculations
- Optional turn-by-turn navigation (with API key)

### 🖥️ User Interface
- Kivy-based GUI application
- Web-based dashboard
- RESTful API backend
- Cross-platform compatibility

## Project Structure

```
Blind_Assistant/
├── main.py                 # Main GUI application with camera feed
├── run_project.py          # Project launcher and dependency manager
├── check.py                # System testing script
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── backend/
│   └── main.py            # FastAPI backend server
├── web_app/               # Next.js web application
├── features/              # Individual feature modules
│   ├── voicecommand.py    # Voice command processing
│   ├── anylocation.py     # Location services
│   ├── realtimeobject.py  # Object detection
│   ├── get_location.py    # Voice navigation
│   ├── direction.py       # Direction services
│   ├── location.py        # Map generation
│   └── lattitude_longitude.py  # Coordinate utilities
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Webcam for object detection
- Microphone for voice commands
- Internet connection for speech recognition and geocoding

### Quick Start
1. Clone the repository:
```bash
git clone <repository-url>
cd Blind_Assistant
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the project launcher:
```bash
python run_project.py
```

### Manual Installation
```bash
# Install core dependencies
pip install kivy opencv-python SpeechRecognition gtts playsound
pip install geopy pyttsx3 numpy folium

# Install backend dependencies (optional)
pip install fastapi uvicorn python-multipart

# Install advanced navigation (optional)
pip install openrouteservice
```

## Usage

### 1. Quick System Check
Test your camera and microphone:
```bash
python check.py
```

### 2. Main Application
Launch the full GUI application:
```bash
python main.py
```

### 3. Individual Features

#### Voice Commands
```bash
python voicecommand.py
```

#### Location Services
```bash
python anylocation.py
```

#### Real-time Object Detection
```bash
python realtimeobject.py
```

#### Voice Navigation
```bash
python get_location.py
```

#### Direction Services
```bash
python direction.py
```

### 4. Backend API
Start the FastAPI backend:
```bash
cd backend
python main.py
```

API will be available at: `http://localhost:8000`

## Configuration

### Environment Variables
For advanced features, set these optional environment variables:

```bash
# For turn-by-turn navigation
export OPENROUTESERVICE_API_KEY="your_api_key_here"

# For enhanced speech recognition (optional)
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
```

### API Keys
- **OpenRouteService**: Get free API key at https://openrouteservice.org/
- **Google Speech Recognition**: Uses free tier by default

## Features in Detail

### Voice Commands
- **"navigate"**: Activate navigation mode
- **"help"**: List available commands
- **"location"**: Get current location info
- **"detect"**: Enable object detection
- **"camera"**: Activate camera features
- **"traffic"**: Check traffic conditions

### Object Detection
- Uses OpenCV Haar Cascades for real-time detection
- Detects faces, people, and common objects
- Provides audio feedback for detected objects
- Configurable detection sensitivity

### Location Services
- Voice-to-coordinates conversion
- Address lookup and reverse geocoding
- Distance and bearing calculations
- Basic navigation instructions
- Optional detailed turn-by-turn directions

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/voice/process` - Process voice commands
- `POST /api/detect` - Object detection
- `GET /api/geocode` - Location lookup
- `GET /api/reverse-geocode` - Reverse geocoding
- `GET /api/features` - List available features

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Check camera permissions
   - Ensure no other applications are using the camera
   - Run `python check.py` to test

2. **Speech recognition not working**
   - Check microphone permissions
   - Ensure stable internet connection
   - Test with `python check.py`

3. **Voice output not working**
   - Check audio output settings
   - Install additional TTS engines if needed
   - Test with `python -c "import pyttsx3; pyttsx3.init().say('test')"`

4. **Location services not working**
   - Ensure internet connection
   - Check if place names are specific enough
   - Try different location formats

### Performance Tips
- Use a good quality microphone for better voice recognition
- Ensure good lighting for object detection
- Close unnecessary applications to free up system resources
- Use wired internet connection for better response times

## Development

### Adding New Features
1. Create a new Python file in the project root
2. Follow the existing pattern for error handling and user feedback
3. Add the feature to `run_project.py` menu
4. Update documentation

### Testing
Run individual components:
```bash
python check.py          # System check
python voicecommand.py   # Voice recognition test
python location.py       # Location services test
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Dependencies

### Core Requirements
- `kivy` - GUI framework
- `opencv-python` - Computer vision
- `SpeechRecognition` - Voice input
- `gtts` - Text-to-speech
- `playsound` - Audio playback
- `geopy` - Geocoding services
- `pyttsx3` - Offline text-to-speech
- `numpy` - Numerical computing
- `folium` - Map generation

### Optional Requirements
- `fastapi` - Web API framework
- `uvicorn` - ASGI server
- `openrouteservice` - Advanced navigation
- `python-multipart` - File upload support

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Run the system check (`python check.py`)
3. Review the documentation
4. Open an issue on GitHub

## Future Enhancements

- [ ] GPS integration for current location
- [ ] Offline speech recognition
- [ ] Advanced object detection with YOLO
- [ ] Indoor navigation
- [ ] Integration with smart home devices
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Emergency contact features
- [ ] Route learning and preferences
- [ ] Weather integration

---

**Note**: This project is designed to be a comprehensive assistive technology solution. While it provides many useful features, it should be used as a supplementary tool and not as a replacement for traditional mobility aids or professional training.
