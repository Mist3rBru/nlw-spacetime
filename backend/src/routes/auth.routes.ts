import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../infra/db'

export default (app: FastifyInstance): void => {
  app.post('/register', async req => {
    const paramsSchema = z.object({
      code: z.string()
    })
    const { code } = paramsSchema.parse(req.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET
        },
        headers: {
          Accept: 'application/json'
        }
      }
    )
    const { access_token: accessToken } = accessTokenResponse.data

    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const userSchema = z.object({
      id: z.coerce.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url()
    })
    const userData = userSchema.parse(userResponse.data)

    let user = await db.user.findUnique({
      where: {
        githubId: userData.id
      }
    })
    if (!user) {
      user = await db.user.create({
        data: {
          name: userData.name,
          login: userData.login,
          avatarUrl: userData.avatar_url,
          githubId: userData.id
        }
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      {
        sub: user.id,
        expiresIn: '1d'
      }
    )

    return { token }
  })
}
