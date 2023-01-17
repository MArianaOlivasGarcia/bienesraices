
import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Mariana Olivas',
        email: 'olivasgarcia031096@gmail.com',
        isConfirm: 1,
        password: bcrypt.hashSync('aA1234567!', 10)
    }
]



export default users;