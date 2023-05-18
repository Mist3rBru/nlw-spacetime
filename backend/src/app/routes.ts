import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FastifyInstance } from 'fastify'

interface Routes {
  default(router: FastifyInstance): void
}

export const setupRoutes = async (router: FastifyInstance): Promise<void> => {
  const relativeRoutesFolder = '../routes'
  const absoluteRoutesFolder = resolve(__dirname, relativeRoutesFolder)
  const files = await readdir(absoluteRoutesFolder)
  for (const file of files) {
    const routes: Routes = await import(`${relativeRoutesFolder}/${file}`)
    routes.default(router)
  }
}
