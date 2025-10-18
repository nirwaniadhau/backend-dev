import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { DB_NAME } from './constants.js';
import app from './app.js';   // ✅ Import the app with routes and middleware

dotenv.config();

connectDB()
.then(() => {
    app.on('error', (err) => {
        console.error("Server error:", err);
        process.exit(1);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Connected to DB "${DB_NAME}" and server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("❌ Failed to connect to the database:", err);
    process.exit(1);
});
