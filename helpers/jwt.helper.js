


import jwt from 'jsonwebtoken';


export const generedJWT = ( id ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { id };

        jwt.sign( payload, process.env.JWT_SEED, {
            expiresIn: '4h'
        }, ( err, accessToken ) => {

            if ( err ) {
                console.log(err)
                reject('No se pudo generar el jsonwebtoken');
            }

            resolve( accessToken );
        })

    });

}
