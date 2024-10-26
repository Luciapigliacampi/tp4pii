export const obtenerClientes = (req, res) => {
    const buscar = req.query.buscar

  let filtroBusqueda = "";
  if(buscar) {
    filtroBusqueda = `AND c.nombre LIKE '%${buscar}%' OR c.apellido LIKE '%${buscar}%'`
  }

  console.log(filtroBusqueda);
  
  
  connection.query('SELECT c.*, b.nombre as nombre_barrio, l.nombre as nombre_localidad, t.nombre as nombre_tipo_cliente, td.nombre as nombre_tipo_documento FROM cliente as c inner join barrio as b on b.id_barrio = c.id_barrio inner join localidad as l on l.id_localidad = c.id_localidad inner join tipocliente as t on t.id_tipo_cliente = c.id_tipo_cliente inner join tipodocumento as td on td.id_tipo_documento = c.id_tipo_documento WHERE c.estado=1 ' + filtroBusqueda + ' ORDER BY c.nombre asc', (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
}