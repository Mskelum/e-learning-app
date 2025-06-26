const express = require('express');
const connectDB = require('./config/config.db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect DB
connectDB();

app.use(cors()); 
app.use(express.json());

app.use('/api/auth', require('./routes/userRoute'));
app.use('/api', require('./routes/profileRoute'));;
app.use('/api/courses', require('./routes/courseRoute'));
app.use('/api/enrollment', require('./routes/enrollementRoute'));


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
