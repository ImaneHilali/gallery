const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gallery',
});

connection.connect();

class Theme {
    static createTheme(name, callback) {
        const query = 'INSERT INTO themes (name) VALUES (?)';
        connection.query(query, [name], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.insertId);
            }
        });
    }

    static getThemes(callback) {
        const query = 'SELECT * FROM themes';
        connection.query(query, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results);
            }
        });
    }

    static getThemeById(themeId, callback) {
        const query = 'SELECT * FROM themes WHERE id = ?';
        connection.query(query, [themeId], (error, results) => {
            if (error) {
                callback(error, null);
            } else if (results.length === 0) {
                callback(null, null);
            } else {
                callback(null, results[0]);
            }
        });
    }

    static updateTheme(themeId, name, callback) {
        const query = 'UPDATE themes SET name = ? WHERE id = ?';
        connection.query(query, [name, themeId], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.affectedRows > 0);
            }
        });
    }

    static deleteTheme(themeId, callback) {
        const query = 'DELETE FROM themes WHERE id = ?';
        connection.query(query, [themeId], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.affectedRows > 0);
            }
        });
    }
}

module.exports = Theme;
