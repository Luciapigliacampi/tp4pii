import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const connection = mysql2.createConnection({
host: 'localhost',
user: 'root',
password: 'Teo2024Lp',
database: 'soderia'
});

connection.connect((err) => {
if (err) {
console.error('Error conectando a la base de datos:', err);
return;
}
console.log('Conectado a la base de datos MySQL');
});

app.get('/', (req, res) => {
  res.send('API Funcionando OK');
});

app.get('/clientes', (req, res) => {
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
});

app.get('/localidades', (req, res) => {
  connection.query('SELECT id_localidad, nombre FROM localidad ORDER BY nombre asc', (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});

app.get('/barrios/:id_localidad', (req, res) => {
  const id_localidad = req.params.id_localidad;

  connection.query(`SELECT id_barrio, nombre FROM barrio WHERE id_localidad = ${id_localidad} ORDER BY nombre asc`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});

app.get('/tipos_documento', (req, res) => {
  connection.query('SELECT id_tipo_documento, nombre FROM tipodocumento', (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
});
});

app.get('/tipos_iva', (req, res) => {
  connection.query('SELECT id_condicion, nombre FROM condicioniva', (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
});
});

app.get('/tipos_cliente', (req, res) => {
  connection.query('SELECT id_tipo_cliente, nombre FROM tipocliente', (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
});
});

app.post('/clientes', (req, res) => {
  // Capturo datos del formulario
  const { nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion } = req.body;

  // consulta a la base de datos
  connection.query(`SELECT estado, id_cliente FROM cliente WHERE numero_documento = ${numero_documento}`, (err, results) => {
    // si da error
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      //si devuelve un resultado y estado es 1 (estado1 = activo)
      if (results.length > 0 && results[0].estado == 1) {

        return res.status(409).json({ error: "Este cliente ya existe con el DNI ingresado" });
      } 
      //si devuelve resultado y estado es 0 (estado 0 = eliminado)
      else if (results.length > 0 && results[0].estado == 0) {
        //envia los datos a la base de datos
        connection.query(
          `UPDATE cliente SET nombre = ?, apellido = ?, telefono = ?, calle = ?, id_barrio = ?, id_localidad = ?, correo_electronico = ?, id_tipo_cliente = ?, id_tipo_documento = ?, numero_documento = ?, estado = ?, numero_dir = ?, piso = ?, departamento = ?, id_condicion = ?
      WHERE id_cliente = ?`,
          [nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion, results[0].id_cliente],
          (err, results) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
              return res.status(201).json({ id: results.insertId });
          }
      );
      } else {
        // si no devuelve nada envia a la base de datos
      connection.query(
        'INSERT INTO cliente (nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ message: "Cliente guardado con éxito", id: results.insertId });
        }
    );
      }
  });  
});

app.delete('/clientes/:id_cliente', (req, res) => {
  const id_cliente = req.params.id_cliente;

  connection.query(`UPDATE cliente set estado=0 WHERE id_cliente=${id_cliente}`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
})

app.get('/clientes/:id', (req, res) => {
  const id_cliente = req.params.id;

  connection.query(`SELECT c.*, b.id_barrio, l.id_localidad, t.id_tipo_cliente, td.id_tipo_documento FROM cliente as c inner join barrio as b on b.id_barrio = c.id_barrio inner join localidad as l on l.id_localidad = c.id_localidad inner join tipocliente as t on t.id_tipo_cliente = c.id_tipo_cliente inner join tipodocumento as td on td.id_tipo_documento = c.id_tipo_documento WHERE c.id_cliente= ${id_cliente}`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results[0]);
  });
});

app.put('/clientes/:id_cliente', (req, res) => {
  const id_cliente = req.params.id_cliente;

  const { nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion } = req.body;
  
  
  connection.query(
      `UPDATE cliente SET nombre = ?, apellido = ?, telefono = ?, calle = ?, id_barrio = ?, id_localidad = ?, correo_electronico = ?, id_tipo_cliente = ?, id_tipo_documento = ?, numero_documento = ?, estado = ?, numero_dir = ?, piso = ?, departamento = ?, id_condicion = ?
  WHERE id_cliente = ?`,
      [nombre, apellido, telefono, calle, id_barrio, id_localidad, correo_electronico, id_tipo_cliente, id_tipo_documento, numero_documento, estado, numero_dir, piso, departamento, id_condicion, id_cliente],
      (err, results) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          return res.status(201).json({ message:"Cliente modificado con éxito",id: results.insertId });
      }
  );
});





// RUTAS PARA PRODUCTOS
app.get('/productos', (req, res) => {
  connection.query('SELECT * FROM producto WHERE estado = 1 AND stock > 0', (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      return res.json(results);
  });
});


// RUTAS PARA PEDIDOS
app.get('/pedidos', (req, res) => {
  connection.query(`SELECT p.*, CONCAT(c.nombre, ' ', c.apellido) as nombre_cliente FROM pedido as p INNER JOIN cliente as c on p.id_cliente = c.id_cliente WHERE p.estado <> 0 ORDER BY p.id_pedido desc`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
  });
});

app.post('/pedidos', (req, res) => {
  const {cliente,detalle,subtotal,total,iva,fecha_entrega,estado} = req.body;

  connection.query('INSERT INTO pedido (fecha,id_cliente,estado,fecha_estimada_entrega,total,subtotal,iva) VALUES (Now(),?,?,?,?,?,?)',[cliente,estado,fecha_entrega,total,subtotal,iva], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if(results) {
        let insertedId = results.insertId

        for (let index = 0; index < detalle.length; index++) {
          const element = detalle[index];
          connection.query('INSERT INTO productoxpedido (id_producto,id_pedido,cantidad,estado,precio_unitario,precio_total) VALUES (?,?,?,?,?,?)',[element.codigo,insertedId,element.cantidad,1,element.valor_unitario,element.total_producto], (err, results) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
          });
        }
      }
      return res.json({ message:"Pedido creado con éxito",id: results.insertId });
  });
});

app.delete('/pedidos/:id_pedido', (req, res) => {
  const id_pedido = req.params.id_pedido;

  connection.query(`UPDATE pedido SET estado=0 WHERE id_pedido=${id_pedido}`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      return res.status(200).json(results);
  });
})

app.get('/pedidos/:id_pedido', (req, res) => {
  const id_pedido = req.params.id_pedido;

  let objetoRespuesta = {
    cliente: "",
    estado: "",
    subtotal: 0,
    iva: 0,
    total: 0,
    detalle: []
  }

  connection.query(`SELECT p.*, c.numero_documento, CONCAT(c.nombre, ' ', c.apellido) as nombre_cliente FROM pedido as p INNER JOIN cliente as c ON p.id_cliente = c.id_cliente WHERE p.id_pedido = ${id_pedido}`, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      objetoRespuesta.cliente = results[0].nombre_cliente
      objetoRespuesta.estado = results[0].estado
      objetoRespuesta.subtotal = results[0].subtotal
      objetoRespuesta.iva = results[0].iva
      objetoRespuesta.total = results[0].total
      connection.query(`SELECT d.*, p.nombre, p.volumen FROM productoxpedido as d INNER JOIN producto as p ON p.id_producto = d.id_producto WHERE d.id_pedido = ${id_pedido}`, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        objetoRespuesta.detalle = results

        return res.status(200).json(objetoRespuesta);
    });
  });
});


// RUTAS LOGIN
app.post('/login', (req, res) => {
  const datos = req.body
  console.log(datos);

  return res.status(200).json(datos);
  
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});