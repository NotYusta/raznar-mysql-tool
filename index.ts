import { startEggModification } from "./src/pterodactyL_egg_modification";
import mysql from 'mysql2';
import dotenv from 'dotenv';
const env = dotenv.config();
if(env.error) {
  throw env.error;
}

const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DBNAME,
  port: parseInt(process.env.MYSQL_PORT || "3306"),
})

startEggModification(mysqlConnection);