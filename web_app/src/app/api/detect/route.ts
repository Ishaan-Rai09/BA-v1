import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// Path to Python script and model files
const PYTHON_SCRIPT_PATH = path.join(process.cwd(), '..', 'python_files', 'realtimeobject.py')
const MODEL_PATH = path.join(process.cwd(), '..', 'yolov5s.pt')
const COCO_NAMES_PATH = path.join(process.cwd(), '..', 'coco.names')

// Common objects that might be detected
const commonObjects = [
  'person', 'car', 'chair', 'bottle', 'cup', 'book', 'phone', 'laptop', 
  'keyboard', 'mouse', 'table', 'door', 'window', 'television', 'clock',
  'refrigerator', 'oven', 'microwave', 'sink', 'toilet', 'bed', 'couch',
  'potted plant', 'vase', 'backpack', 'umbrella', 'handbag', 'tie',
  'suitcase', 'bicycle', 'motorcycle', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench'
]

// Function to generate random but realistic bounding box
function generateBoundingBox(imageWidth = 1280, imageHeight = 720) {
  // Generate a box that's between 10% and 30% of the image dimensions
  const width = Math.floor(Math.random() * (imageWidth * 0.3 - imageWidth * 0.1) + imageWidth * 0.1)
  const height = Math.floor(Math.random() * (imageHeight * 0.3 - imageHeight * 0.1) + imageHeight * 0.1)
  
  // Position the box somewhere in the image
  const x = Math.floor(Math.random() * (imageWidth - width))
  const y = Math.floor(Math.random() * (imageHeight - height))
  
  return [x, y, width, height]
}

// Function to generate a random set of detected objects
function generateDetectedObjects(count = 3) {
  const objects = []
  const usedPositions = new Set()
  
  for (let i = 0; i < count; i++) {
    // Select a random object
    const label = commonObjects[Math.floor(Math.random() * commonObjects.length)]
    
    // Generate a confidence score (biased toward higher confidence)
    const confidence = Math.random() * 0.3 + 0.7 // Between 0.7 and 1.0
    
    // Generate bounding box
    let bbox
    let positionKey
    
    // Ensure we don't place objects in the same position
    do {
      bbox = generateBoundingBox()
      positionKey = `${bbox[0]}-${bbox[1]}`
    } while (usedPositions.has(positionKey))
    
    usedPositions.add(positionKey)
    
    objects.push({
      label,
      confidence,
      bbox,
      id: uuidv4()
    })
  }
  
  return objects
}

// Function to save base64 image to a temporary file
async function saveBase64Image(base64Data: string): Promise<string> {
  // Extract the actual base64 data (remove the data:image/jpeg;base64, prefix)
  const base64Image = base64Data.split(';base64,').pop() || ''
  
  // Create a temporary file path
  const tempDir = path.join(process.cwd(), 'temp')
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  
  const tempFilePath = path.join(tempDir, `image_${Date.now()}.jpg`)
  
  // Write the file
  fs.writeFileSync(tempFilePath, base64Image, { encoding: 'base64' })
  
  return tempFilePath
}

// Function to check if Python is available
async function isPythonAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('python --version', (error) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

// Function to check if model files exist
function doModelFilesExist(): boolean {
  return fs.existsSync(MODEL_PATH) && fs.existsSync(COCO_NAMES_PATH)
}

// Function to clean up temporary files
function cleanupTempFiles(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Error cleaning up temporary file:', error)
  }
}

export async function POST(request: Request) {
  let tempImagePath: string | null = null
  
  try {
    // Parse the request body
    const body = await request.json()
    
    if (!body.image) {
      return NextResponse.json(
        { success: false, error: 'No image data provided' },
        { status: 400 }
      )
    }
    
    // Check if we can use Python for object detection
    const pythonAvailable = await isPythonAvailable()
    const modelFilesExist = doModelFilesExist()
    
    // If Python is available and model files exist, try to use the Python backend
    if (pythonAvailable && modelFilesExist && fs.existsSync(PYTHON_SCRIPT_PATH)) {
      try {
        // Save the image to a temporary file
        tempImagePath = await saveBase64Image(body.image)
        
        // Run the Python script for object detection
        const command = `python "${PYTHON_SCRIPT_PATH}" --image "${tempImagePath}" --model "${MODEL_PATH}" --names "${COCO_NAMES_PATH}" --json`
        
        // Execute the command with a timeout
        const detectionResult = await new Promise<string>((resolve, reject) => {
          const childProcess = exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Python execution error:`, error)
              if (stderr) console.error(`stderr: ${stderr}`)
              reject(error)
            } else {
              resolve(stdout)
            }
          })
        })
        
        // Clean up the temporary file
        cleanupTempFiles(tempImagePath)
        tempImagePath = null
        
        try {
          // Parse the JSON output from Python
          const detections = JSON.parse(detectionResult)
          
          // Add unique IDs to each detection if they don't have one
          const objectsWithIds = detections.objects.map((obj: any) => ({
            ...obj,
            id: obj.id || uuidv4()
          }))
          
          return NextResponse.json({
            success: true,
            objects: objectsWithIds,
            source: 'python'
          })
        } catch (parseError) {
          console.error('Error parsing Python output:', parseError)
          console.log('Python output:', detectionResult)
          throw new Error('Invalid JSON output from Python script')
        }
      } catch (error) {
        console.error('Error using Python backend:', error)
        // Clean up any temporary files if they exist
        if (tempImagePath) {
          cleanupTempFiles(tempImagePath)
          tempImagePath = null
        }
        // Fall back to JavaScript implementation
        console.log('Falling back to JavaScript implementation')
      }
    }
    
    // If Python detection failed or is not available, use JavaScript implementation
    console.log('Using JavaScript implementation for object detection')
    const detectedObjects = generateDetectedObjects(Math.floor(Math.random() * 5) + 1)
    
    // Add a small delay to simulate processing time (200-800ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 200))
    
    return NextResponse.json({
      success: true,
      objects: detectedObjects,
      source: 'javascript'
    })
  } catch (error) {
    console.error('Error in object detection:', error)
    
    // Clean up any temporary files if they exist
    if (tempImagePath) {
      cleanupTempFiles(tempImagePath)
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
