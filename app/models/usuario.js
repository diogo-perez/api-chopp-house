const pool = require('../config/database');

class Usuario {
    constructor(nome, usuario, senha) {
        this.nome = nome;
        this.usuario = usuario;
        this.senha = senha;
    }

    static async autenticar(usuario, senha) {
        const query = {
            text: 'SELECT * FROM usuario WHERE usuario = $1 AND senha = $2',
            values: [usuario, senha],
        };

        try {
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async find() {
        const query = {
            text: 'SELECT * FROM usuario',
        };

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;
