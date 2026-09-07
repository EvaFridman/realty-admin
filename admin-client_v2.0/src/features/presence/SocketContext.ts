import { createContext } from 'react';

import type { SocketContextValueType } from './model/index';

export const SocketContext = createContext<SocketContextValueType | null>(null);