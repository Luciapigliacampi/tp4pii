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
database: 'ecommerce'
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

app.get('/productos', (req, res) => {
  const buscar = req.query.buscar

  let filtroBusqueda = "";
  if(buscar) {
    filtroBusqueda = `WHERE p.descripcion LIKE '%${buscar}%'`
  }

  console.log(filtroBusqueda);
  
  connection.query('SELECT p.* FROM productos as p inner join rubros as r ON r.id_rubro = p.id_rubro ' + filtroBusqueda, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
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