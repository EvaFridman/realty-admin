"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./ListingsFilter.module.css";

type District = {
    id: number;
    title: string;
    city: string;
    publishedListingsCount: number;
};

type Props = {
    districts: District[];
    lockedDistrictId?: number;
};

const PROPERTY_TYPES = [
    { value: "flat", label: "Квартира" },
    { value: "house", label: "Дом" },
    { value: "room", label: "Комната" },
    { value: "commercial", label: "Коммерческая" },
];

const ROOMS = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4+" },
];

export function ListingFilterPanel({ districts, lockedDistrictId }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [dealType, setDealType] = useState(searchParams.get("dealType") ?? "sale");
    const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") ?? "");
    const [districtId, setDistrictId] = useState(lockedDistrictId ? String(lockedDistrictId) : searchParams.get("districtId") ?? "");
    const [selectedRooms, setSelectedRooms] = useState(searchParams.getAll("rooms"));
    const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
    const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");
    const [areaMin, setAreaMin] = useState(searchParams.get("areaMin") ?? "");
    const [areaMax, setAreaMax] = useState(searchParams.get("areaMax") ?? "");
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [districtSearch, setDistrictSearch] = useState("");
    const filteredDistricts = districts.filter((district) => district.title.toLowerCase().includes(districtSearch.toLowerCase()));

    function toggleRoom(value: string) {
        setSelectedRooms((current) => current.includes(value) ? current.filter((room) => room !== value) : [...current, value]);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        params.delete("dealType");
        params.delete("propertyType");
        if (lockedDistrictId === undefined) params.delete("districtId");
        params.delete("rooms");
        params.delete("priceMin");
        params.delete("priceMax");
        params.delete("areaMin");
        params.delete("areaMax");
        params.delete("search");

        if (dealType) params.set("dealType", dealType);
        if (propertyType) params.set("propertyType", propertyType);
        if (districtId) params.set("districtId", districtId);
        if (priceMin) params.set("priceMin", priceMin);
        if (priceMax) params.set("priceMax", priceMax);
        if (areaMin) params.set("areaMin", areaMin);
        if (areaMax) params.set("areaMax", areaMax);
        if (search.trim()) params.set("search", search.trim());

        selectedRooms.forEach((room) => { params.append("rooms", room) });

        params.set("page", "1");

        router.replace(`${pathname}?${params.toString()}`);
    }

    function resetFilters() {
        setDealType("sale");
        setPropertyType("");
        setDistrictId(lockedDistrictId !== undefined ? String(lockedDistrictId) : "");
        setSelectedRooms([]);
        setPriceMin("");
        setPriceMax("");
        setAreaMin("");
        setAreaMax("");
        setSearch("");
        setDistrictSearch("");
    
        const params = new URLSearchParams(searchParams.toString());
    
        [
            "dealType",
            "propertyType",
            "rooms",
            "priceMin",
            "priceMax",
            "areaMin",
            "areaMax",
            "search",
        ].forEach((name) => params.delete(name));
    
        if (lockedDistrictId === undefined) params.delete("districtId");
        else params.set("districtId", String(lockedDistrictId));
    
        params.set("page", "1");
    
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <form className={styles.panel} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <h2>Фильтры</h2>
                <button type="button" className={styles.reset} onClick={resetFilters}>Сбросить</button>
            </div>

            <fieldset className={styles.fieldset}>
                <legend>Тип сделки</legend>

                <div className={styles.dealTypes}>
                    <button type="button" className={dealType === "sale" ? styles.dealActive : styles.dealButton} onClick={() => setDealType("sale")}>
                        Купить
                    </button>
                    <button type="button" className={dealType === "rent" ? styles.dealActive : styles.dealButton} onClick={() => setDealType("rent")}>
                        Снять
                    </button>
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Тип недвижимости</legend>

                <div className={styles.options}>
                    {PROPERTY_TYPES.map((type) => (
                        <label key={type.value} className={styles.option}>
                            <input
                                type="radio"
                                name="propertyType"
                                value={type.value}
                                checked={propertyType === type.value} onChange={(event) => setPropertyType(event.target.value)}
                            />
                            <span>{type.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Район</legend>

                <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="Поиск района"
                    value={districtSearch}
                    onChange={(event) => setDistrictSearch(event.target.value)}
                />

                <div className={styles.districts}>
                    {filteredDistricts.map((district) => (
                        <label key={district.id} className={styles.district}>
                            <input
                                type="radio"
                                name="district"
                                value={district.id}
                                checked={districtId === String(district.id)}
                                disabled={lockedDistrictId !== undefined}
                                onChange={(event) => setDistrictId(event.target.value)}
                            />

                            <span className={styles.districtTitle}>{district.title}</span>

                            <span className={styles.districtCount}>{district.publishedListingsCount}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Цена, ₽</legend>

                <div className={styles.range}>
                    <input
                        type="number"
                        min="0"
                        placeholder="От"
                        value={priceMin}
                        onChange={(event) => setPriceMin(event.target.value)}
                    />

                    <input
                        type="number"
                        min="0"
                        placeholder="До"
                        value={priceMax}
                        onChange={(event) => setPriceMax(event.target.value)}
                    />
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Площадь, м²</legend>

                <div className={styles.range}>
                    <input
                        type="number"
                        min="0"
                        placeholder="От"
                        value={areaMin}
                        onChange={(event) => setAreaMin(event.target.value)}
                    />

                    <input
                        type="number"
                        min="0"
                        placeholder="До"
                        value={areaMax}
                        onChange={(event) => setAreaMax(event.target.value)}
                    />
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Комнат</legend>

                <div className={styles.rooms}>
                    {ROOMS.map((room) => (
                        <label key={room.value} className={selectedRooms.includes(room.value) ? styles.roomActive : styles.room}>
                            <input type="checkbox" checked={selectedRooms.includes(room.value)} onChange={() => toggleRoom(room.value)} />
                            <span>{room.label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
                <legend>Название или адрес</legend>

                <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="Название или адрес"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </fieldset>

            <button type="submit" className={styles.submit}>Показать объявления</button>
        </form>
    );
}