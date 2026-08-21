import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { usersTransport } from '../api/usersTransport.js';
import Pagination from '../components/common/Pagination.jsx';
import StatusMessage from '../components/common/StatusMessage.jsx';
import PageLoader from '../widgets/PageLoader.jsx';

export default function UsersListPage() {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const roleFilter = searchParams.get('role') || '';
    const page = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await usersTransport.list({ role: roleFilter || undefined, page, limit: 10 });
                setUsers(res?.data || []);
                setMeta(res?.meta || { page: 1, totalPages: 1 });
            } catch (err) {
                console.error('Не удалось загрузить пользователей:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [roleFilter, page]);

    const handleRoleChange = (e) => {
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

    const handlePageChange = (newPage) => {
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
            ) : users.length === 0 ? (
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
                                <td><span className={`${styles.badge} ${styles[user.role]}`}>{user.role}</span></td>
                                <td><Link to={`/users/${user.id}`} className={styles.actionLink}>Смотреть</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Pagination page={page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </div>
    );
}