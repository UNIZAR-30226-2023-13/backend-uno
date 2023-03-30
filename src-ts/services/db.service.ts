import { Connection } from "mysql";

const mysql = require('mysql2/promise');
const dbConfig = require('../configs/db.config');

export const db : Connection = mysql.createConnection(dbConfig);
