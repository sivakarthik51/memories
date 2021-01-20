import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();
app.use(cors());


app.use(bodyParser.json({ limit: '30mb', extended:true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended:true}));

app.use('/posts',postRoutes);
app.use('/users',userRoutes);

const CONNECTION_URL= process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false})
    .then(() => app.listen(PORT, () => console.log(`Server Running on port ${PORT}`)))
    .catch((error) => console.error(error.message));
