const express = require('express');
const multer = require('multer'); 
const authenticate = require('../middlewares/authentificationMiddleware');
const imageController = require('../controllers/imageController');
const router = express.Router();


// Set up the storage engine 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
 
        callback(null, 'C:\\gallery_app\\uploads\\'); 
    },
    filename: (req, file, callback) => {

        callback(null, Date.now() + '-' + file.originalname); 
    },
});
 
 
// Initialize the multer middleware with the storage engine and the image filter function 
const upload = multer({ storage: storage });
 

// Protect the image routes with authentication middleware
router.use(authenticate);


// Route for uploading an image
router.post('/upload', upload.single('file'), imageController.uploadImage); 


// Route for downloading an image
router.get('/download/:imageId', imageController.downloadImage);


// Route for deleting an image
router.delete('/delete/:imageId', imageController.deleteImage);


module.exports = router;