import express from 'express';
import cors from 'cors';
import path from 'path';
import { corsOptions } from './config/cors';
import { errorHandler, notFound } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
