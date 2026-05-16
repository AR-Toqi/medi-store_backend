import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    clean: true,
    minify: true,
    shims: true,
    external: [
        'pg-native',
        '@prisma/client',
        '@prisma/client-runtime-utils',
        './generated/prisma'
    ],
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
        `,
    },
})