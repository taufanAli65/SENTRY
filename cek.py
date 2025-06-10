import cv2

def check_available_cameras(max_cameras=5):
    available_cameras = []
    for i in range(max_cameras):
        cap = cv2.VideoCapture(i)
        if cap is not None and cap.isOpened():
            print(f"Kamera tersedia di index: {i}")
            available_cameras.append(i)
            cap.release()
        else:
            print(f"TIDAK ada kamera di index: {i}")
    return available_cameras

# Cek maksimal 5 kamera (bisa diganti lebih besar jika perlu)
available = check_available_cameras(5)
print("Kamera aktif:", available)
