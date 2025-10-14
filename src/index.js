import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { DB_NAME } from './constants.js';

const app = express();
dotenv.config();
connectDB()
.then(()=>{
    app.on('error', (err) => {
        console.error("Server error:", err);
        process.exit(1);
    });

    app.listen(3000);
    console.log("Connected to the database and server is running on port 3000");
})
.catch(err => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
}
);




