import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/connection';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import { globalErrorHandler } from './utils/error_handler';

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(globalErrorHandler)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database. Server not started.");
    process.exit(1);
});