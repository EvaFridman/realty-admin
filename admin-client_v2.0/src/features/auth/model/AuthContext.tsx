import { createContext } from 'react';

import type { AuthContextValueType } from './model';

export const AuthContext = createContext<AuthContextValueType | null>(null);