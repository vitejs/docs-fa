# انتقال به APIهای مخصوص هر محیط

::: tip بازخورد
بازخورد خود را در [بحث بازخورد API محیط](https://github.com/vitejs/vite/discussions/16358) با ما در میان بگذارید.
:::

چندین API از `ViteDevServer` که به گراف ماژول‌ها و تبدیل ماژول‌ها مرتبط بودند، به نمونه‌های `DevEnvironment` منتقل شده‌اند.

دامنه تأثیر: `نویسندگان افزونه‌های Vite`

::: warning منسوخ شدن در آینده
نمونه `Environment` برای اولین بار در نسخه `v6.0` معرفی شد. منسوخ شدن `server.moduleGraph` و سایر متدهایی که اکنون در محیط‌ها قرار دارند، برای نسخه `v7.0` برنامه‌ریزی شده است. هنوز توصیه نمی‌کنیم از متدهای سرور فاصله بگیرید. برای شناسایی استفاده خود، این موارد را در تنظیمات Vite خود تنظیم کنید:

```ts
future: {
  removeServerModuleGraph: 'warn',
  removeServerTransformRequest: 'warn',
}
```

:::

## انگیزه

در Vite نسخه ۵ و قبل از آن، یک سرور توسعه Vite همیشه دو محیط (`client` و `ssr`) داشت. گراف `server.moduleGraph` شامل ماژول‌هایی از هر دو این محیط‌ها به‌صورت مخلوط بود. گره‌ها از طریق لیست‌های `clientImportedModules` و `ssrImportedModules` به هم متصل بودند (اما یک لیست واحد `importers` برای هر کدام نگهداری می‌شد). یک ماژول تبدیل‌شده با یک `id` و یک مقدار بولین `ssr` نمایش داده می‌شد. این مقدار بولین باید به APIها منتقل می‌شد، به عنوان مثال `server.moduleGraph.getModuleByUrl(url, ssr)` و `server.transformRequest(url, { ssr })`.

در Vite نسخه ۶، اکنون امکان ایجاد هر تعداد محیط سفارشی (`client`، `ssr`، `edge` و غیره) وجود دارد. یک مقدار بولین ساده `ssr` دیگر کافی نیست. به جای تغییر APIها به شکلی مانند `server.transformRequest(url, { environment })`، این متدها را به نمونه محیط منتقل کردیم تا بتوان آن‌ها را بدون نیاز به سرور توسعه Vite فراخوانی کرد.

## راهنمای مهاجرت

- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment#separate-module-graphs)
- `server.transformRequest(url, ssr)` -> `environment.transformRequest(url)`
- `server.warmupRequest(url, ssr)` -> `environment.warmupRequest(url)`
