
import { Sequelize } from 'sequelize'
import { Property, Category, Price } from "../models/index.js"


export const home = async (req, res) => {


    const [ categories, prices, casas, deptos ] = await Promise.all([
        Category.findAll({ raw: true }),
        Price.findAll({ raw: true }),
        Property.findAll({
            limit: 3,
            where: { categoryId: 1 },
            include: [ { model: Price, as: 'price' } ],
            order: [['createdAt', 'DESC']]
        }),
        Property.findAll({
            limit: 3,
            where: { categoryId: 2 },
            include: [ { model: Price, as: 'price' } ],
            order: [['createdAt', 'DESC']]
        })
    ])


    res.render('home', {
        namePage: 'Inicio',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        casas,
        deptos
    })
}




export const categories = async (req, res) => {

    const { id } = req.params;

    const category = await Category.findByPk(id);

    if ( !category )  {
        return res.redirect('/404')
    }

    const properties = await Property.findAll({
        where: { categoryId: id },
        include: [ { model: Price, as: 'price' } ]
    })


    res.render('category', {
        namePage: `${category.title}s en venta`,
        csrfToken: req.csrfToken(),
        properties
    })

}




export const notPageFound = async (req, res) => {


    res.render('404', {
        namePage: '404 Recurso no encontrado',
        csrfToken: req.csrfToken(),
    })

}




export const search = async (req, res) => {

    const { search } = req.body;

    if ( !search.trim() ) {
        return res.redirect('back')
    }

    const properties = await Property.findAll({
        where: { 
            title: {
                [Sequelize.Op.like]: '%' + search + '%'
            }
        },
        include: [
            { model: Price, as: 'price' }
        ]
    })

    res.render('search', {
        namePage: 'Resultados de la búsqueda',
        csrfToken: req.csrfToken(),
        properties
    })

}