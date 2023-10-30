// models/image.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery',
});

connection.connect();

class Image {
    static createImage(userId, fileName, description,theme_id, callback) {
        const query = 'INSERT INTO images (user_id, file_name, description,theme_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [userId, fileName, description, theme_id], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.insertId);
            }
        });
    }

    static getImagesByUser(userId, callback) {
        const query = 'SELECT * FROM images WHERE user_id = ?';
        connection.query(query, [userId], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    }

    static getImageById(imageId, callback) {
        const query = 'SELECT * FROM images WHERE id = ?';
        connection.query(query, [imageId], (error, results) => {
            if (error) {
                callback(error, null);
            } else if (results.length === 0) {
                callback(null, null);
            } else {
                callback(null, results[0]);
            }
        });
    }

    static deleteImage(imageId, callback) {
        const query = 'DELETE FROM images WHERE id = ?';
        connection.query(query, [imageId], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.affectedRows > 0);
            }
        });
    }
}

module.exports = Image;
