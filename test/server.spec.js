const request = require('supertest');
const app = require('../index');
const { Pool } = require('pg');
// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'desafiolatam279',
  port: 5432
});