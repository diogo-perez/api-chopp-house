const pool = require('../config/database');

class Funcionario {
    constructor(nome, valorDiaria, inativo) {
        this.nome = nome;
        this.valorDiaria = valorDiaria;
        this.inativo = inativo;
    }

    async save() {
        const query = {
            text: 'INSERT INTO funcionario(nome, valor_diaria) VALUES($1, $2) RETURNING *',
            values: [this.nome, this.valorDiaria],
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
            text: 'SELECT * FROM funcionario',
        };

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateFuncionario(id, nome, valorDiaria) {
        try {
            const query = {
                text: 'UPDATE funcionario SET nome = $1, valor_diaria = $2 WHERE id = $3 RETURNING *',
                values: [nome, valorDiaria, id],
            };

            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async situacaoFuncionario(id) {
        try {
            const query = {
                text: 'UPDATE funcionario SET inativo = NOT inativo WHERE id = $1 RETURNING *',
                values: [id],
            };

            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Funcionario;
