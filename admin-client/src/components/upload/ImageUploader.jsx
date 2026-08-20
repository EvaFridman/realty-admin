import styles from "./ImageUploader.module.css"
import { useState } from "react";
import Preview from "./Preview";

export default function ImageUploader({ upload, onDone }) {
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [uploaderKey, setUploaderKey] = useState(Date.now());

    function describeUploadError(uploadError) {
        if (uploadError.code === "ERR_CANCELED") return null;
        switch (uploadError.response?.status) {
            case 413: return "Файл больше 5 МБ — уменьшите или выберите другой";
            case 415: return "Поддерживаются только jpeg, png и webp";
            case 409: return "У объявления уже 5 фотографий";
            case 403: return "Это объявление не ваше";
            default: return uploadError.response ? "Не удалось загрузить, попробуйте ещё раз" : "Нет связи с сервером";
        }
    }

    const send = async () => {
        const controller = new AbortController();
        setAbortController(controller);
        setIsSending(true);
        setError(null);
        try {
            const result = await upload(files, { onProgress: setProgress, signal: controller.signal });
            setFiles([]);
            setUploaderKey(Date.now());
            onDone(result);
        } catch (uploadError) {
            setError(describeUploadError(uploadError))
        } finally {
            setIsSending(false);
            setProgress(0);
            setAbortController(null);
        }
    }

    return (
        <div className={styles.uploader}>
            <input key={uploaderKey} className={styles.input} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={isSending} onChange={(e) => setFiles(Array.from(e.target.files))} />
            <Preview files={files} />
            {error && <p className={styles.error}>{error}</p>}
            {isSending && (
                <div className={styles.progressRow}>
                    <progress className={styles.progress} value={progress} max={100} />
                    <button className={styles.cancelButton} onClick={() => abortController?.abort()}>Отменить</button>
                </div>
            )}
            <button className={styles.uploadButton} onClick={send} disabled={!files.length || isSending}>Загрузить {files.length || ""}</button>
        </div>
    );
}