const { Pool } = require('pg');

// Configure a conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'funcionarios', // Nome do banco de dados
    password: 'admin',
    port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;