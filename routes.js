const express = require('express');
const router = express.Router();
const Funcionario = require('./app/models/funcionario');
const Diaria = require('./app/models/diaria');
const Usuario = require('./app/models/usuario');
const { gerarToken } = require('./app/config/auth');

// Rota para criar um novo funcionário
router.post('/funcionario', async (req, res) => {
    try {
        const { nome, valorDiaria } = req.body;
        const funcionario = new Funcionario(nome, valorDiaria);
        const novoFuncionario = await funcionario.save();

        // Envie uma resposta de sucesso com o novo funcionário
        res.status(201).json(novoFuncionario);
    } catch (error) {
        // Em caso de erro, envie uma resposta de erro com uma mensagem de erro
        res.status(400).json({ message: error.message });
    }
});


// Rota para obter todos os funcionários
router.get('/funcionarios', async (req, res) => {
    try {
        // Consulta o banco de dados para obter todos os funcionários
        const funcionarios = await Funcionario.find();
        // Envia a lista de funcionários como resposta
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/funcionario/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, valorDiaria } = req.body;
    try {
        const funcionario = await Funcionario.updateFuncionario(id, nome, valorDiaria);
        res.json(funcionario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
});

router.put('/funcionario/inativar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const funcionario = await Funcionario.situacaoFuncionario(id);
        res.json(funcionario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inativar funcionário' });
    }
});

// Rota para criar uma nova diária
router.post('/diaria', async (req, res) => {
    try {
        // Obtenha os dados da solicitação
        const { data_diaria, funcionarios } = req.body;
        // Crie uma nova instância de Diaria
        const diaria = new Diaria(funcionarios, data_diaria);
        // Chame a função save() para salvar a diária
        const novaDiaria = await diaria.save();
        res.status(201).json(novaDiaria);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para buscar diárias por ID de funcionário
router.get('/diaria/:funcionarioId', async (req, res) => {
    try {
        const funcionarioId = req.params.funcionarioId;
        const diarias = await Diaria.findByFuncionarioId(funcionarioId);
        res.json(diarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/pagar', async (req, res) => {
    try {
        // Obtenha os dados da solicitação
        const { funcionario_id, diarias_ids } = req.body;

        const diaria = new Diaria([funcionario_id], null, diarias_ids);
        const pagarDiaria = await diaria.pagar();
        // Responda com a nova diária criada
        res.status(201).json(pagarDiaria);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para autenticar o usuário
router.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const usuarioAutenticado = await Usuario.autenticar(usuario, senha);

        if (usuarioAutenticado) {
            const token = gerarToken(usuarioAutenticado);
            const usuario = usuarioAutenticado.nome;
            res.json({ token, usuario });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para buscar diárias pagas no ano
router.get('/diariasAno', async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const diarias = await Diaria.findDiariasPagasNoAno(year);
        res.json(diarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para buscar diárias pagas no mês especificado
router.post('/diariasMes', async (req, res) => {
    try {
        const { year, month } = req.body;
        const diarias = await Diaria.findDiariasPagasNoMes(year, month); // Chame uma função que filtra por ano e mês
        console.log(diarias);
        res.json(diarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
