

import { DataTypes } from 'sequelize';
import { db } from '../config/db.js'

                            // nombre tabla
const Category = db.define('categories', {

    title: {
        type: DataTypes.STRING(30),
        allowNull: false
    },

})



export default Category;