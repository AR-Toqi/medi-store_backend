import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/app.ts', 'src/config.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    clean: true,
    minify: false,
    shims: true,
    dts: true,
    bundle: true,
    external: [
        'pg-native',
        '@prisma/client',
        'express',
        'cors',
        'cookie-parser',
        'better-auth',
        '@getbrevo/brevo',
        '@google/genai',
        '@google/generative-ai',
        'cloudinary',
        'multer',
        'multer-storage-cloudinary',
        'ejs',
        'jsonwebtoken',
        'bcrypt',
        'dotenv',
        'http-status',
        'pg',
    ],
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
        `,
    },
})