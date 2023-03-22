const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { addProduct, registerUser, getProduct, getProducts , getUser, prepareHATEOAS, deleteProduct } = require('./consulta')
const {secretKey} = require('./secretKey')
const {checkCredentials, reportQuery} = require('./midlewares')

const server = app.listen(3001, () => {
    const address = server.address();
    console.log(`Servidor ejecutándose en http://${address.address}:${address.port}`)});

    app.address = function() {
    const server = this.listen();
    const address = server.address();
    return `http://${address.address}:${address.port}`;
  };

  // Utilizar la función "address"
  console.log(app.address());

app.use(cors())
app.use(express.json())

app.get("/productos", reportQuery, async (req,res) => {
    try{
        const productos = await getProducts()
        res.json(productos)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.get("/producto/:id", reportQuery, async (req, res) => {
    const { id } = req.params
    try{const product = await getProduct(id)
    res.json(product)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.get('/user/', async (req, res) => {
    try {
        const email = req.body;
        const user = await getUser(email)
        res.json(user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.get("/usuarios", reportQuery, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer")[1]
        jwt.verify(token, secretKey)
        const { email} = jwt.decode(token)
        const user = await getUser(email)
        const HATEOAS = await prepareHATEOAS(user)
        res.json(HATEOAS)
        // res.send(`El Usuario ${email} existe :DD!!`)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})



app.post("/", reportQuery,  async (req,res) => {
  const { nombre, precio, imagen, descripcion } = req.body
  await addProduct(nombre, precio, imagen, descripcion)
  res.send("Producto agregado con exito =)!!") 
})




app.post("/usuarios", reportQuery, async (req, res) => {
    try {
        const user = req.body
        await registerUser(user)
        res.send("User Created =)!!!")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", reportQuery, async (req, res) => {
    try {
        const { email, password } = req.body
        await checkCredentials(email, password)
        const token = jwt.sign({ email }, secretKey)
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})



app.post("/admin/agregarproducto", reportQuery, async (req, res) => {
    try {
        const producto = req.body
        await addProduct(producto)
        res.send("Producto agregado con exito =)!!!")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete("/producto/:id", async (req, res) => {
    const { id } = req.params
    await deleteProduct(id)
    res.send("Producto eliminado con exito =D!")
})