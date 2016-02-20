import express from 'express';
import * as middleware from './middleware';
import handlers from './handlers';

const app = express();
export default app;

app.use(middleware.cookies);
app.use(middleware.body);
app.use(middleware.auth);
app.use(handlers);
app.use(middleware.notFound);
app.use(middleware.error);
