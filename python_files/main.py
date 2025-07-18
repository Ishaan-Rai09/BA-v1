import kivy
from kivy.app import App
from kivy.uix.button import Button
from kivy.uix.image import Image
from kivy.uix.boxlayout import BoxLayout
from kivy.clock import Clock
from kivy.graphics.texture import Texture

import cv2
import speech_recognition as sr
from gtts import gTTS
import os
import threading
try:
    import pygame
    pygame.mixer.init()
    PYGAME_AVAILABLE = True
except ImportError:
    PYGAME_AVAILABLE = False
    print("Warning: pygame not available. Audio playback disabled.")

# Camera access
cap = cv2.VideoCapture(0)

def speak(text):
    """Convert text to speech"""
    try:
        tts = gTTS(text=text, lang='en')
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        # Create voice.mp3 in the parent directory
        parent_dir = os.path.dirname(script_dir)
        voice_path = os.path.join(parent_dir, "voice.mp3")
        tts.save(voice_path)
        
        if PYGAME_AVAILABLE:
            pygame.mixer.music.load(voice_path)
            pygame.mixer.music.play()
            
            # Wait for playback to finish
            while pygame.mixer.music.get_busy():
                pygame.time.wait(100)
        else:
            print(f"Speech: {text}")
        
        # Clean up
        try:
            os.remove(voice_path)
        except:
            pass
    except Exception as e:
        print(f"Speech error: {e}")

def listen_and_alert():
    """Listen for voice commands and respond"""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        try:
            audio = r.listen(source, timeout=5)
            result = r.recognize_google(audio)
            print("You said:", result)

            # Basic command processing
            if "horn" in result.lower() or "traffic" in result.lower():
                speak("Please wait. Traffic detected ahead.")
            elif "navigate" in result.lower():
                speak("Navigation feature available. Please use location services.")
            elif "help" in result.lower():
                speak("Available commands: traffic, navigate, help, or camera")
            elif "camera" in result.lower():
                speak("Camera is active. Object detection ready.")
            else:
                speak("Command received. How can I assist you?")

        except sr.UnknownValueError:
            print("Could not understand the audio.")
            speak("Sorry, I did not understand.")
        except sr.RequestError as e:
            print("Internet error:", e)
            speak("Please check your internet connection.")
        except Exception as e:
            print(f"Error occurred: {e}")
            speak("An error occurred. Please try again.")

# Load Haar cascades for object detection
try:
    human_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')
    # Note: haarcascade_car.xml doesn't exist in standard OpenCV, using alternative
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
except Exception as e:
    print(f"Warning: Could not load cascades: {e}")
    human_cascade = None
    face_cascade = None

class MainApp(App):
    def __init__(self):
        super().__init__()
        self.detection_active = False
        self.last_detection_time = 0
        
    def build(self):
        self.img = Image()
        layout = BoxLayout(orientation='vertical')
        
        # Voice command button
        voice_btn = Button(text='🎙️ Voice Command', font_size=20, size_hint_y=0.2)
        voice_btn.bind(on_press=self.start_voice_command)
        
        # Object detection toggle
        detect_btn = Button(text='👁️ Toggle Detection', font_size=20, size_hint_y=0.2)
        detect_btn.bind(on_press=self.toggle_detection)
        
        layout.add_widget(self.img)
        layout.add_widget(voice_btn)
        layout.add_widget(detect_btn)
        
        Clock.schedule_interval(self.update, 1.0 / 30.0)
        return layout
    
    def start_voice_command(self, instance):
        """Start voice command in a separate thread"""
        threading.Thread(target=listen_and_alert, daemon=True).start()
    
    def toggle_detection(self, instance):
        """Toggle object detection on/off"""
        self.detection_active = not self.detection_active
        status = "enabled" if self.detection_active else "disabled"
        speak(f"Object detection {status}")
        print(f"Object detection {status}")
    
    def update(self, dt):
        """Update camera feed and perform object detection"""
        ret, frame = cap.read()
        if ret:
            # Perform object detection if active
            if self.detection_active and human_cascade and face_cascade:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Detect faces (more reliable than full body)
                faces = face_cascade.detectMultiScale(gray, 1.1, 4)
                
                current_time = Clock.get_time()
                if len(faces) > 0 and (current_time - self.last_detection_time) > 3:  # 3-second delay
                    cv2.rectangle(frame, (faces[0][0], faces[0][1]), 
                                (faces[0][0] + faces[0][2], faces[0][1] + faces[0][3]), (0, 255, 0), 2)
                    threading.Thread(target=speak, args=["Person detected"], daemon=True).start()
                    self.last_detection_time = current_time
                
                # Draw detection boxes
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Display frame
            buf = cv2.flip(frame, 0).tobytes()
            img_texture = Texture.create(size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
            img_texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
            self.img.texture = img_texture
    
    def on_stop(self):
        """Clean up when app closes"""
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    MainApp().run()
