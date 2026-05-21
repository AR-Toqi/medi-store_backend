import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/server.ts', 'src/app.ts', 'src/config.ts'],
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
    ],
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
        `,
    },
})