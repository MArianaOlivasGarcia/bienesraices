


import multer from 'multer';
import path from 'path';
import { v4 as uuidV4 } from 'uuid'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {

        cb(null, uuidV4() + path.extname(file.originalname) ); // extname - Extensión de un archivo
    },
})


const upload = multer({ storage })


export default upload;