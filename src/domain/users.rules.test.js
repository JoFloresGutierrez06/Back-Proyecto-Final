// Pruebas para que las validaciones se cumplan
// Para las pruebas de despliegue de DevOps que revisan el código/aplicación para que estén libres de errores, puede ejecutarse el archivo .test y si está todo bien, entonces 

// Ejecutar 'npm test'

const {validarUsuario} = require('./users.rules')

// funcion de la librería jest. se pone qué se quiere probar
test('rechaza userName vacío', () => {
    const resultado = validarUsuario({user: '', password: '1234', email: 'email@example.com', rol: 'admin'})
    expect(resultado.ok).toBe(false)
})

test('rechaza password vacío', () => {
    const resultado = validarUsuario({user: 'admin', password: '', email: 'email@example.com', rol: 'admin'})
    expect(resultado.ok).toBe(false)
})

test('rechaza email vacío', () => {
    const resultado = validarUsuario({user: 'admin', password: '1234', email: '', rol: 'admin'})
    expect(resultado.ok).toBe(false)
})

test('rechaza email no válido (sin @)', () => {
    const resultado = validarUsuario({user: 'admin', password: '1234', email: 'emailinvalido', rol: 'admin'})
    expect(resultado.ok).toBe(false)
})
test('rechaza rol distino a admin, autor o lector', () => {
    const resultado = validarUsuario({user: 'admin', password: '1234', email: 'email@example.com', rol: 'invitado'})
    expect(resultado.ok).toBe(false)
})

test('rechaza user no string', () => {
    const resultado = validarUsuario({user: 123,  password: '1234', email: 'email@example.com', rol: 'admin', portada: 'http://portada.png'})

    expect(resultado.ok).toBe(false)
})
