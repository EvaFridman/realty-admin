import type { ReactNode } from 'react';
import { useEffect, useMemo } from "react";

type Props = { files: File[] };

export default function ImagePreview({ files }: Props): ReactNode {
    const urls = useMemo(
        () => files.map((file) => URL.createObjectURL(file)), [files]
    );
    useEffect(() => {
        return () => { urls.forEach((url) => { URL.revokeObjectURL(url); }); };
    }, [urls]);
    return urls.map((url, i) => <img key={url} src={url} alt={`Фото ${String(i + 1)}`} width={120} height={120}/>);
}