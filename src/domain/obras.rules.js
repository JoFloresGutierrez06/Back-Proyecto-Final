// Se verificarán las validaciones
// Se instala otra librería: npm i -D jest
// Agregar otro script en package.json: "test": "jest"

function validarObra({titulo,autor,descripcion,portada}) {

    // TITULO
  if (!titulo || typeof titulo !== 'string' || titulo === "") {
    return {ok: false, error: 'Titulo inválido'}
  } // AUTOR
  if (!autor || typeof autor !== 'string' || autor === "") {
    return {ok: false, error: 'Autor inválido'}
  } // DESCRIPCION
  if (!descripcion || typeof descripcion !== 'string' || descripcion === "") {
    return {ok: false, error: 'Descripcion inválida'}
  } // PORTADA
  if (!portada || typeof portada !== 'string' || portada === "") {
    return {ok: false, error: 'Portada inválida'}
  } 

  console.log(titulo, autor, descripcion, portada)
  return {ok: true, data: {titulo: titulo, autor, descripcion, portada}};
}

module.exports = {validarObra}