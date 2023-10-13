const pool = require('../config/database');

class Diaria {
    constructor(funcionarioIds, dataDiaria, diarias_ids = []) {
        if (Array.isArray(funcionarioIds) && funcionarioIds.length > 0) {
            this.funcionario_ids = funcionarioIds;
        } else {
            throw new Error('funcionario_ids inválidos');
        }
        this.data_diaria = dataDiaria;
        this.diarias_ids = diarias_ids;
    }

    async save() {
        const diarias = [];
        for (const funcionarioId of this.funcionario_ids) {
            const query = {
                text: 'INSERT INTO diaria(funcionario_id, data_diaria) VALUES($1, $2) RETURNING *',
                values: [funcionarioId, this.data_diaria],
            };

            try {
                const result = await pool.query(query);
                diarias.push(result.rows[0]);
            } catch (error) {
                throw error;
            }
        }
        return diarias;
    }

    async pagar() {
        const { funcionario_ids, diarias_ids } = this;

        const funcionario_id = funcionario_ids[0];

        try {
            diarias_ids.map(async (diaria) => {
                const query = {
                    text: 'UPDATE diaria SET pago = true WHERE funcionario_id = $1 AND id = $2 RETURNING *',
                    values: [funcionario_id, diaria],
                };

                return await pool.query(query);
            });
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    static async find() {
        const query = {
            text: 'SELECT * FROM diaria',
        };

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async findByFuncionarioId(funcionarioId) {
        const query = {
            text: 'SELECT diaria.*, funcionario.valor_diaria AS valor_diaria ' +
                'FROM diaria ' +
                'INNER JOIN funcionario ON diaria.funcionario_id = funcionario.id ' +
                'WHERE funcionario.id = $1',
            values: [funcionarioId],
        };

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Rota para buscar diárias pagas no ano
    static async findDiariasPagasNoAno(ano) {
        const query = {
            text: `SELECT funcionario.nome AS nome, SUM(funcionario.valor_diaria) AS valor_diaria
                FROM diaria 
                INNER JOIN funcionario ON diaria.funcionario_id = funcionario.id
                WHERE EXTRACT(YEAR FROM diaria.data_diaria) = $1 AND diaria.pago = true
                group by funcionario.nome`,
            values: [ano],
        };

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async findDiariasPagasNoMes(year, month) {
        try {
            const monthMap = {
                'Janeiro': 1,
                'Fevereiro': 2,
                'Março': 3,
                'Abril': 4,
                'Maio': 5,
                'Junho': 6,
                'Julho': 7,
                'Agosto': 8,
                'Setembro': 9,
                'Outubro': 10,
                'Novembro': 11,
                'Dezembro': 12,
            };

            year = parseInt(year);
            month = monthMap[month];

            if (!year || !month) {
                throw new Error('Ano ou mês inválido.');
            }
            // Defina a data de início do mês
            const startOfMonth = new Date(year, month - 1, 1);

            const endOfMonth = new Date(year, month, 0);

            console.log(startOfMonth, endOfMonth)
            const query = {
                text: `SELECT funcionario.nome AS nome, SUM(funcionario.valor_diaria) AS valor_diaria
                    FROM diaria 
                    INNER JOIN funcionario ON diaria.funcionario_id = funcionario.id
                    WHERE diaria.data_diaria BETWEEN $1 AND $2 AND diaria.pago is true
                    GROUP BY funcionario.nome`,
                values: [startOfMonth, endOfMonth],
            };

            const result = await pool.query(query);
            console.log(result)
            return result.rows;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

}

module.exports = Diaria;
