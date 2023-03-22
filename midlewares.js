const format = require('pg-format')
const bcrypt = require('bcryptjs')

const checkCredentials = async (email, password) => {
    const values = [email]
    const query = "SELECT * FROM users WHERE email = $1"    
    const { rows: [usuario], rowCount } = await pool.query(query, values)
    const { password: encriptedPassword } = usuario   
    const correctPassword = bcrypt.compareSync(password, encriptedPassword)    
     if (!correctPassword || !rowCount)
        throw { code: 401, message: "Email or Password Incorrect =)!!" }
};

const reportQuery = async (req, res, next) => {
    const par = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Hemos Recibido una Consulta en la Ruta ${url}
    con los Parámetros:
    `, par)
    next()
};

module.exports = { checkCredentials, reportQuery};