// themeController.js
const Theme = require('../models/theme'); // Import your Theme model

// Create a new theme
async function createTheme(req, res) {
    try {
        const { name } = req.body;
        const theme = await Theme.createTheme(name);
        res.status(201).json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a theme', error });
    }
}

// Update an existing theme
async function updateTheme(req, res) {
    try {
        const themeId = req.params.themeId;
        const { name } = req.body;
        const updatedTheme = await Theme.updateTheme(themeId, name);
        if (!updatedTheme) {
            res.status(404).json({ message: 'Theme not found' });
        } else {
            res.status(200).json(updatedTheme);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the theme', error });
    }
}

// Remove a theme
async function removeTheme(req, res) {
    try {
        const themeId = req.params.themeId;
        const success = await Theme.removeTheme(themeId);
        if (!success) {
            res.status(404).json({ message: 'Theme not found' });
        } else {
            res.status(200).json({ message: 'Theme removed successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove the theme', error });
    }
}

module.exports = { createTheme, updateTheme, removeTheme };
