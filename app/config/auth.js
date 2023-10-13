const jwt = require('jsonwebtoken');

function gerarToken(usuario) {
    const payload = {
        id: usuario.id,
        usuario: usuario.usuario,
        senha: usuario.senha,
    };

    const token = jwt.sign(payload, 'chave_secreta', { expiresIn: '1h' });

    return token;
}

module.exports = { gerarToken };
