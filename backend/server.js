const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/client', require('./routes/clientRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Add admin routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Server started on port ${PORT}`)
);
