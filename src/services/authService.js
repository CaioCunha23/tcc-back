import jwt from 'jsonwebtoken';
import Colaborador from '../models/Colaborador.js';
import bcrypt from 'bcrypt'

async function login(req, res) {
    const { login, password } = req.body

    const user = await Colaborador.findOne({
        where: login.includes('@')
            ? { email: login }
            : { uidMSK: login }
    })

    if (!user || !user.password) {
        return res.status(404).json({ error: 'Credenciais inválidas' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(404).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ uidMSK: user.uidMSK, email: user.email }, process.env.SECRET_KEY)
    return res.status(200).json({ token })
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

async function checkEmail(req, res) {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' })

    const colababorador = await Colaborador.findOne({ where: { email } })
    if (!colababorador) {
        return res
            .status(404)
            .json({ error: 'Email não cadastrado. Entre em contato com o suporte.' })
    }

    return res.status(200).json({ uidMSK: colababorador.uidMSK })
}

async function setPassword(req, res) {
    const { uidMSK } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
        return res
            .status(400)
            .json({ error: 'Senha inválida (mínimo 6 caracteres).' })
    }

    const colab = await Colaborador.findOne({ where: { uidMSK } })
    if (!colab) {
        return res.status(404).json({ error: 'Colaborador não encontrado.' })
    }
    if (colab.password) {
        return res
            .status(400)
            .json({ error: 'Senha já definida. Consulte login.' })
    }

    const hash = await bcrypt.hash(password, 10)
    colab.password = hash
    await colab.save()

    return res.status(200).json({ message: 'Senha criada com sucesso.' })
}

export async function forgotPassword(req, res) {
    const { email } = req.body

    const user = await Colaborador.findOne({ where: { email } })

    if (user) {
        const token = randomUUID()
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

        await Colaborador.update(
            { resetToken: token, resetExpires: expiresAt },
            { where: { id: user.id } }
        )

        await sendEmail({
            to: user.email,
            subject: 'Redefinição de senha',
            html: `<p>Clique <a href="${FRONT_URL}/reset-password/${token}">aqui</a> para redefinir sua senha.</p>`,
        })
    }

    return res.json({ ok: true })
}

export async function resetPassword(req, res) {
    const { token } = req.params
    const { password } = req.body

    const user = await Colaborador.findOne({
        where: {
            resetToken: token,
            resetExpires: { [Op.gt]: new Date() }
        }
    })

    if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' })
    }

    const hash = await bcrypt.hash(password, 10)
    await Colaborador.update(
        { password: hash, resetToken: null, resetExpires: null },
        { where: { id: user.id } }
    )

    return res.json({ ok: true })
}

export default {
    login,
    checaToken,
    pegarUsuarioDoToken,
    checkEmail,
    setPassword,
    forgotPassword,
    resetPassword
};