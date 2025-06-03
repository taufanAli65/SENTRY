import express from 'express';
import * as dotenv from 'dotenv';

import indexRouter from './routes/index';

const app = express();
dotenv.config();

const port = process.env.PORT

app.use(express.json());
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});