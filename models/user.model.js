

import { DataTypes } from 'sequelize';
import { db } from '../config/db.js'
import bcrypt from 'bcrypt'

                            // nombre tabla
const User = db.define('users', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
    },
    isConfirm: {
        type: DataTypes.BOOLEAN,
    }

},{
    hooks: {
        beforeCreate: async function( user ) {
            const salt = await bcrypt.genSaltSync(10);
            user.password = await bcrypt.hashSync( user.password, salt )
        }
    },
    scopes: {
        deletePassword: {
            attributes: {
                exclude: ['password', 'token', 'isConfirm', 'createdAt', 'updatedAt']
            }
        }
    }
})


User.prototype.verifyPassword = function( password ) {
    return bcrypt.compareSync(password, this.password)
}


export default User;