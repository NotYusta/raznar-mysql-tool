"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pterodactyL_egg_modification_1 = require("./src/pterodactyL_egg_modification");
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const env = dotenv_1.default.config();
if (env.error) {
    throw env.error;
}
const mysqlConnection = mysql2_1.default.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
});
(0, pterodactyL_egg_modification_1.startEggModification)(mysqlConnection);
