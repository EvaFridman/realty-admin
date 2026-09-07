import { createContext } from 'react';

import type { SocketContextValueType } from '@/features/presence';

export const SocketContext = createContext<SocketContextValueType | null>(null);