import { Property, Category, Price } from "../models/index.js"



export const getProperties = async( req, res ) => {

    const properties = await Property.findAll({
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' },
        ],
        attributes: { exclude: ['categoryId', 'priceId'] }
    })


    res.status(200).json({
        status: true,
        properties
    })

}