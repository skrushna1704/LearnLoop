import { Router } from 'express';
import { getAllUsers, getUserSkills, uploadProfilePicture, removeProfilePicture } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', authenticate, getAllUsers);
router.get('/:userId/skills', authenticate, getUserSkills);
router.post('/profile-picture', authenticate, upload.single('image'), uploadProfilePicture);
router.delete('/profile-picture', authenticate, removeProfilePicture);

export default router; 