import { defineConfig } from 'electron-vite'

import * as viteConfig from './vite.config.ts'

export default defineConfig((env) => ({
    preload: {},
    main: {
        build: {
            lib: {
                entry: 'src/electron/index.ts',
            },
            // externalizeDeps: {
            //     exclude: [
            //         'electron-store',
            //         'electron-window-state',
            //         'axios',
            //         'log4js',
            //         'express',
            //         'ws',
            //         'jsonpath',
            //         'request',
            //         'semver',
            //         'zod',
            //     ],
            // },
        },
    },
    renderer: viteConfig.configFactory('out/renderer')(env),
}))
