


import { Router } from 'express';
// Controladores
import { categories, home, notPageFound, search } from '../controllers/app.controllers.js';

const router = Router();

router.get('/', home );

router.get('/category/:id', categories );

router.get('/404', notPageFound );

router.post('/search', search );

export default router;