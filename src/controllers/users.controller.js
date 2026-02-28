const bcrypt = require('bcryptjs')
const { sign } = require('../auth');
const { UsersRepository } = require('../repositories/users.repository');
const { validarUsuario } = require('../domain/users.rules');

const repo = new UsersRepository();

async function loginUser(req, res) {
    const {user, password} = req.body;

    
    if (!user || !password) {
        return res.status(400).json({error: 'Faltan campos requeridos'});
    }
    const usuario = await repo.findByUser(user);
    
    if (!usuario) {
        return res.status(401).json({error: 'Credenciales incorrectas'}); // No aportar mucha info
    }
    
    const ok = await bcrypt.compare(password, usuario.password_hash);
    
    if (!ok) {
        return res.status(401).json({error: 'Credenciales incorretas'});
    }
    
    const token = sign({
        id: usuario.id,
        user: usuario.user,
        rol: usuario.rol
    });
    
    return res.json({ token });
}

async function create(req, res) {
    const {user, password, email, rol} = req.body;

    const respuesta = validarUsuario({user, password, email, rol});
    
    if (respuesta.error) { return res.status(400).json(respuesta.error); }

    // Comparar si el usuario ya existe
    const existe = await repo.findByUser(user)
    if (existe !== null) {
        return res.status(400).json({error: 'Nombre de usuario no disponible.'})
    }

    let passwordHash = await bcrypt.hash(password, 10); // el 10 indica qué tan compleja la encriptacion
    
    // console.log(passwordHash)
    // const comparacion = await bcrypt.compare(password, passwordHash)
    // console.log(comparacion)

    // console.log(respuesta.data)
    const usuario = await repo.create({user: respuesta.data.user, passwordHash: passwordHash, email: respuesta.data.email, rol: respuesta.data.rol});

    return res.status(201).json({ok: true, user: usuario});
}

module.exports = { loginUser, create }