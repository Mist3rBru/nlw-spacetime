import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  const { data } = await api.post('/register', { code })

  const dataSchema = z.object({
    token: z.string()
  })
  const { token } = dataSchema.parse(data)
  const expiresInSeconds = 60 * 60 * 24

  const redirectUrl = new URL('/', req.url)
  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${expiresInSeconds}`
    }
  })
}
