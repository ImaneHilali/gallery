const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const themeRouter = require('./routes/themeRouter'); 
const imageRoutes = require('./routes/imageRoutes');


app.use('/users', userRoutes);
app.use('/themes', themeRouter);
app.use('/images', imageRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
