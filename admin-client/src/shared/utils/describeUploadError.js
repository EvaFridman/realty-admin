export default function describeUploadError(uploadError, fileSize, filesNumber) {
    if (uploadError.code === "ERR_CANCELED") return null;
    switch (uploadError.response?.status) {
        case 413: return `Файл больше ${fileSize} МБ — уменьшите или выберите другой`;
        case 415: return "Поддерживаются только jpeg, png и webp";
        case 409: return `У объявления уже ${filesNumber} фотографий`;
        case 403: return "Это объявление не ваше";
        default: return uploadError.response ? "Не удалось загрузить, попробуйте ещё раз" : "Нет связи с сервером";
    }
}