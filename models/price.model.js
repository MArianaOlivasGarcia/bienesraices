
    


import { DataTypes } from 'sequelize';
import { db } from '../config/db.js'

                            // nombre tabla
const Price = db.define('prices', {

    title: {
        type: DataTypes.STRING(30),
        allowNull: false
    },

})



export default Price;