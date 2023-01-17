

import { DataTypes } from 'sequelize';
import { db } from '../config/db.js'

                            // nombre tabla
const Message = db.define('messages', {

    message: {
        type: DataTypes.STRING(30),
        allowNull: false
    },

})



export default Message;