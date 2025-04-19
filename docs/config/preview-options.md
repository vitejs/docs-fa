# گزینه‌های پیش‌نمایش

مگر اینکه ذکر شده باشه، گزینه‌های این بخش فقط برای پیش‌نمایش اعمال می‌شن.

## preview.host

- **تایپ:** `string | boolean`
- **پیش‌فرض:** [`server.host`](./server-options#server-host)

مشخص می‌کنه سرور باید روی کدوم آدرس‌های IP گوش کنه. با تنظیم این روی `0.0.0.0` یا `true`، سرور روی همه آدرس‌ها، از جمله شبکه محلی (LAN) و آدرس‌های عمومی، گوش می‌ده.

این می‌تونه از طریق CLI با `host 0.0.0.0--` یا `host--` تنظیم بشه.

::: tip نکته
بعضی وقت‌ها ممکنه سرورهای دیگه به جای Vite پاسخ بدن. برای جزئیات بیشتر به [`server.host`](./server-options#server-host) نگاه کنید.
:::

## preview.allowedHosts

- **تایپ:** `string | true`
- **پیش‌فرض:** [`server.allowedHosts`](./server-options#server-allowedhosts)

نام‌های میزبانی که Vite اجازه داره بهشون پاسخ بده.

برای جزئیات بیشتر به [`server.allowedHosts`](./server-options#server-allowedhosts) مراجعه کنید.

## preview.port

- **تایپ:** `number`
- **پیش‌فرض:** `4173`

پورت سرور رو مشخص می‌کنه. اگه پورت از قبل در حال استفاده باشه، Vite به‌طور خودکار پورت بعدی در دسترس رو امتحان می‌کنه، پس ممکنه این پورت واقعی‌ای که سرور روش گوش می‌ده نباشه.

**مثال:**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort

- **تایپ:** `boolean`
- **پیش‌فرض:** [`server.strictPort`](./server-options#server-strictport)

اگه روی `true` تنظیم بشه، در صورتی که پورت در حال استفاده باشه، برنامه خارج می‌شه و به جای امتحان خودکار پورت بعدی، خطا می‌ده.

## preview.https

- **تایپ:** `https.ServerOptions`
- **پیش‌فرض:** [`server.https`](./server-options#server-https)

TLS و HTTP/2 رو فعال می‌کنه.

برای جزئیات بیشتر به [`server.https`](./server-options#server-https) نگاه کنید.

## preview.open

- **تایپ:** `boolean | string`
- **پیش‌فرض:** [`server.open`](./server-options#server-open)

با شروع سرور، برنامه رو به‌طور خودکار توی مرورگر باز می‌کنه. اگه مقدار یه رشته باشه، به عنوان مسیر URL استفاده می‌شه. اگه می‌خواید سرور توی مرورگر خاصی که دوست دارید باز بشه، می‌تونید متغیر محیطی `process.env.BROWSER` رو تنظیم کنید (مثلاً `firefox`). همچنین می‌تونید با `process.env.BROWSER_ARGS` آرگومان‌های اضافی بفرستید (مثلاً `incognito--`).

`BROWSER` و `BROWSER_ARGS` متغیرهای محیطی خاصی هستن که می‌تونید توی فایل `env.` تنظیم‌شون کنید. برای جزئیات بیشتر به [پکیج `open`](https://github.com/sindresorhus/open#app) مراجعه کنید.

## preview.proxy

- **تایپ:** `<Record<string, string | ProxyOptions`
- **پیش‌فرض:** [`server.proxy`](./server-options#server-proxy)

قوانین پراکسی سفارشی رو برای سرور پیش‌نمایش پیکربندی می‌کنه. یه آبجکت از جفت‌های `‎{ key: options }` انتظار داره. اگه کلید با `^` شروع بشه، به عنوان `RegExp` تفسیر می‌شه. گزینه `configure` می‌تونه برای دسترسی به نمونه پراکسی استفاده بشه.

از [`http-proxy`](https://github.com/http-party/node-http-proxy) استفاده می‌کنه. گزینه‌های کامل رو [اینجا](https://github.com/http-party/node-http-proxy#options) ببینید.

## preview.cors

- **تایپ:** `boolean | CorsOptions`
- **پیش‌فرض:** [`server.cors`](./server-options#server-cors)

CORS رو برای سرور پیش‌نمایش پیکربندی می‌کنه.

برای جزئیات بیشتر به [`server.cors`](./server-options#server-cors) نگاه کنید.

## preview.headers

- **تایپ:** `OutgoingHttpHeaders`

هدرهای پاسخ سرور رو مشخص می‌کنه.
