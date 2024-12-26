import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import checker from 'vite-plugin-checker';
import pack from './package.json';

const gameId = 'base';

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gamePath = env.HOST_PATH == undefined || env.HOST_PATH == '' ? gameId : env.HOST_PATH;
  const gameEnv = env.GAME_ENV == undefined ? 'development' : env.GAME_ENV;

  return {
    publicDir: 'assets',
    base: `/${gamePath}/`,
    define: {
      GAME_VERSION: `"${pack.version}"`,
      GAME_ENV: `"${gameEnv}"`,
    },
    plugins: [
      react(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
      generateFile([
        {
          type: 'json',
          output: './version.json',
          data: {
            date: `${new Date(Date.now()).toISOString()}`,
            gameEnv: env.GAME_ENV,
            version: env.npm_package_version,
            commit: env.COMMIT_SHORT_SHA,
          },
        }
      ]),
    ],
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components/', import.meta.url)),
        '@store': fileURLToPath(new URL('./src/store/', import.meta.url)),
        '@flow': fileURLToPath(new URL('./src/flow/', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib/', import.meta.url)),
        '@src': fileURLToPath(new URL('./src/', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets/', import.meta.url)),
      },
    },
  };
});
