import mysql from 'mysql2/promise';

let connection: mysql.Connection;

const mysqlDb = {
    async init() {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'office_inventory',
            password: process.env.PASSWORD_MYSQL || '',
        });
    },

    getConnection() {
        return connection;
    }
};

export default mysqlDb;