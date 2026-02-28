const { ObrasRepository } = require('../repositories/obras.repository')
const { pool } = require('../db');

describe('Integration: ObrasRepository con DB real', () => {
    const repo =  new ObrasRepository();
    let obraId;

    test('Create obra en DB real', async () => {
        const created = await repo.create({titulo: 'Rosas en invierno', autor: 'Mirabel Estrada', descripcion: 'Poemario', portada: 'http://portada.png'});
        obraId = created.id // Aqui se guarda el id del producto creado

        expect(created).toBeTruthy() //El elemento existe, es nulo.
        expect(created.titulo).toBe('Rosas en invierno');
        expect(created.descripcion).toBe('Poemario');
        expect(created.portada).toBe('http://portada.png');
    });
    afterAll(async () => {
        await pool.query('delete from obras where id = $1', [obraId])
        // await pool.end();
    })  
});

describe('Integration: ObrasRepository con DB real', () => {
    const repo =  new ObrasRepository();
    let obraId;

    test('Create obra en DB real', async () => {
        const created = await repo.create({titulo: 'Rosas en invierno', autor: 'Mirabel Estrada', descripcion: 'Poemario', portada: 'http://portada.png'});
        obraId = created.id // Aqui se guarda el id del producto creado

        expect(created).toBeTruthy() //El elemento existe, es nulo.
        expect(created.titulo).toBe('Rosas en invierno');
        expect(created.descripcion).toBe('Poemario');
        expect(created.portada).toBe('http://portada.png');
    });
    afterAll(async () => {
        await pool.query('delete from obras where id = $1', [obraId])
        await pool.end();
    })  
});