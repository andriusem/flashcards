
### 🛠️ Steps to Turn Your App into a PWA

#### ✅ 1. **Add a Web App Manifest**

Create a file named `manifest.json` in your app’s root folder and add:

```json
{
  "name": "Phrasal Verb Flashcards",
  "short_name": "Flashcards",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a202c",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

> 🖼 You’ll need two icons (PNG format): `icon-192.png` and `icon-512.png` in a folder like `/icons`.

#### 📎 Add it to your HTML:

```html
<link rel="manifest" href="/manifest.json">
```

---

#### ✅ 2. **Create a Service Worker**

In your project root, create a file: `service-worker.js`  
This is a simple example to cache files:

```js
const CACHE_NAME = "flashcard-cache-v1";
const urlsToCache = ["/", "/index.html", "/styles.css", "/app.js", "/manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

---

#### ✅ 3. **Register the Service Worker in your JS**

In your main JavaScript file (`app.js` or similar):

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered successfully."))
    .catch(err => console.error("Service Worker registration failed:", err));
}
```

---

#### ✅ 4. **Serve Your App Over HTTPS**

PWAs **require HTTPS**, even for local testing. You can:

- Use **Netlify**, **Vercel**, or **GitHub Pages** — they all serve over HTTPS.
- For local testing, use tools like:
  - [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code)
  - Or serve via a local HTTPS dev server

---

#### ✅ 5. **Test the PWA**

- Open the app in **Chrome**
- Go to **Developer Tools → Application** tab
- Check if:
  - Manifest is loaded ✅
  - Service Worker is active ✅
- You should now see a prompt like “**Install App**” in the browser address bar or the menu

---

Would you like a starter PWA zip or GitHub repo to use as a base?