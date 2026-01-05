const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// MIDDLEWARES
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/shop', require('./routes/shop'));

app.get('/', (req, res) => {
  res.send('Gramika API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));