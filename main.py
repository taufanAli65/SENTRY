import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow.keras.models import load_model

model = load_model("EB0FaceRecognition.keras", custom_objects={"KerasLayer": hub.KerasLayer})

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

cap = cv2.VideoCapture(0)

labels = ["Dwi Julian Daffa", "Taufan Ali"]

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_h, frame_w, _ = frame.shape
    faces = face_cascade.detectMultiScale(frame, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = frame[y:y+h, x:x+w]
        roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
        roi = cv2.resize(roi, (224, 224)) / 255.0

        predictions = model.predict(np.expand_dims(roi, axis=0), verbose=0)[0]
        pred_index = np.argmax(predictions)
        confidence = predictions[pred_index]

        label_text = f"{labels[pred_index]}: {confidence*100:.2f}%"

        # Kotak wajah
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Ukuran teks
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        thickness = 2
        text_size, _ = cv2.getTextSize(label_text, font, font_scale, thickness)

        # Background hijau untuk teks
        text_w, text_h = text_size
        cv2.rectangle(frame, (x, y - text_h - 10), (x + text_w + 10, y), (0, 255, 0), -1)

        # Tulis teks di atas background
        cv2.putText(frame, label_text, (x + 5, y - 5), font, font_scale, (0, 0, 0), thickness)

    cv2.imshow('Real-Time Face Recognition', frame)
    if cv2.waitKey(1) == 27:  # ESC
        break

cap.release()
cv2.destroyAllWindows()
