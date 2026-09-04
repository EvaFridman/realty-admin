import { useEffect, useMemo } from "react";

type PreviewProps = { files: File[] };

export default function Preview({ files }: PreviewProps) {
    const urls = useMemo(
        () => files.map((file) => URL.createObjectURL(file)), [files]
    );
    useEffect(() => {
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [urls]);
    return urls.map((url, i) => <img key={url} src={url} alt={`Фото ${i + 1}`} width={120} height={120}/>);
}