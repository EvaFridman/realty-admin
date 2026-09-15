"use client";

import { useState } from "react";

type Props = {
    agentId: number;
};

export function AgentPhone({ agentId }: Props) {
    const [phone, setPhone] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleClick() {
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/agents/${agentId}/phone`);
            if (!response.ok) throw new Error("Не удалось получить телефон");
            const result = await response.json();
            setPhone(result.data.phone);
        } finally {
            setIsLoading(false);
        }
    }

    if (phone) return <a href={`tel:${phone}`}>{phone}</a>;

    return (
        <button type="button" onClick={handleClick} disabled={isLoading}>
            {isLoading ? "Загрузка..." : "Показать телефон"}
        </button>
    );
}