const Image = require('../models/image');
const fs = require('fs');

function uploadImage(req, res) {
   // const userId = req.user.id; // normally its should be like that, but i did add the userId in the req body to test it in postman 
    const { userId, description, themeId} = req.body;  
 
    if (!req.file || !description || themeId === undefined) {
        return res.status(400).json({ message: 'Missing required data' });
    }
    if (req.file.isEmpty) {
        return res.status(400).json({ message: 'Please upload a file' });
      }

    const fileName = req.file.filename;


    Image.createImage(userId, fileName, description, themeId, (dbError, imageId) => {
        if (dbError) {
            return res.status(500).json({ message: 'Failed to save image details to the database' });
        }
        return res.status(201).json({ message: 'Image uploaded successfully', imageId });
    });
}

function downloadImage(req, res) {
    const imageId = req.params.imageId;
 
    Image.getImageById(imageId, (error, image) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to fetch image' });
        }
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        const fileName = image.file_name;


        if (!fileName) {
            return res.status(400).json({ message: 'Image file name is missing or invalid' });
        }
         

        const sourcePath = `C:\\gallery_app\\uploads\\${fileName}`;
        
        const destinationPath = `C:\\gallery_app\\download\\${fileName}`;
 
        fs.copyFile(sourcePath, destinationPath, (copyError) => {
            if (copyError) {
                return res.status(500).json({ message: 'Failed to copy image' });
            }
            
            res.sendFile(destinationPath);
        });
    });
}

function deleteImage(req, res) {
    const imageId = req.params.imageId; 

    Image.deleteImage(imageId, (error, success) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to delete image' });
        }
        if (!success) {
            return res.status(404).json({ message: 'Image not found' });
        }
        return res.status(200).json({ message: 'Image deleted successfully' });
    });
}

module.exports = { uploadImage, downloadImage, deleteImage };
