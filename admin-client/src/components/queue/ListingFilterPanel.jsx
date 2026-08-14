import styles from './ListingFilterPanel.module.css';
import { useState, useRef, useEffect } from 'react';
import { dealTypeLabels, propertyTypeLabels } from '../../data/adminData';

const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const SEARCH_DELAY_MS = 350;

export default function ListingFilterPanel({ filters, districts, onFieldChange, onRoomsToggle }) {
    const [searchInput, setSearchInput] = useState(filters.search);
    const [isSearchPending, setIsSearchPending] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchInput(value);
        setIsSearchPending(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onFieldChange('search', value);
            setIsSearchPending(false);
        }, SEARCH_DELAY_MS);
    }

    function handleSelectChange(e) {
        onFieldChange(e.target.name, e.target.value);
    }

    return (
        <div className={styles.filterPanel}>
            <select name="dealType" value={filters.dealType} onChange={handleSelectChange}>
                <option value="">Тип сделки</option>
                {Object.entries(dealTypeLabels).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>

            <select name="propertyType" value={filters.propertyType} onChange={handleSelectChange}>
                <option value="">Тип объекта</option>
                {Object.entries(propertyTypeLabels).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>

            <select name="districtId" value={filters.districtId} onChange={handleSelectChange}>
                <option value="">Район</option>
                {districts.map((district) => (<option key={district.id} value={district.id}>{district.title}</option>))}
            </select>

            <div className={styles.priceRangeRow}>
                <input type="number" name="priceMin" placeholder="от" value={filters.priceMin} onChange={handleSelectChange} />
                <input type="number" name="priceMax" placeholder="до" value={filters.priceMax} onChange={handleSelectChange} />
            </div>

            <div className={styles.roomsRow}>
                {ROOM_OPTIONS.map((room) => (
                    <label key={room} className={styles.roomCheckbox}>
                        <input type="checkbox" checked={filters.rooms.includes(room)} onChange={() => onRoomsToggle(room)}/>
                        {room}
                    </label>
                ))}
            </div>

            <div>
                <input type="text" placeholder="Поиск" value={searchInput} onChange={handleSearchChange} />
                {isSearchPending && <span className={styles.pending}>ожидание…</span>}
            </div>

            <select name="sortBy" value={filters.sortBy} onChange={handleSelectChange}>
                <option value="createdAt">По дате добавления</option>
                <option value="price">По цене</option>
                <option value="area">По площади</option>
                <option value="publishedAt">По дате публикации</option>
            </select>

            <select name="sortOrder" value={filters.sortOrder} onChange={handleSelectChange}>
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
            </select>
        </div>
    );
}