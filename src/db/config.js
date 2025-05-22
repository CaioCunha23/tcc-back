import dotenv from 'dotenv';
dotenv.config();

export default {
    development: {
        dialect: process.env.DB_DIALECT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST
    },
    production: {
        dialect: process.env.DB_DIALECT,
        username: process.env.DB_USER_PROD,
        password: process.env.DB_PASSWORD_PROD,
        database: process.env.DB_NAME_PROD,
        port: process.env.DB_PORT_PROD,
        host: process.env.DB_HOST_PROD
    }
}