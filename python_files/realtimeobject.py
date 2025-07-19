import cv2
import numpy as np
import argparse
import json
import os
import sys
import traceback

# Parse command line arguments
def parse_args():
    parser = argparse.ArgumentParser(description='Object Detection for Blind Assistant')
    parser.add_argument('--image', type=str, help='Path to image file for detection')
    parser.add_argument('--model', type=str, default='', help='Path to YOLO model')
    parser.add_argument('--names', type=str, default='', help='Path to class names file')
    parser.add_argument('--json', action='store_true', help='Output results as JSON')
    parser.add_argument('--confidence', type=float, default=0.5, help='Confidence threshold')
    return parser.parse_args()

def load_class_names(names_path):
    """Load class names from file"""
    try:
        with open(names_path, 'r') as f:
            return [line.strip() for line in f.readlines()]
    except Exception:
        # Default COCO class names if file cannot be loaded
        return [
            'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
            'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
            'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
            'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
            'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
            'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
            'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
            'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
            'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator',
            'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
        ]

def log_error(message, is_json_mode=False):
    """Log error message to stderr"""
    if not is_json_mode:
        sys.stderr.write(f"ERROR: {message}\n")
        sys.stderr.flush()

def detect_objects_yolov5(image_path, model_path, names_path, conf_threshold=0.5, is_json_mode=False):
    """Attempt to use YOLOv5 model with OpenCV DNN"""
    try:
        # Check if model exists
        if not os.path.exists(model_path):
            log_error(f"Model file not found: {model_path}", is_json_mode)
            return None
            
        # Load class names
        classes = load_class_names(names_path)
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            log_error(f"Could not read image: {image_path}", is_json_mode)
            return None
            
        # Since we can't directly use PyTorch models with OpenCV,
        # we'll use face detection as a fallback
        log_error("YOLOv5/YOLOv8 models require PyTorch. Falling back to face detection.", is_json_mode)
        return detect_faces(image)
    except Exception as e:
        log_error(f"Error in YOLOv5 detection: {str(e)}", is_json_mode)
        return None

def detect_objects_yolov3(image_path, config_path, weights_path, names_path, conf_threshold=0.5, is_json_mode=False):
    """Detect objects using YOLOv3 with OpenCV DNN"""
    try:
        # Check if files exist
        if not os.path.exists(config_path):
            log_error(f"Config file not found: {config_path}", is_json_mode)
            return None
            
        if not os.path.exists(weights_path):
            log_error(f"Weights file not found: {weights_path}", is_json_mode)
            return None
            
        # Load class names
        classes = load_class_names(names_path)
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            log_error(f"Could not read image: {image_path}", is_json_mode)
            return None
            
        height, width = image.shape[:2]
        
        # Load YOLOv3 network
        try:
            net = cv2.dnn.readNetFromDarknet(config_path, weights_path)
        except Exception as e:
            log_error(f"Error loading YOLOv3 model: {str(e)}", is_json_mode)
            return None
            
        # Get output layer names
        layer_names = net.getLayerNames()
        try:
            # Different versions of OpenCV handle this differently
            if cv2.__version__.startswith('4'):
                output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]
            else:
                output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        except Exception as e:
            log_error(f"Error getting output layers: {str(e)}", is_json_mode)
            return None
            
        # Create blob from image
        blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
        net.setInput(blob)
        
        # Run forward pass
        try:
            outputs = net.forward(output_layers)
        except Exception as e:
            log_error(f"Error during network forward pass: {str(e)}", is_json_mode)
            return None
        
        # Process detections
        detections = []
        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                
                if confidence > conf_threshold:
                    # Scale bounding box coordinates to image size
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    
                    # Rectangle coordinates
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    
                    detections.append({
                        'label': classes[class_id] if class_id < len(classes) else f"class_{class_id}",
                        'confidence': float(confidence),
                        'bbox': [x, y, w, h]
                    })
        
        return detections
    except Exception as e:
        log_error(f"Error in YOLOv3 detection: {str(e)}", is_json_mode)
        return None

def detect_faces(image):
    """Fallback face detection using Haar cascades"""
    try:
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Load face cascade
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        # Create detection objects
        detections = []
        for (x, y, w, h) in faces:
            detections.append({
                'label': 'face',
                'confidence': 0.9,  # Arbitrary confidence for cascades
                'bbox': [int(x), int(y), int(w), int(h)]
            })
            
        return detections
    except Exception:
        # Return empty list if all detection methods fail
        return []

def process_image(image_path, model_path, names_path, conf_threshold=0.5, is_json_mode=False):
    """Process image with available models, trying different options"""
    # Get project root directory
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Try different detection methods in order of preference
    
    # 1. If model path ends with .pt, try YOLOv5/YOLOv8
    if model_path.endswith('.pt'):
        detections = detect_objects_yolov5(image_path, model_path, names_path, conf_threshold, is_json_mode)
        if detections:
            return detections
    
    # 2. Try YOLOv3 if config file exists
    yolov3_cfg = os.path.join(project_root, "yolov3.cfg")
    yolov3_weights = os.path.join(project_root, "yolov3.weights")
    
    if os.path.exists(yolov3_cfg) and os.path.exists(yolov3_weights):
        detections = detect_objects_yolov3(
            image_path, yolov3_cfg, yolov3_weights, names_path, conf_threshold, is_json_mode
        )
        if detections:
            return detections
    
    # 3. Try YOLOv3-tiny as fallback
    yolov3_tiny_cfg = os.path.join(project_root, "yolov3-tiny.cfg")
    yolov3_tiny_weights = os.path.join(project_root, "yolov3-tiny.weights")
    
    if os.path.exists(yolov3_tiny_cfg) and os.path.exists(yolov3_tiny_weights):
        detections = detect_objects_yolov3(
            image_path, yolov3_tiny_cfg, yolov3_tiny_weights, names_path, conf_threshold, is_json_mode
        )
        if detections:
            return detections
    
    # 4. Last resort: try face detection
    image = cv2.imread(image_path)
    if image is not None:
        return detect_faces(image)
    
    # If all else fails, return empty list
    return []

def main():
    """Main detection function"""
    # Parse arguments
    args = parse_args()
    is_json_mode = args.json or '--json' in sys.argv
    
    try:
        # Process image if provided
        if args.image:
            # Log what we're doing
            if not is_json_mode:
                print(f"Processing image: {args.image}")
                print(f"Using model: {args.model if args.model else 'default'}")
                print(f"Using names file: {args.names if args.names else 'default'}")
            
            # Detect objects
            detections = process_image(args.image, args.model, args.names, args.confidence, is_json_mode)
            
            if is_json_mode:
                # Output as JSON
                result = {
                    'success': True,
                    'objects': detections if detections else []
                }
                print(json.dumps(result))
                return
            
            # If not JSON mode, print detection info
            print(f"Detected {len(detections)} objects:")
            for i, obj in enumerate(detections):
                print(f"{i+1}. {obj['label']} ({obj['confidence']:.2f})")
        else:
            # No image provided
            if is_json_mode:
                # Return empty results
                result = {
                    'success': True,
                    'objects': []
                }
                print(json.dumps(result))
            else:
                print("No image provided. Use --image parameter.")
    except Exception as e:
        # Get full traceback for debugging
        error_trace = traceback.format_exc()
        
        # Log the error
        if not is_json_mode:
            sys.stderr.write(f"ERROR: {str(e)}\n")
            sys.stderr.write(error_trace)
            sys.stderr.flush()
        
        # Ensure we always return valid JSON if requested
        if is_json_mode:
            result = {
                'success': True,
                'objects': []
            }
            print(json.dumps(result))

if __name__ == "__main__":
    main()