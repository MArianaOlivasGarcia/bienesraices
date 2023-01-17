
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const protectRoute = async(req, res, next) => {

    const { _accessToken } = req.cookies;

    if ( !_accessToken ) {
        return res.render('/auth/login')
    }

    try {

        const { id } = jwt.verify(_accessToken, process.env.JWT_SEED);

        const user = await User.scope('deletePassword').findByPk(id);

        if ( !user ) {
            return res.redirect('/auth/login')
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error)
        return res.clearCookie('_accessToken').redirect('/auth/login')
    }

}


export default protectRoute;