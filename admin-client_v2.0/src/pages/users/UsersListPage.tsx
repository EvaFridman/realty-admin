import { type ChangeEvent, type ReactNode } from 'react';
import { useSearchParams, Link } from 'react-router';

import type { UserType } from '@/entities/user';
import { usersTransport } from '@/entities/user';

import type { PaginationMetaType } from '@/shared/api/types';
import useFetch from '@/shared/hooks/useFetch';
import PageLoader from '@/shared/ui/PageLoader/PageLoader';
import Pagination from '@/shared/ui/Pagination/Pagination';
import StatusMessage from '@/shared/ui/StatusMessage/StatusMessage';

import styles from './Users.module.css';

export default function UsersListPage(): ReactNode {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleFilter = searchParams.get('role') || '';
    const page = Number(searchParams.get('page')) || 1;

    const { data: users, meta, isLoading } = useFetch<UserType[], PaginationMetaType>(
        (signal) => usersTransport.list<UserType[], PaginationMetaType>({
            ...(roleFilter ? { role: roleFilter } : {}),
            page,
            limit: 10,
        }, { signal }),
        [roleFilter, page]
    );

    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const newRole = e.target.value;
        const newParams = new URLSearchParams(searchParams);

        if (newRole) {
            newParams.set('role', newRole);
        } else {
            newParams.delete('role');
        }

        newParams.set('page', '1');

        setSearchParams(newParams);
    };

    const handlePageChange = (newPage: number): void => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2>Управление пользователями</h2>
                <Link to="/users/new" className={styles.createBtn}>+ Создать агента</Link>
            </div>

            <div className={styles.filterSection}>
                <label>Роль: </label>
                <select value={roleFilter} onChange={handleRoleChange}>
                    <option value="">Все</option>
                    <option value="agent">Агенты</option>
                    <option value="moderator">Модераторы</option>
                </select>
            </div>

            {isLoading ? (
                <StatusMessage><PageLoader /></StatusMessage>
            ) : !users || users.length === 0 ? (
                <StatusMessage>Пользователи с такой ролью не найдены.</StatusMessage>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Роль</th>
                            <th>Карточка</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '—'}</td>
                                <td><span className={[styles.badge, styles[user.role]].filter(Boolean).join(' ')}>{user.role}</span></td>
                                <td><Link to={`/users/${String(user.id)}`} className={styles.actionLink}>Смотреть</Link></td>                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {meta && <Pagination page={page} totalPages={meta.totalPages} onPageChange={handlePageChange} />}
        </div>
    );
}