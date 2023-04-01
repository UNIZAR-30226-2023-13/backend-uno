const env = process.env;

const db = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME || 'uno_db',
    port: env.DB_PORT || 3306,
};

module.exports = db;
