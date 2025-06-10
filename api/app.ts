import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/connection';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import itemRouter from './routes/items';
import scanRouter from './routes/scans';
import rackRouter from './routes/racks';
import WarehouseEntryRouter from './routes/warehouse_entries';
import { globalErrorHandler } from './utils/error_handler';

const app = express();

const port = process.env.PORT

app.use(express.json());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/item', itemRouter);
app.use('/scan', scanRouter);
app.use('/rack', rackRouter);
app.use('/warehouse/entry', WarehouseEntryRouter);
app.use(globalErrorHandler)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database. Server not started.");
    process.exit(1);
});