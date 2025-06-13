import axios from "axios";
import FormData from "form-data";

import fs from 'fs';

export async function faceRecognitionPrediction(
  name: string,
  imageFile: Express.Multer.File
): Promise<void> {
  try {
    if (!imageFile || !imageFile.path) {
      throw new Error("Image file is missing or invalid path.");
    }
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(imageFile.path);
    formData.append('image', fileBuffer, {
      filename: imageFile.originalname,
      contentType: imageFile.mimetype,
    });
    formData.append('name', name);

    await axios.post(
      process.env.FACERECOG_API_URL as string,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
  } catch (error) {
    throw error;
  }
}
