const { pool } = require('../db')

class UsersRepository {

    async findByUser(user) {  // Encontrar usuario por el nombre de usuario
        const r = await pool.query(
            'select id,"user",email,password_hash,rol from users where "user" = $1', [user]
        );
        return r.rows[0] || null;
    }

    async create({user, passwordHash, email, rol}) {    // Crear un nuevo usuario 
        const r = await pool.query(
            'insert into users ("user", password_hash, email, rol) values ($1, $2, $3, $4) returning id,"user",email,rol', [user, passwordHash, email, rol]
        );
        return r.rows[0];
    }

    async findById(id) {    // Encontrar usuario por el id  
        const r = pool.query(
            'select id,"user", email, rol from users where id = $1', [id]
        );
        return r.rows[0] || null;
    }
}

module.exports = { UsersRepository }