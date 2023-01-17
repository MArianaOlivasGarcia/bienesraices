

import { DataTypes } from 'sequelize';
import { db } from '../config/db.js'

                            // nombre tabla
const Property = db.define('properties', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // category: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // price: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parkings: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    show: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
})



export default Property;