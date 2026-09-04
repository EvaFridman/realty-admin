import axios from "axios";
import { useState } from "react";
import styles from "./ImageUploader.module.css";
import Preview from "./Preview";
import describeUploadError from "@/shared/utils/describeUploadError";

type UploadOptions = {
    onProgress: (progress: number) => void;
    signal: AbortSignal;
};

type ImageUploaderProps<T> = {
    upload: (files: File[], options: UploadOptions) => Promise<T>;
    onDone: (result: T) => void;
    maxSize?: number;
    maxFiles?: number;
};

export default function ImageUploader<T>({ upload, onDone, maxSize = 5, maxFiles = 5 }: ImageUploaderProps<T>) {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [uploaderKey, setUploaderKey] = useState(Date.now());

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
            if (axios.isAxiosError(uploadError)) {
                setError(describeUploadError(uploadError, maxSize, maxFiles));
            } else {
                setError("Не удалось загрузить, попробуйте ещё раз");
            }
        } finally {
            setIsSending(false);
            setProgress(0);
            setAbortController(null);
        }
    };

    return (
        <div className={styles.uploader}>
            <input key={uploaderKey} className={styles.input} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={isSending} onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
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