const bcrypt = require('bcryptjs')
const { UsersRepository } = require('../repositories/users.repository')
const { pool } = require('../db');

describe('Integration: UsersRepository con DB real - Rechazar usuario repetido', () => {
    const repo =  new UsersRepository();
    let userId;

    test('Rechaza usuario repetido', async () => {
        await expect(
            repo.create({
            user: 'kyra',
            passwordHash: '1234',
            email: 'admin@example.com',
            rol: 'admin'
            })
        ).rejects.toThrow(/duplicate key/);
    });

    // afterAll(async () => {
    //     await pool.query('delete from users where id = $1', [userId])
    //     // await pool.end();
    // })  
});
describe('Integration: UsersRepository con DB real (sin encriptación de contraseña)', () => {
    const repo =  new UsersRepository();
    let userId;

    test('Create guarda en DB real', async () => {
        const created = await repo.create({user: 'admin1', passwordHash: '1234', email: 'admin@example.com', rol: 'admin'});
        userId = created.id // Aqui se guarda el id del producto creado

        expect(created).toBeTruthy() //El elemento existe, es nulo.
        expect(created.user).toBe('admin1');
        expect(created.email).toBe('admin@example.com');
        expect(created.rol).toBe('admin');
        // expect(Number(created.precio)).toBeCloseTo(2000) // Number() a veeeceees se le va a supabase mandar numeros como string. Así te aseguras que sea número
    });

    afterAll(async () => {
        await pool.query('delete from users where id = $1', [userId])
        // await pool.end();
    })  
});

describe('Integration: UsersRepository con DB real', () => {
  const repo = new UsersRepository();
  let userId;

  test('Create guarda en DB real con hash', async () => {
    const passwordHash = await bcrypt.hash('1234', 10);

    const created = await repo.create({
      user: 'admin1',
      passwordHash,
      email: 'admin1@example.com',
      rol: 'admin'
    });

    userId = created.id;

    expect(created).toBeTruthy();
    expect(created.user).toBe('admin1');
    expect(created.email).toBe('admin1@example.com');
    expect(created.rol).toBe('admin');
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });
});
