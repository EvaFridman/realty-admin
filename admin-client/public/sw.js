const FILES_PREFIX = new URL(self.location.href).searchParams.get('apiBase') + '/uploads/';

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
    if (!event.request.url.startsWith(FILES_PREFIX)) return;
    event.respondWith(fetchWithToken(event.request));
});

async function fetchWithToken(request, retry = true) {
    const token = await getToken();

    const response = await fetch(request.url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "omit",
    });

    if (response.status === 401 && retry) {
        const tab = await getActiveTab();
        if (tab) {
            await ask(tab, { type: "REFRESH_TOKENS" });
            return fetchWithToken(request, false);
        }
    }

    return response;
}

async function getToken() {
    const tab = await getActiveTab();
    if (!tab) return null;
    return ask(tab, { type: "GET_TOKEN" });
}

async function getActiveTab() {
    const tabs = await self.clients.matchAll({ type: "window" });
    return tabs[0] || null;
}

function ask(tab, message) {
    return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => resolve(event.data);
        tab.postMessage(message, [channel.port2]);
    });
}