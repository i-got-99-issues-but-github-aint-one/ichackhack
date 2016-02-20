import express from 'express';
import * as middleware from './middleware';
import handlers from './handlers';

const app = express();
export default app;

app.use(middleware.types);
app.use(middleware.body);
app.use('/1', handlers);
app.use(middleware.notFound);
app.use(middleware.error);
