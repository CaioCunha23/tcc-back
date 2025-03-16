import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

async function login(req, res) {
    const { login, password } = req.body;

    let user;

    if (login.includes('@')) {
        user = await Usuario.findOne({ where: { email: login, password } });
    } else {
        user = await Usuario.findOne({ where: { uidMSK: login, password } });
    }

    if (!user) {
        return res.status(404).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(JSON.stringify(user), process.env.SECRET_KEY);

    return res.status(200).json({ token });
}

function checaToken(req, res, next) {
    const headers = req.headers
    const authHeader = headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    next()
}

function pegarUsuarioDoToken(req, res) {
    const headers = req.headers
    const authHeader = headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    const usuarioDoToken = jwt.decode(token)
    res.json(usuarioDoToken)
}

export default {
    login,
    checaToken,
    pegarUsuarioDoToken
};