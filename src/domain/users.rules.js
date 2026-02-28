// Se verificarán las validaciones
// Se instala otra librería: npm i -D jest
// Agregar otro script en package.json: "test": "jest"

function validarUsuario({user, password, email, rol}) {

    // USER
  if (!user || typeof user !== 'string' || user === "") {
    return {ok: false, error: 'Usuario inválido'}
  } // CONTRASEÑA
  if (!password || typeof password !== 'string' || password === "") {
    return {ok: false, error: 'Contraseña inválido'}
  } // EMAIL
  if (!email || typeof email !== 'string' || email === "" || !email.includes('@')) {
    return {ok: false, error: 'Email inválido'}
  } // ROL
  if (!rol || typeof rol !== 'string' || rol === "" || !['admin','lector','autor'].includes(rol)) {
    return {ok: false, error: 'Rol inválido'}
  } 

  return {ok: true, data: {user, password, email, rol}};
}

module.exports = {validarUsuario}