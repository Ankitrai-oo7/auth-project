import e from 'express';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { uploadImage,fetchImageController, deleteImageController} from '../controller/image-controller.js';
import { adminMiddleware } from '../middleware/admin-middleware.js';
import imageUploadMiddleware from '../middleware/image-upload-middleware.js';

const router = e.Router();
//upload the image
router.post('/upload',
        authMiddleware,
        adminMiddleware,
        imageUploadMiddleware.single('image'),
        uploadImage);

// get all the images

router.get('/fetch',authMiddleware,fetchImageController);
// delete route
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController);
export default router;