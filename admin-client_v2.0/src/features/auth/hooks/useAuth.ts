import { useContext } from 'react';

import { AuthContext } from '../model/AuthContext';
import type { AuthContextValueType } from '../model/model';

export function useAuth(): AuthContextValueType {
    const value = useContext(AuthContext);
    if (!value) throw new Error('useAuth must be used inside AuthProvider');
    return value;
}