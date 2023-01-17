
import { db } from '../config/db.js';

import { Category, Price, User } from '../models/index.js'

import categories from './categories.js';
import prices from './prices.js';
import users from './users.js';


const runSeed = async () => {


    try {

        await db.authenticate();

        await db.sync();

        // Insertamos los datos
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users),
        ])

        console.log('Datos importados correctamente!')
        process.exit()

        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}




const deleteData = async () => {

    try {
        // await Promise.all([
        //     Category.destroy({ where:{}, truncate: true }),
        //     Price.destroy({ where:{}, truncate: true })
        // ])
        await db.sync({force: true})
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}



if ( process.argv[2] == '-i' ) {
    runSeed()
}

if ( process.argv[2] == '-d' ) {
    deleteData()
}