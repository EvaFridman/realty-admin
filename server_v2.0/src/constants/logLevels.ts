export const LEVEL_VALUES = { debug: 20, info: 30, warn: 40, error: 50 } as const;
export const LEVEL_NAMES = { 20: 'debug', 30: 'info', 40: 'warn', 50: 'error' } as const;

export type LogLevelName = keyof typeof LEVEL_VALUES;
export type LogLevelValue = typeof LEVEL_VALUES[LogLevelName];