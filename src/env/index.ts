import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  SECRET_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('Enviromments variables are not valid', _env.error.format())
  throw new Error('Environment variables are not valid')
}

export const env = _env.data
