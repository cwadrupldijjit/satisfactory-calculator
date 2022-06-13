import { InitialOptionsTsJest } from 'ts-jest';

export default {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.test.json',
        },
    },
} as InitialOptionsTsJest;
