import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Property, Category, Price, Message, User } from "../models/index.js"

export const adminView = async(req, res) => {

    const { page } = req.query;

    if ( !/^[1-9]$/.test(page) ) {
        return res.redirect('/my-properties?page=1')
    }

    try {
        
        const { id } = req.user;

        const limit = 5;
        const offset = (page * limit) - limit;


        const [properties, totalResults] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where: { userid: id },
                include: [
                    { model: Category, as: 'category'},
                    { model: Price, as: 'price'},
                    { model: Message },
                ]
            }),
            Property.count({
                where: { userId: id }
            })
        ])

    
        res.render('properties/admin', {
            namePage: 'Mis Propiedades',
            csrfToken: req.csrfToken(),
            properties,
            currentPage: Number(page),
            totalResults,
            limit,
            offset,
            totalPages: Math.ceil(totalResults/limit)
        })

    } catch (error) {
        console.log(error)
    }

}



export const addView = async (req, res) => {

    // Obtener precios y categorias
    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
    ])


    res.render('properties/add', {
        namePage: 'Agregar propiedad',
        csrfToken: req.csrfToken(),
        categories, 
        prices,
        data: {}
    })
}



export const add = async (req, res) => {

    const result = validationResult(req)

    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
    ])

    if ( !result.isEmpty() ) {
        return res.render('properties/add', {
            namePage: 'Agregar propiedad',
            csrfToken: req.csrfToken(),
            categories, 
            prices,
            errors: result.array(),
            data: {...req.body}
        })
    }


    try {

        const { _csrf, price, category, ...data } = req.body;

        const property = await Property.create({
            ...data,
            priceId: price,
            categoryId: category,
            userId: req.user.id,
            image: ''
        })

        res.redirect(`/properties/add-image/${property.id}`)
        
    } catch (error) {
        console.log(error)
    }
 
}



export const addImageView = async (req, res) => {

    const { id } = req.params;

    // Validar que la propiedad exista.

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }


    // Validar que la propiedad no este publicada

    if ( property.show ) {
        return res.redirect('/my-properties')
    }

    // Validar que la propiedad pertenece al usuario
    if ( req.user.id != property.userId ) {
        return res.redirect('/my-properties')
    }


    res.render('properties/add-image',{
        namePage: `Agregar Imagen: ${property.title}`,
        csrfToken: req.csrfToken(),
        property
    })
}   



export const addImage = async (req, res, next) => {
    
    const { id } = req.params;

    // Validar que la propiedad exista.

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }


    // Validar que la propiedad no este publicada

    if ( property.show ) {
        return res.redirect('/my-properties')
    }

    // Validar que la propiedad pertenece al usuario
    if ( req.user.id != property.userId ) {
        return res.redirect('/my-properties')
    }

    // guardar en base de datos
    try {
        const { filename } = req.file;

        property.image = filename;
        property.show = 1;

        await property.save();

        next();

    } catch (error) {
        console.log(error)
    }
}





export const editView = async (req, res) => {


    const { id } = req.params;

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }


    // Revisar que la propiedad corresponde al usuario
    if ( property.userId !== req.user.id ) {
        return res.redirect('/my-properties')
    }

    // Obtener precios y categorias
    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
    ])


    res.render('properties/edit', {
        namePage: 'Editar propiedad',
        csrfToken: req.csrfToken(),
        categories, 
        prices,
        data: property
    })
}





export const edit = async (req, res) => {

    const { id } = req.params;

    const result = validationResult(req)

    const [ categories, prices ] = await Promise.all([
        Category.findAll(),
        Price.findAll(),
    ])

    const { category, price, ...rest } = req.body;

    if ( !result.isEmpty() ) {
        return res.render(`properties/edit`, {
            namePage: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categories, 
            prices,
            errors: result.array(),
            data: {
                ...rest,
                categoryId: category,
                priceId: price
            }
        })
    }

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }


    // Revisar que la propiedad corresponde al usuario
    if ( property.userId !== req.user.id ) {
        return res.redirect('/my-properties')
    }



    try {

        property.set({
            ...rest,
            categoryId: category,
            priceId: price
        })


        await property.save();

        res.redirect(`/my-properties`)
        
    } catch (error) {
        console.log(error)
    }
 
}


export const deleteProp = async( req, res ) => {

    const { id } = req.params;

    // Validar que la propiedad exista.

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }


    // Validar que la propiedad pertenece al usuario
    if ( req.user.id != property.userId ) {
        return res.redirect('/my-properties')
    }


    // Eliminar la imagen
    await unlink(`public/uploads/${property.image}`)

    // Eleminar
    await property.destroy();
    return res.redirect('/my-properties')


}



export const detailsView = async (req, res) => {

    const { id } = req.params;

    // Validar que la propiedad exista.

    const property = await Property.findByPk(id, { 
        include: [
            { model: Category, as: 'category'},
            { model: Price, as: 'price'} 
        ]
    });

    if ( !property || !property.show) {
        return res.redirect('/404')
    }   


    res.render('properties/details', {
        namePage: property.title,
        property,
        user: req.user,
        isSeller: req.user?.id == property.userId,
        csrfToken: req.csrfToken(),
    })

}




export const sendMessage = async( req, res ) => {


    const { id } = req.params;


    // Validar que la propiedad exista.

    const property = await Property.findByPk(id, { 
        include: [
            { model: Category, as: 'category'},
            { model: Price, as: 'price'} 
        ]
    });

    if ( !property ) {
        return res.redirect('/404')
    }   


    const result = validationResult(req)


    if ( !result.isEmpty() ) {
        
        res.render('properties/details', {
            namePage: property.title,
            property,
            user: req.user,
            isSeller: req.user?.id == property.userId,
            errors: result.array(),
            data: {...req.body},
            csrfToken: req.csrfToken(),
        })
            
    }


    const { message } = req.body;


    await Message.create({
        message,
        propertyId: req.params.id,
        userId: req.user.id
    })


    res.render('properties/details', {
        namePage: property.title,
        property,
        user: req.user,
        csrfToken: req.csrfToken(),
        isSeller: req.user?.id == property.userId,
        isSend: true
    })

}




export const messages = async(req, res) => {

    const { id } = req.params;


    // Validar que la propiedad exista.

    const property = await Property.findByPk(id, {
        include: [ { model: Message, include: [
            { model: User } 
        ] } ]
    });

    if ( !property ) {
        return res.redirect('/my-properties')
    }   

    // Validar que la propiedad pertenece al usuario
    if ( req.user.id != property.userId ) {
        return res.redirect('/my-properties')
    }


    res.render(`properties/messages`, {
        namePage: 'Mensajes',
        messages: property.messages,
        formatDate: ( date ) => {
            return new Date( new Date(date).toISOString().slice(0,10) ).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    })
    
}




export const changeStatus = async( req, res ) => {
   
    const { id } = req.params;

    const property = await Property.findByPk(id);

    if ( !property ) {
        return res.redirect('/my-properties')
    }   

    // Validar que la propiedad pertenece al usuario
    if ( req.user.id != property.userId ) {
        return res.redirect('/my-properties')
    }

    // Cambiar status
    property.show = !property.show;

    await property.save();

    res.json({
        statusProperty: property.show
    })
}