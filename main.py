import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow.keras.models import load_model

model = load_model("FaceRecognition.keras", custom_objects={"KerasLayer" : hub.KerasLayer})

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

cap = cv2.VideoCapture(0)

labels = ["Dwi Julian Daffa", "Taufan Ali"]

while True:
    ret, frame = cap.read()

    if not ret:
        break

    faces = face_cascade.detectMultiScale(frame, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = frame[y:y+h, x:x+w]
        roi = cv2.resize(roi, (224, 224)) / 255.0
        predictions = model.predict(np.expand_dims(roi, axis=0))
        label = labels[np.argmax(predictions)]
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,255), 2)
    
    cv2.imshow('Real-Time Face Recognition', frame)
    if cv2.waitKey(1) == 27: #ESC Button
        break

cap.release()
cv2.destroyAllWindows()