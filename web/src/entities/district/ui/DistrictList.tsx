import type { PublicDistrictType } from "@/entities/district/types";
import { formatListingsCount } from "@/shared/lib/format";
import styles from "./DistrictList.module.css";

type Props = {
    districts: PublicDistrictType[];
};

export function DistrictList({ districts }: Props) {
    return (
        <div className={styles.list}>
            {districts.map((district) => (
                <div key={district.id} className={styles.item}>
                    <h3>{district.title}</h3>
                    <span>{formatListingsCount(district.publishedListingsCount)}</span>
                </div>
            ))}
        </div>
    );
}