import { fileURLToPath } from 'node:url'
import path from 'node:path'

////

export const LIB = 'node-typescript-compiler'

export const __dirname = path.dirname(fileURLToPath(import.meta.url))
