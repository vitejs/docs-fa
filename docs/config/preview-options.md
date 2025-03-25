# گزینه‌های پیش‌نمایش

مگر آنکه ذکر شده باشد، گزینه‌های این بخش فقط به پیش‌نمایش اعمال می‌شوند.

## preview.host

- **نوع:** `string | boolean`
- **پیش‌فرض:** [`server.host`](./server-options#server-host)

آدرس‌های IP که سرور باید به آنها گوش دهد را مشخص کنید.
این گزینه را به `0.0.0.0` یا `true` تنظیم کنید تا بر روی همه آدرس‌ها، شامل آدرس‌های LAN و عمومی، گوش دهد.

این گزینه را می‌توان از طریق CLI با استفاده از `--host 0.0.0.0` یا `--host` تنظیم کرد.

::: نکته

در برخی موارد، ممکن است سرورهای دیگر پاسخ دهند به جای Vite.
برای جزئیات بیشتر به [`server.host`](./server-options#server-host) مراجعه کنید.

:::

## preview.allowedHosts

- **نوع:** `string | true`
- **پیش‌فرض:** [`server.allowedHosts`](./server-options#server-allowedhosts)

نام‌های میزبان‌هایی که Vite مجاز به پاسخ دادن به آنها است.

برای جزئیات بیشتر به [`server.allowedHosts`](./server-options#server-allowedhosts) مراجعه کنید.

## preview.port

- **نوع:** `number`
- **پیش‌فرض:** `4173`

پورت سرور را مشخص کنید. توجه داشته باشید که اگر پورت قبلاً استفاده شده باشد، Vite به‌طور خودکار سعی خواهد کرد از پورت بعدی استفاده کند، بنابراین این ممکن است پورت واقعی نباشد که سرور در نهایت به آن گوش می‌دهد.

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

- **نوع:** `boolean`
- **پیش‌فرض:** [`server.strictPort`](./server-options#server-strictport)

اگر پورت در حال حاضر در دسترس است، برای خروج از ساختار پورت به‌جای تلاش خودکار برای استفاده از پورت بعدی، آن را به `true` تنظیم کنید.

## preview.https

- **نوع:** `https.ServerOptions`
- **پیش‌فرض:** [`server.https`](./server-options#server-https)

فعال‌سازی TLS + HTTP/2. توجه کنید که این گزینه زمانی که گزینه [`server.proxy`](./server-options#server-proxy) نیز استفاده می‌شود، به TLS فقط کاهش می‌یابد.

مقدار می‌تواند همچنین یک [شیء گزینه‌ها](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) باشد که به `https.createServer()` ارسال می‌شود.

## preview.open

- **نوع:** `boolean | string`
- **پیش‌فرض:** [`server.open`](./server-options#server-open)

باز کردن خودکار اپلیکیشن در مرورگر هنگام شروع سرور. وقتی مقدار آن یک رشته باشد، به‌عنوان نام مسیر URL استفاده خواهد شد. اگر می‌خواهید سرور را در مرورگر خاصی که می‌خواهید باز کنید، می‌توانید متغیر محیطی `process.env.BROWSER` را تنظیم کنید (مثلاً `firefox`). همچنین می‌توانید `process.env.BROWSER_ARGS` را برای ارسال آرگومان‌های اضافی تنظیم کنید (مثلاً `--incognito`).

`BROWSER` و `BROWSER_ARGS` همچنین متغیرهای محیطی خاصی هستند که می‌توانید در فایل `.env` تنظیم کنید. برای جزئیات بیشتر به [پکیج `open`](https://github.com/sindresorhus/open#app) مراجعه کنید.

## preview.proxy

- **نوع:** `Record<string, string | ProxyOptions>`
- **پیش‌فرض:** [`server.proxy`](./server-options#server-proxy)

پیکربندی قوانین پروکسی سفارشی برای سرور پیش‌نمایش. انتظار می‌رود یک شیء از جفت‌های `{ کلید: گزینه‌ها }` باشد. اگر کلید با `^` شروع شود، به‌عنوان `RegExp` تفسیر خواهد شد. گزینه `configure` برای دسترسی به نمونه پروکسی استفاده می‌شود.

از [`http-proxy`](https://github.com/http-party/node-http-proxy) استفاده می‌کند. گزینه‌های کامل [اینجا](https://github.com/http-party/node-http-proxy#options) موجود است.

## preview.cors

- **نوع:** `boolean | CorsOptions`
- **پیش‌فرض:** [`server.cors`](./server-options#server-cors)

پیکربندی CORS برای سرور پیش‌نمایش.

برای جزئیات بیشتر به [`server.cors`](./server-options#server-cors) مراجعه کنید.

## preview.headers

- **نوع:** `OutgoingHttpHeaders`

هدینگ‌های پاسخ سرور را مشخص کنید.