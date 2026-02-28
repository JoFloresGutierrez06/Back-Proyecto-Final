const {pool} = require('../db');

class ObrasRepository {

    async getAll() {            // Mostrar todas las obras (Autor - Admin) 
        const result = await pool.query(
        'select id,titulo,autor,descripcion,portada,publicado from obras order by id asc;'
        );
        return result.rows;
    }
  
    async getAllPublish() {     // Mostrar obras publicadas (Lector - Admin)
        const result = await pool.query(
        'select id,titulo,autor,descripcion,portada from obras where publicado = true order by id asc;'
        );
        return result.rows;
    }

    async getById(id) {         // Mostrar obra por id (Admin)
        const result = await pool.query(
        'select id,titulo,autor,descripcion,portada,publicado from obras where id = $1;', [id]
        );
        return result.rows[0];
    }

    async create({titulo,autor,descripcion,portada}) {
        // Se le asigna un valor false por default a publicado al crear una obra
        const result = await pool.query(
        'insert into obras (titulo,autor,descripcion,portada,publicado) values ($1,$2,$3,$4,false) returning id,titulo,autor,descripcion,portada,publicado', 
        [titulo,autor,descripcion,portada]
        );
        return result.rows[0];
    }

    async update(id, data) {

        const result = await pool.query(    // coalesce() si algo está nulo no lo actualiza
            'update obras set titulo=coalesce($1,titulo), autor=coalesce($2,autor), descripcion=coalesce($3,descripcion), portada=coalesce($4,portada), publicado=coalesce($5,publicado) where id = $6 returning id,titulo,autor,descripcion,portada,publicado', 
            [data.titulo ?? null, 
            data.autor ?? null, 
            data.descripcion ?? null, 
            data.portada ?? null, 
            data.publicado ?? null, 
            id]                             // El ?? verifica si hay un elemento, si no hay, se vuelve nulo. 
        );
        return result.rows[0] || null;      // con .rows[0] se devuelve únicamente un elemento json 
    }

    async delete(id) {

        const result = await pool.query(
        'delete from obras where id = $1 returning id', 
        [id]                                // no se pone la variable directamente para evitar inyecciones SQL
        );
        return result.rows[0] || null;
    }

    // async buscar(data) {    // Busca por autor o título entre todas las obras
    //     /* const result = await pool.query(
    //     'select id,titulo,autor from obras where titulo like coalesce($1, titulo) or autor = coalesce($2, autor) and publicado = true',[`%${data.titulo}%`, data.autor]
    //     ) */
    //     const result = await pool.query(
    //     'select id,titulo,autor from obras where titulo like coalesce($1, titulo) or autor = coalesce($2, autor)',[`%${data.titulo}%`, `%${data.autor}%`]
    //     )
    //     const total = await pool.query(
    //     'select count(*) as total from obras where titulo like coalesce($1, titulo) or autor = coalesce($2, autor)',[`%${data.titulo}%`, `%${data.autor}%`]
    //     )
    //     console.log(total)
    //      console.log(total.result.rows)
    //     return {resultados: result.rows, total}
    //     // return result.rows;
    // }

    // Nota para el profe: Buenas noches, quería comentar que me tardé 2 horas en hacer funcionar esta parte, porque nomás no funcionaba y no sabia cómo o porqué
        // al principio por como lo tenía hecho no es que diera error, pero no arrojaba ninguna coincidencia aunque estuvieran bien los parámetros
        // lo que observa a continuación es un código que funciona, no sé si es lo mejor o no, pero es una mezcla de IA y desesperación que funciona, estoy muy feliz, ya puedo dormir

    async buscar({ titulo, autor, limit = 10, offset = 0 }) { // Busca por autor o título entre todas las obras
        const result = await pool.query(
            'select id, titulo, autor from obras where ($1::text is null or titulo ilike $1) and ($2::text is null or autor ilike $2) limit $3 offset $4',
            [titulo ? `%${titulo}%` : null, autor ? `%${autor}%` : null, limit, offset]
        );

        const total = await pool.query(
            'select count(*) as total from obras where ($1::text is null or titulo ilike $1) and ($2::text is null or autor ilike $2)',
            [titulo ? `%${titulo}%` : null, autor ? `%${autor}%` : null]
        );

        return { resultados: result.rows, total: total.rows[0].total }; // Es bellísimo
    }
}

module.exports = { ObrasRepository }