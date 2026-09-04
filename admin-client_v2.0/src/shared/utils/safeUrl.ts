export function safeUrl(initialUrl: string | null): string | null {
    if(!initialUrl) return null;
    try {
        const url = new URL(initialUrl, window.location.origin);
        return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
    } catch {
        return null;
    }
}

export function getUrl(urlOrPath: string | null): string | null {
    if(!urlOrPath) return null;
    const isAbsolute = urlOrPath.toLowerCase().startsWith('http://') || urlOrPath.toLowerCase().startsWith('https://');
    let absoluteUrl: string;
    if(isAbsolute) {
        absoluteUrl = urlOrPath;
    } else {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
        absoluteUrl = `${apiBaseUrl}${cleanPath}`;
    }
    return safeUrl(absoluteUrl);
}