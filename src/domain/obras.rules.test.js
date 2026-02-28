// Pruebas para que las validaciones se cumplan

// Ejecutar 'npm test'

const {validarObra} = require('./obras.rules')

// funcion de la librería jest. se pone qué se quiere probar
test('rechaza titulo vacío', () => {
    const resultado = validarObra({titulo: '', autor: 'Autor', descripcion: 'Descripción', portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza autor vacío', () => {
    const resultado = validarObra({titulo: 'Título', autor: '', descripcion: 'Descripción', portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza descripcion vacía', () => {
    const resultado = validarObra({titulo: 'Título', autor: 'Autor', descripcion: '', portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza portada vacía', () => {
    const resultado = validarObra({titulo: 'Título', autor: 'Autor', descripcion: 'Descripción', portada: ''})

    expect(resultado.ok).toBe(false)
})

test('rechaza dato faltante', () => {
    const resultado = validarObra({autor: 'Autor', descripcion: 'Descripción', portada: 'https:portada.png'})

    expect(resultado.ok).toBe(false)
})

test('rechaza titulo no string', () => {
    const resultado = validarObra({titulo: 123, autor: 'Autor', descripcion: 'Descripción', portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza autor no string', () => {
    const resultado = validarObra({titulo: 'Título', autor: 123, descripcion: 'Descripción', portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza descripcion no string', () => {
    const resultado = validarObra({titulo: 'Título', autor: 'Autor', descripcion: 123, portada: 'https://portada.com'})

    expect(resultado.ok).toBe(false)
})

test('rechaza portada no string', () => {
    const resultado = validarObra({titulo: 'Título', autor: 'Autor', descripcion: 'Descripción', portada: 123})

    expect(resultado.ok).toBe(false)
})

// test('manda 250 si todo bien', () => {
//     const resultado = validarObra({titulo: 'Título', autor: 'Autor', descripcion: 'Descripción', portada: 'https://portada.com'})

//     expect(resultado.ok).toBe(true)
//     expect(resultado.data.autor).toBe(250);
// })

// test('convierte precio de string a numerico', () => {
//   const r = validarObra({ nombre: 'Mouse', precio: '250' });
//   expect(r.ok).toBe(true);
//   expect(r.data.precio).toBe(250);
// })
