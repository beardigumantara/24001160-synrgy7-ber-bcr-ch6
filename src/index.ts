import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import carsRouter from './routes/car.routes';
import usersRouter from './routes/user.routes';
import knex from 'knex';
import { Model } from 'objection';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

dotenv.config();

const port = 8000;
const app = express();
const swaggerDocument = YAML.load('./openapi.yaml');

const knexInstance = knex({
  client: "postgresql",
  connection: {
    database: process.env.PG_DBASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASS, 
    port: Number(process.env.PG_PORT) ||5432
  }
});

Model.knex(knexInstance);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.status(200).json({
    message : 'Hello World!'});
});

app.use('/api/cars', carsRouter);
app.use('/api/users', usersRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
const server = http.createServer(app);
server.listen(port, () => {
  console.log('========= Connected to Server =========');
  console.log(`Server: running at http://localhost:${port}`);
});