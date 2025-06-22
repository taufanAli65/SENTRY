import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import cookieParser from 'cookie-parser';

import { connectDB } from './config/connection';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import itemRouter from './routes/item';
import ownerRouter from './routes/owner';
import scansRouter from './routes/scans';
import rackRouter from './routes/racks';
import WarehouseEntryRouter from './routes/warehouse_entries';
import { multerErrorHandler } from "./middleware/multer_error_handler";
import { globalErrorHandler } from "./utils/error_handler";
import path from 'path';

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/items', itemRouter);
app.use('/owner', ownerRouter);
app.use('/scans', scansRouter)
app.use('/rack', rackRouter);
app.use('/warehouse/entry', WarehouseEntryRouter);

app.use(multerErrorHandler);
app.use(globalErrorHandler)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database. Server not started.");
    process.exit(1);
});