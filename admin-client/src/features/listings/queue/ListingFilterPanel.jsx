import styles from './ListingFilterPanel.module.css';
import { useState, useEffect } from 'react';
import { dealTypeLabels, propertyTypeLabels } from '../../../constants/adminData';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

const ROOM_OPTIONS = [1, 2, 3, 4, 5];
const SEARCH_DELAY_MS = 350;

export default function ListingFilterPanel({ filters, districts, onFieldChange, onSearchChange, onRoomsToggle }) {
    const [searchInput, setSearchInput] = useState(filters.search);
    const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DELAY_MS);

    useEffect(() => {
        if (debouncedSearch === filters.search) return;
        onSearchChange(debouncedSearch);
    }, [debouncedSearch, filters.search, onSearchChange]);

    function handleSearchChange(e) {
        setSearchInput(e.target.value);
    }

    function handleSelectChange(e) {
        onFieldChange(e.target.name, e.target.value);
    }

    const isPending = searchInput !== debouncedSearch;

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
                {isPending && <span className={styles.pending}>ожидание…</span>}
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