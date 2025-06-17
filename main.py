import os
import pickle
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
from werkzeug.utils import secure_filename

app = FastAPI(title="Face Recognition API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

PICKLE_FILE = "registered_users.pkl"

# Load registered users - dengan error handling
registered_users = []
if os.path.exists(PICKLE_FILE):
    try:
        with open(PICKLE_FILE, "rb") as f:
            while True:
                try:
                    registered_users.append(pickle.load(f))
                except EOFError:
                    break
    except Exception as e:
        print(f"Error loading registered users: {e}")
        registered_users = []
else:
    print("No registered users file found. Starting with empty database.")


@app.post("/register")
async def register_user(
    name: str = Form(...),
    image: UploadFile = File(...)
):
    """Register a new user's face"""
    if not image.filename:
        raise HTTPException(status_code=400, detail="Gambar dan nama wajib dilampirkan")
    
    # Save uploaded file
    filename = secure_filename(image.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        contents = await image.read()
        with open(filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

    try:
        # Process image
        frame = cv2.imread(filepath)
        if frame is None:
            os.remove(filepath)
            raise HTTPException(status_code=400, detail="Invalid image format")
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        if len(face_encodings) == 0:
            os.remove(filepath)
            raise HTTPException(status_code=400, detail="Tidak ada wajah terdeteksi.")

        user_data = {
            "name": name,
            "encoding": face_encodings[0]
        }

        # Save to file and update list in-memory
        try:
            with open(PICKLE_FILE, "ab") as f:
                pickle.dump(user_data, f)
            
            # Update registered_users list in memory
            registered_users.append(user_data)
            
        except Exception as e:
            os.remove(filepath)
            raise HTTPException(status_code=500, detail=f"Gagal menyimpan data: {str(e)}")

        os.remove(filepath)
        return {"status": "success", "message": f"Wajah {name} berhasil diregistrasi."}

    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.post("/recognize")
async def recognize_face(image: UploadFile = File(...)):
    """Recognize faces in uploaded image"""
    if not image.filename:
        raise HTTPException(status_code=400, detail="No image uploaded")

    # Check if there are registered users
    if len(registered_users) == 0:
        raise HTTPException(
            status_code=400, 
            detail="Belum ada wajah yang terdaftar. Silakan registrasi terlebih dahulu."
        )

    try:
        # Read image from upload
        contents = await image.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
            
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb)
        face_encodings = face_recognition.face_encodings(rgb, face_locations)

        if len(face_encodings) == 0:
            raise HTTPException(status_code=400, detail="Tidak ada wajah terdeteksi pada gambar")

        results = []

        for encoding, location in zip(face_encodings, face_locations):
            name = "Unknown"
            accuracy = 0.0
            distances = [
                face_recognition.face_distance([user["encoding"]], encoding)[0]
                for user in registered_users
            ]

            if distances:
                min_distance = min(distances)
                idx = distances.index(min_distance)
                accuracy = round((1 - min_distance) * 100, 2)
                if min_distance < 0.5:
                    name = registered_users[idx]["name"]

            results.append({
                "name": name,
                "accuracy": accuracy,
                "location": location  # (top, right, bottom, left)
            })

        return {"faces": results}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/users")
async def get_registered_users():
    """Get list of registered users"""
    user_list = [{"name": user["name"]} for user in registered_users]
    return {
        "total_users": len(user_list),
        "users": user_list
    }


@app.delete("/reset")
async def reset_database():
    """Reset database (delete all registered users)"""
    global registered_users
    try:
        if os.path.exists(PICKLE_FILE):
            os.remove(PICKLE_FILE)
        registered_users = []
        return {"message": "Database berhasil direset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal reset database: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Face Recognition API",
        "version": "1.0.0",
        "endpoints": {
            "POST /register": "Register new user face",
            "POST /recognize": "Recognize faces in image", 
            "GET /users": "Get registered users",
            "DELETE /reset": "Reset database",
            "GET /docs": "API documentation"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)