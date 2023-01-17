
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

export const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});


export const dbConnection = async( ) => {
    try {
        await db.authenticate();
        // Sincronizar
        db.sync();
        console.log('Conexión exitosa a la Base de datos.')
    } catch (error) {
        console.log(error)
    }
}