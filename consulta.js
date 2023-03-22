const { Pool } = require('pg')
const format = require('pg-format')
const bcrypt = require('bcryptjs')


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "desafiolatam279",
    database: "ecommerce",
    allowExitOnIdle: true
})

const getProducts = async () => {
    const query = " select * from productos"
    const { rows: productos } = await pool.query(query)
    return productos
}

const getProduct = async (id) => {
    const query = " select * from productos where id = $1"
    const value = [id]
    const { rows: productos } = await pool.query(query, value)
    return productos
}

const deleteProduct = async(id) =>{
    const query = " delete from productos where id = $1"
    const values = [id]
    const result = await pool.query(query, values)
}

const addProduct = async ({ nombre, precio,imagen, descripcion}) => {
    const query = "insert into productos values( DEFAULT, $1,$2,$3,$4)"
    const values = [nombre, precio, imagen, descripcion]
    const result = await pool.query(query, values)
}

const registerUser = async (user) => {
    let { email, password } = user
    const encriptedPassword = bcrypt.hashSync(password)
    password = encriptedPassword
    const values = [email, encriptedPassword]
    const query = "INSERT INTO users VALUES (DEFAULT, $1, $2)"
    await pool.query(query, values)
}

module.exports = { getProducts, addProduct, deleteProduct, getProduct, registerUser}