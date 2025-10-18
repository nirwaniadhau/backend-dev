import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';

const app = express();

// CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Static and body parsers
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // ✅ only once

app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoute);

export default app;
