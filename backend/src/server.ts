import { setupApp } from './app'
import { db } from './infra/db'

db.$connect()
  .then(setupApp)
  .then(app => {
    app.listen({ port: 3333 }).then(() => {
      process.stdout.write('Server running on port 3333')
    })
  })
