import { Router } from 'express';
// Controladores
import { loginView, 
        login,
        registerView, 
        register,
        forgetPasswordView, 
        forgetPassword,
        validateTokenView,
        newPassword,
        confirm, 
logOut} from '../controllers/auth.controllers.js';

const router = Router();


router.get('/login', loginView );
router.post('/login', login );
router.post('/logout', logOut );

router.get('/register', registerView );
router.post('/register', register );

router.get('/confirm/:token', confirm );

router.get('/forget-password', forgetPasswordView );
router.post('/forget-password', forgetPassword );
// Almacenar nuevo password
router.get('/forget-password/:token', validateTokenView );
router.post('/forget-password/:token', newPassword );


export default router;