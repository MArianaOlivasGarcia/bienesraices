
import User from '../models/user.model.js'
import { check, validationResult } from 'express-validator'
import { v4 as uuidv4 }  from 'uuid';
import bcrypt from 'bcrypt'
import { emailRegister, emailForgetPassword} from '../helpers/email.helper.js';
import { generedJWT } from '../helpers/jwt.helper.js'


export const loginView = (req, res) => {

    return res.render('auth/login', {
        namePage: 'Iniciar sesión',
        csrfToken: req.csrfToken()
    })

}


export const login = async(req, res) => {

    await check('email', 'El campo "email" es no es válido.').isEmail().run(req)
    await check('password', 'El campo "password" es requerido.').not().isEmpty().run(req)

    const errores = validationResult( req );

    if ( !errores.isEmpty() ) {
        return res.render('auth/login', {
            namePage: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: errores.array(),
        })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } })

    if ( !user ) {
        return res.render('auth/login', {
            namePage: 'Iniciar sesión',
            errors: [{ msg: `El usuario no existe` }],
            csrfToken: req.csrfToken(),
        })
    }

    if ( !user.isConfirm ) {
        return res.render('auth/login', {
            namePage: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Tu cuenta no ha sido confirmada.'}],
        })
    }


    if ( !user.verifyPassword(password) ) {
        return res.render('auth/login', {
            namePage: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Tu contraseña no es correcta.'}],
        })
    }

    const accessToken = await generedJWT(user.id)

    // Almacenar en una cookie

    return res.cookie('_accessToken', accessToken, {
        httpOnly: true,
    }).redirect('/my-properties')


}


export const registerView = (req, res) => {
    
    return res.render('auth/register', {
        namePage: 'Registrate',
        csrfToken: req.csrfToken()
    })

}


export const register = async (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    await check('name', 'El campo "name" es requerido.').not().isEmpty().run(req)
    await check('email', 'El campo "email" es no es válido.').isEmail().run(req)
    await check('password', 'El campo "password" es requerido.').not().isEmpty().run(req)
    await check('confirmPassword', 'El campo "confirmPassword" es requerido.').not().isEmpty().run(req)
    await check('confirmPassword', 'Las contraseñas no coinciden').equals(password).run(req)


    const errores = validationResult( req );

    if ( !errores.isEmpty() ) {
        return res.render('auth/register', {
            namePage: 'Registrate',
            csrfToken: req.csrfToken(),
            errors: errores.array(),
            user: { 
                name, 
                email, 
                password, 
                confirmPassword 
            }
        })
    }

    const userdb = await User.findOne({ where: { email } })

    if ( userdb ) {
        return res.render('auth/register', {
            namePage: 'Registrate',
            errors: [{ msg: `Ya existe un usuario con el correo electrónico ${email}` }],
            csrfToken: req.csrfToken(),
            user: { 
                name, 
                email, 
                password, 
                confirmPassword 
            }
        })
    }

    const user = await User.create({ name, email, password, confirmPassword, token: uuidv4(), isConfirm: false });

    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    })

    return res.render('templates/message',{
        namePage: 'Cuenta creada correctamente',
        message: 'Te hemos enviado un correo electrónico de confirmación. Da clic en el enlace.'
    })

}


export const forgetPasswordView = (req, res) => {
    return res.render('auth/forget-password', {
        namePage: 'Recuperar tu acceso a Bienes Raices',
        csrfToken: req.csrfToken(),
    })
}


export const forgetPassword = async(req, res) => {
    
    const { email } = req.body;

    await check('email', 'El campo "email" es no es válido.').isEmail().run(req)
    
    const errores = validationResult( req );
    
    if ( !errores.isEmpty() ) {
        return res.render('auth/forget-password', {
            namePage: 'Recuperar tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: errores.array(),
            email
        })
    }

    const user = await User.findOne({ where: {email} })

    if ( !user ) {
        return res.render('auth/forget-password', {
            namePage: 'Recuperar tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'No existe un usuario con ese correo electrónico'}],
            email
        })
    }

    // Generar token
    user.token = uuidv4();
    await user.save();

    // Enviar email
    emailForgetPassword({
        name: user.name,
        email: user.email,
        token: user.token
    })

    return res.render('templates/message',{
        namePage: 'Restablece tu contraseña',
        message: 'Te hemos enviado un correo electrónico para restablecer tu contraseña. Da clic en el enlace.'
    })

}


export const validateTokenView = async(req, res) => {
    
    const { token } = req.params;

    const user = await User.findOne({ where: { token }});

    if ( !user ) {
        return res.render('auth/confirm-register', {
            namePage: 'Restablece tu contraseña',
            message: 'Hubo un error al validar tu inforamción, intentalo de nuevo.',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        namePage: 'Restablece tu contraseña',
        csrfToken: req.csrfToken(),
    })


}


export const newPassword = async(req, res) => {

    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de almenos 6 caracteres').run(req)

     
    const errores = validationResult( req );
    
    if ( !errores.isEmpty() ) {
        return res.render('auth/reset-password', {
            namePage: 'Restablece tu contraseña',
            csrfToken: req.csrfToken(),
            errors: errores.array(),
        })
    }


    const { token } = req.params;

    const { password } = req.body;

    const user = await User.findOne({ where: { token } });

    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hashSync( password, salt );
    user.token = null;
    await user.save();

    return res.render('auth/confirm-register', {
        namePage: 'Contraseña restablecida con éxito',
        message: 'Tu contraseña se actualizó con éxito',
    })

}



export const confirm = async(req, res) => {

    const { token } = req.params;

    const user = await User.findOne({ where: { token }})

    if ( !user ) {
        return res.render('auth/confirm-register', {
            namePage: 'Error al confirmar tu cuenta',
            message: 'Hubo un error al confirmar tu cuenta, intentalo de nuevo.',
            error: true
        })
    }

    // Confirmar la cuenta del usuario
    user.token = null;
    user.isConfirm = true;
    await user.save();
    
    return res.render('auth/confirm-register', {
        namePage: 'Cuenta confirmada con éxito',
        message: 'Tu cuenta fue confirmada con éxito',
    })

}





export const logOut = (req, res) => {

    res.clearCookie('_accessToken').status(200).redirect('/auth/login')

}