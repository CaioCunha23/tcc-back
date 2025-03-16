import Usuario from "../models/Usuario"

async function createUser(req, res) {
    const { email, uidMSK, password, type } = req.body

    const user = Usuario.build({ email, uidMSK, password, type })

    try {
        await user.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message })
    }

    try {
        await user.save()
        res.status(201).json(user.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message })
    }
}

async function getUsers(req, res) {
    try {
        const users = await Usuario.findAll()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários: ' + error.message })
    }
}

async function getUserByMskID(req, res) {
    const { uidMSK } = req.params

    try {
        const user = await Usuario.findOne({ where: { uidMSK } })
        if (user) {
            res.json(user.toJSON())
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message })
    }
}

async function updateUser(req, res) {
    const { uidMSK } = req.params
    const { email, password, type } = req.body

    try {
        const user = await Usuario.findOne({ where: { uidMSK } })
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        if (email) user.email = email
        if (password) user.password = password
        if (type) user.type = type

        try {
            await user.validate()
        } catch (error) {
            return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message })
        }

        try {
            await user.save()
            res.json(user.toJSON())
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message })
    }
}

async function deleteUser(req, res) {
    const { uidMSK } = req.params

    try {
        const user = await Usuario.findOne({ where: { uidMSK } })
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        try {
            await user.destroy()
            res.json({ message: 'Usuário excluído com sucesso' })
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message })
    }
}

export default {
    createUser,
    getUsers,
    getUserByMskID,
    updateUser,
    deleteUser
}