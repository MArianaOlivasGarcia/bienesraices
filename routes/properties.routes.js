import { Router } from 'express';
import { check } from 'express-validator';
import protectRoute from '../middlewares/protect-route.middleware.js'
// Controladores
import { adminView, 
        addView, 
        add, 
        addImageView, 
        addImage, 
        editView, 
        edit, 
        deleteProp,
        detailsView, 
        sendMessage,
        messages,
changeStatus} from '../controllers/properties.controllers.js';
import upload from '../middlewares/uploadFile.middleware.js';
import isAuthenticated from '../middlewares/is-authenticated.middleware.js';

const router = Router();


router.get('/my-properties', [ protectRoute ], adminView );
router.get('/properties/add', [ protectRoute ], addView );
router.post('/properties/add', [
    protectRoute,
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('description', 'La descripción requiere máximo 10 caracteres.').isLength({max: 200}),
    check('category', 'La categoría es requerida.').isNumeric(),
    check('price', 'El precio es requerido.').isNumeric(),
    check('bedrooms', 'La cantidad de habitaciones es requerida.').isNumeric(),
    check('parkings', 'La cantidad de estacionamientos es requerida.').isNumeric(),
    check('bathrooms', 'La cantidad de baños es requerida.').isNumeric(),
], add );



router.get('/properties/add-image/:id', protectRoute, addImageView)
router.post('/properties/add-image/:id', 
    protectRoute, 
    upload.single('fileImage'),
    addImage
)

router.get('/properties/edit/:id', [ protectRoute ], editView );
router.post('/properties/edit/:id', [
    protectRoute,
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('description', 'La descripción requiere máximo 10 caracteres.').isLength({max: 200}),
    check('category', 'La categoría es requerida.').isNumeric(),
    check('price', 'El precio es requerido.').isNumeric(),
    check('bedrooms', 'La cantidad de habitaciones es requerida.').isNumeric(),
    check('parkings', 'La cantidad de estacionamientos es requerida.').isNumeric(),
    check('bathrooms', 'La cantidad de baños es requerida.').isNumeric(),
], edit );


router.post('/properties/delete/:id', [protectRoute], deleteProp)

router.get('/property/details/:id', [isAuthenticated] ,detailsView)
router.post('/property/details/:id', [
        isAuthenticated,
        check('message', 'El mensaje es requerido').not().isEmpty(),
        check('message', 'El mensaje requiere almenos 10 caracteres.').isLength({min: 10}),
    ],
    sendMessage)


router.get('/property/messages/:id', [protectRoute], messages)



router.put('/property/status/:id', [protectRoute], changeStatus)


export default router;