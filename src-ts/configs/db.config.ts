import { ConnectionOptions } from "mysql2";

const env = process.env;

let port: number = {} as number;
if (env.DB_PORT) {
    port = JSON.parse(env.DB_PORT);
}

export const db: ConnectionOptions = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME || "uno_db",
    port: port || 3306,
};
