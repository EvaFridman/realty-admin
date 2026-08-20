import { useMemo, useEffect } from "react";

export default function Preview({ files }) {
    const urls = useMemo(
        () => files.map((file) => URL.createObjectURL(file)), [files]
    );
    useEffect(() => {
        return () => urls.forEach(URL.revokeObjectURL);
    }, [urls]);
    return urls.map((url, i) => <img key={url} src={url} alt={`Фото ${i + 1}`} width={120} height={120}/>);
}