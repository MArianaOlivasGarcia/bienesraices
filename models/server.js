

import express, { urlencoded }  from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import cookieParser from 'cookie-parser'
import { dbConnection } from '../config/db.js';
import csrf from 'csurf';

// Rutas
import propertiesRoutes from '../routes/properties.routes.js'
import authRoutes from '../routes/auth.routes.js'
import appRoutes from '../routes/app.routes.js'
import apiRoutes from '../routes/api.routes.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

class Server {

    constructor() {
        this.app = express();;
        this.port = process.env.PORT || 3000;

        // Conectar a DB
        dbConnection();
    }

    setters() {
         // Habilitar Pug
         this.app.set('view engine', 'pug');
         this.app.set('views', './views');

    }


    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        // CORS
        this.app.use( cors() );

        // Paseo del body
        // this.app.use( express.json() );
        
        // Habilitar lectura de datos de formularios
        this.app.use( urlencoded({extended: false}) );

        // Habilitar Cookie Parser
        this.app.use( cookieParser() );

        // Habilitar csurf
        // this.app.use( csurf({cookie: true}) )
        this.csrf = csrf({ cookie: true });


        this.app.use( '/', this.csrf, appRoutes);
        this.app.use( '/', this.csrf, propertiesRoutes);
        this.app.use( '/auth', this.csrf, authRoutes);
        this.app.use( '/api', this.csrf, apiRoutes);


    }


    execute() {

        this.setters();

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar Server
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port );
        })
    }

}


export default Server;