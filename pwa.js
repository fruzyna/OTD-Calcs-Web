const CACHE_NAME = 'otd-221022'
const CACHE_LIST = [
    // html files
    '/index.html',
    // styles
    '/style.css',
    // scripts
    '/script.js',
    // icons
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-256x256.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
]

// store files to cache on install
self.addEventListener('install', e => {
    e.waitUntil((async () => {
        const CACHE = await caches.open(CACHE_NAME)
        await CACHE.addAll(CACHE_LIST)
    })())
})

// use cache instead of server
self.addEventListener('fetch', e => {
    e.respondWith((async () => {
        // attempt to pull resource from cache
        const R = await caches.match(e.request, {ignoreSearch: true})
        if (R)
        {
            return R
        }
        
        // if not there pull from server
        const RES = await fetch(e.request)
        const URL = e.request.url
        for (let file of CACHE_LIST)
        {
            if (URL.endsWith(file))
            {
                const CACHE = await caches.open(CACHE_NAME)
                await CACHE.addAll(CACHE_LIST)
                break
            }
        }
        return RES
    })())
})

// remove old caches
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
            if (key != CACHE_NAME)
            {
                return caches.delete(key)
            }
        }))
    }))
})