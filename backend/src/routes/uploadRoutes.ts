import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticate, upload.single('file'), uploadFile);

export default router; 