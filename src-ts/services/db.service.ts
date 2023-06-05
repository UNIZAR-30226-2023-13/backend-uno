import { Connection } from "mysql2/promise";

import mysql = require("mysql2/promise");
import dbConfig = require("../configs/db.config");
import { ConnectionOptions } from "mysql2/promise";

let db: Connection | null = null;

export async function obtenerDb(): Promise<Connection> {
    if (!db) {
        db = await mysql.createConnection(dbConfig as ConnectionOptions);
        console.log("Abro conexión con la base de datos");
    }
    if (db) {
        return db;
    }
    return {} as Connection;
}
