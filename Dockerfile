FROM python:3.10-slim

# Install cmake dan dependencies untuk build dlib
RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-python-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Tambahkan user biasa
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

COPY --chown=user ./requirements.txt requirements.txt

# Install Python packages
RUN pip install --no-cache-dir dlib==19.24.0 face_recognition==1.3.0 --prefer-binary

RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode aplikasi
COPY --chown=user . /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
