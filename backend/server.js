const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:5000'
        ],
    }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Material System API Server is running!');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/additional-services', require('./routes/additionalServiceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Material System API',
            version: '1.0.0',
            description: 'API Documentation for Material Service'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(PORT, () => 
  console.log(`Server started on port ${PORT}`)
);
