'use strict'
const Mail = use('Mail')
const { validateAll } = use('Validator')
const randomString = require('random-string')
const User = use("App/Models/User")

const rules = {
    name: 'required|max:90|min:4|alpha',
    email: 'required|email|unique:users,email|max:160|min:5',
    password: 'required|confirmed|max:30|min:6'
}

const messages = {
    required: 'Campo obrigatório',
    min: 'Mínimo de caracteres não atingido',
    max: 'Máximo de caracteres excedido',
    'name.alpha': 'É permitido apenas letras',
    'email.email': 'Email inválido',
    'email.unique': 'Este email já está em uso',
    'password.confirmed': 'As senhas não conferem'
}

class UserController {
    async store({ request }) {
        let data = request.only(["email", "password", "password_confirmation", "name"])

        const aux = data.name ? data.name.replace(/\s/g, '') : ''
        const validation = await validateAll({ ...data, name: aux }, rules, messages)

        if (validation.fails()) return response.status(400).send({ error: validation.messages() })

        data.confirmation_token = randomString({ length: 40 })
        delete data.password_confirmation
        const user = await User.create(data)

        await Mail.send('emails.confirm_email', user.toJSON(), (message) => {
            message
                .to(user.email)
                .from('steferson1996@gmail.com')
                .subject('Confirmação de Email')
        })

        return user
    }

    async show({ params }) {
        // if (auth.user.id !== Number(params.id)) {
        //     return 'Você pode visualizar apenas o seu perfil.'
        // }
        const user = await User.findOrFail(params.id)

        return user
    }

    async update({ auth, params, request }) {
        if (auth.user.id !== Number(params.id)) {
            return 'Você pode editar apenas o seu perfil.'
        }

        const user = await User.findOrFail(params.id)

        const data = request.only([
            'name',
            'date_birth',
            'description'
        ])

        user.merge(data)

        await user.save()

        // usar validator
        return user
    }

    async confirmEmail({ params, response }) {
        // get user pelo token de confirmação
        const user = await User.findBy('confirmation_token', params.token)

        if (user == null) {
            return response.redirect('http://localhost:3000/register/confirm/failed')
        } else {
            // setando confirmação para null e active para true
            user.confirmation_token = null
            user.active = true

            // salvando no banco
            await user.save()
            return response.redirect('http://localhost:3000/register/confirm/success')
        }
    }

    async socialAuth({ ally, params, request, auth }) {
        const { accessToken, provider_id } = request.only(['accessToken', 'provider_id'])
        if (!accessToken) return {
            error: [
                {
                    field: 'general',
                    message: 'Usuário inválido',
                    validation: 'login'
                }
            ]
        }
        try {
            const { provider } = params
            const socialUser = await ally.driver(provider).getUserByToken(accessToken)
            const email = socialUser.getEmail()
            const exists = await User.query()
                .where('email', email)
                .whereNot('provider', provider)
                .first()

            if (!exists) {
                const user = await User.findOrCreate(
                    { email }, 
                    {
                        email, provider, provider_id,
                        name: socialUser.getName(),
                        image_path: socialUser.getAvatar(),
                        active: true,
                    }
                )
                const { token } = await auth.generate(user)
                return { user, token }
            } else {
                const message = (!exists.provider) ? 'Email cadastrado sem rede social' :
                    `Email cadastrado através do ${exists.provider}`
                return {
                    error: [
                        {
                            field: 'general',
                            message,
                            validation: 'login'
                        }
                    ]
                }
            }
        } catch (error) {
            return {
                error: [
                    {
                        field: 'general',
                        message: 'Falha na autenticação',
                        validation: 'login'
                    }
                ]
            }
        }
    }
}

module.exports = UserController
