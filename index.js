const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db/config');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const bmSonsUserRoutes = require('./routes/bmSonsUserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/CartRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes);
app.use('/', bmSonsUserRoutes);
app.use('/', adminRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
