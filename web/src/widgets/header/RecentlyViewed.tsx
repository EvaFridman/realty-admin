import { cookies } from "next/headers";

import styles from "./Header.module.css";

export async function RecentlyViewed() {
    const cookieStore = await cookies();
    const value = cookieStore.get("recentlyViewed")?.value;
    if (!value) return null;
    const ids = decodeURIComponent(value).split(",").filter(Boolean);
    if (!ids.length) return null;

    return (
        <div className={styles.recentlyViewed}>
            <span>Вы смотрели: </span>
            {ids.map((id, index) => (<span key={id}> {index > 0 && ", "} #{id}</span>))}
        </div>
    );
}