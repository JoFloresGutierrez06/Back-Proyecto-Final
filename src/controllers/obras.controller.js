const { ObrasRepository } = require('../repositories/obras.repository');
const {validarObra} = require('../domain/obras.rules')

const repo = new ObrasRepository();

async function getAll(req, res) {   // Muestra todas las obras

    const obras = await repo.getAll()
    // console.log(obras)
    return res.json(obras)
}

async function getAllPublish(req, res) {    // Muestra todas las obras publicadas
    const obras = await repo.getAllPublish()
    return res.json(obras)
}

async function getById(req, res) {

    const id = Number(req.params.id)
    const obra = await repo.getById(id)

    if (!obra) {
        return res.status(404).json({error: 'Obra no encontrada'})
    }
    return res.json(obra)
}

async function create(req, res) {
    const portadaGenerica = 'https://img.freepik.com/vector-gratis/cubierta-libro-blanco-vector-aislado-blanco_1284-41904.jpg?semt=ais_hybrid&w=740&q=80'
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({error: 'Datos incompletos'})
    }

    const { titulo, autor, descripcion, portada = portadaGenerica } = req.body;

    const respuesta = validarObra({titulo, autor, descripcion, portada});
    
    if (!respuesta.ok) {
        return res.status(400).json(respuesta.error);
    }

    // console.log(respuesta.data)
    // console.log(respuesta.data.titulo, respuesta.data.autor, respuesta.data.descripcion, respuesta.data.portada)
    const nuevo = await repo.create(respuesta.data)
    // console.log(nuevo)
    return res.status(201).json(nuevo)
}

async function update(req, res) {

    // Validar que mande algo el usuario
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log('entró')
        return res.status(400).json({error: 'Datos incompletos'})
    }

    const id = Number(req.params.id);
    const { titulo, autor, descripcion, portada, publicado} = req.body;
    
    const obra = {
        titulo: titulo !== undefined ? titulo : undefined, // Operador elvis, es como un if/else reducido.  ?:
        autor: autor !== undefined ? autor : undefined,
        descripcion: descripcion !== undefined ? descripcion : undefined,
        portada: portada !== undefined ? portada : undefined,
        publicado: publicado !== undefined ? publicado : undefined
    }

    //--------- VALIDAR DATOS
    // TITULO
    if (obra.titulo !== undefined && (typeof obra.titulo !== 'string' || obra.titulo.trim() === '')) {
        return res.status(400).json({ error: 'Titulo inválido' });
    }
    // AUTOR
    if (obra.autor !== undefined && (typeof obra.autor !== 'string' || obra.autor.trim() === '')) {
        return res.status(400).json({ error: 'Autor inválido' });
    }
    // DESCRIPCION
    if (obra.descripcion !== undefined && (typeof obra.descripcion !== 'string' || obra.descripcion.trim() === '')) {
        return res.status(400).json({ error: 'Descripcion inválida' });
    }
    // PORTADA
    if (obra.portada !== undefined && (typeof obra.portada !== 'string' || obra.portada.trim() === '')) {
        return res.status(400).json({ error: 'Portada inválida' });
    }
    // PUBLICADO
    if (obra.publicado !== undefined && typeof obra.publicado !== 'boolean') {
        return res.status(400).json({ error: 'Estatus inválido' });
    }

    const actualizado = await repo.update(id, obra)

    if (!actualizado) {
        return res.status(404).json({error: 'No encontrado'})
    }

    return res.json(actualizado)
}

async function remove(req, res) {
    const id = Number(req.params.id);
    const ok = await repo.delete(id)

    if (!ok) {
        return res.status(404).json({error: 'No encontrado'})
    }

    return res.status(204).send()
}

async function search(req,res) {  // Busca obras por titulo y autor (todas) con paginación

    const { titulo, autor, page = 1, limit = 5} = req.query; // limit 5 default para que no traiga tantos elementos

    // Comprobar que se envió al menos un parámetro de búsqueda
    if (req.query && Object.keys(req.query).length === 0) {
        return res.status(400).json({error: 'Parámetros inválidos'})
    }
  
    // Validar que titulo y autor sean string (si existen)
    if (titulo !== undefined && typeof titulo !== 'string') {
        return res.status(400).json({ error: 'Título inválido' });
    }
    if (autor !== undefined && typeof autor !== 'string') {
        return res.status(400).json({ error: 'Autor inválido' });
    }

    // Validar que page y limit sean enteros positivos
    const pageNumber = Number(page);
    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
        return res.status(400).json({ error: 'Page inválido' });
    }

    const limitNumber = Number(limit);
    if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
        return res.status(400).json({ error: 'Limit inváliddo' });
    }

    // Construir objeto de parámetros ya validado
    const parametros = {
        titulo: titulo ?? null,
        autor: autor ?? null,
        page: pageNumber,
        limit: limitNumber
    };

    /* // Validar page
    const pageNumber = Number(page)
    if(Number.isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).json({error: 'Page inválido'})
    } 
    // Validar limit
    const limitNumber = Number(limit)
    if(Number.isNaN(pageNumber) || limitNumber <= 0) { 
        return res.status(400).json({error: 'Limit inválido'})
    } */
    
    // Buscar productos con filtros y paginación
    const resultados = await repo.buscar(parametros);
    
    if (!resultados.resultados || resultados.resultados.length === 0) {
        return res.status(404).json({error: 'Ninguna obra encontrada'})
    }

    return res.json({
        data: resultados.resultados,
        page: parametros.page,
        limit: parametros.limit,
        total: resultados.total
    });
}

module.exports = { getAll, getAllPublish, getById, create, update, remove, search }