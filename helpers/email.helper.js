
import nodemailer from 'nodemailer';

export const emailRegister = async({ name, email, token }) => {
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

   
    await transport.sendMail({
        from: 'bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta en Bienesraices.com',
        text: 'Confirma tu cuenta en Bieneraices.com',
        html: `
            <p>Hola ${name}, comprueba tu cuenta en Bienesraices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.URL_SERVER}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a></p>

            <p>Si no solicitó este correo electrónico, puede ignorarlo con seguridad.</p>
        `
    })

}







export const emailForgetPassword = async({ name, email, token }) => {
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    console.log('Enviando correo', { name, email, token })
   
    await transport.sendMail({
        from: 'bienesraices.com',
        to: email,
        subject: 'Restablece tu contraseña en Bienesraices.com',
        text: 'Restablece tu contraseña en Bieneraices.com',
        html: `
            <p>Hola ${name}, has solicitado restablecer tu contraseña en Bienesraices.com</p>

            <p>Da clic en el siguiente enlace para generar una contraseña nueva: 
            <a href="${process.env.URL_SERVER}:${process.env.PORT ?? 3000}/auth/forget-password/${token}">Restablecer contraseña</a></p>

            <p>Si no solicitó este correo electrónico, puede ignorarlo con seguridad.</p>
        `
    })

}