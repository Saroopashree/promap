import { MongoClient } from "mongodb";
const dotenv = require("dotenv");

dotenv.config();

const MONGO_PROTOCOL = process.env.MONGO_PROTOCOL;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_DATABASE = process.env.MONGO_DATABASE;
const MONGO_RETRY_WRITES = process.env.MONGO_RETRY_WRITES;

export default new MongoClient(
  `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=${MONGO_RETRY_WRITES}`
);
