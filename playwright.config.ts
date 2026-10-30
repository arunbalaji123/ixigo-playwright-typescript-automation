// @ts-check

import { defineConfig } from '@playwright/test';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: path.resolve(__dirname, 'tests'),

    timeout: 90 * 1000,

    expect: {
        timeout: 10 * 1000
    },

    workers: 1,

    reporter: [
        ['list'],
        ['html', { open: 'on-failure' }]
    ],

    use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true
    }
});