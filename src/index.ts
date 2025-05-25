import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
// import * as passport from 'passport';
// import './../src/app/utils/cron_jobs';
require('express-async-errors');
import { errorHandler, requestLogger } from './app/middleware';
// import { environment } from './environments/environment';
import router from './app/routes';
// import './app/connections/firebase';
// import upload from 'express-fileupload';
import session from 'express-session';
// import * as swaggerUI from 'swagger-ui-express';
// import * as swaggerJsDoc from 'swagger-jsdoc';
// import { consumer, producer } from './app/rabbitmq';
import './app/connection/mongodb';
import dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const app: express.Application = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/videos', express.static(path.join(process.cwd(), 'videos')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(upload());
app.use(cors({
  origin: true,

  credentials: true
}));
// const corsOptions = 

// Use CORS middleware with specified options
// app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(requestLogger);

app.use(session({

  secret: 'somethingsecretgoeshere',
  resave: false,
  saveUninitialized: false
}));


app.use('/api', router);

app.use(errorHandler);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);