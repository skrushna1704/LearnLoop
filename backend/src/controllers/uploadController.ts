import { Request, Response } from 'express';
import { uploadFileToS3 } from '../utils/s3';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  try {
    const url = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    res.json({ url });
  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
}; 