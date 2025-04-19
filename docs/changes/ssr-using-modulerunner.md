# SSR با استفاده از API `ModuleRunner`

::: tip بازخورد
بازخورد خود را در [بحث بازخورد API محیط](https://github.com/vitejs/vite/discussions/16358) با ما در میان بگذارید.
:::

`server.ssrLoadModule` با وارد کردن از یک [Module Runner](/guide/api-environment#modulerunner) جایگزین شده است.

دامنه تأثیر: `نویسندگان افزونه‌های Vite`

::: warning منسوخ شدن در آینده
`ModuleRunner` برای اولین بار در نسخه `v6.0` معرفی شد. منسوخ شدن `server.ssrLoadModule` برای یک نسخه اصلی آینده برنامه‌ریزی شده است. برای شناسایی استفاده خود، `future.removeSsrLoadModule` را در تنظیمات Vite خود روی `"warn"` تنظیم کنید.
:::

## انگیزه

متد `server.ssrLoadModule(url)` فقط امکان وارد کردن ماژول‌ها در محیط `ssr` را فراهم می‌کند و تنها می‌تواند ماژول‌ها را در همان پروسه سرور توسعه Vite اجرا کند. برای اپلیکیشن‌هایی با محیط‌های سفارشی، هر کدام با یک `ModuleRunner` مرتبط هستند که ممکن است در یک نخ یا پروسه جداگانه اجرا شود. برای وارد کردن ماژول‌ها، اکنون از `moduleRunner.import(url)` استفاده می‌کنیم.

## راهنمای مهاجرت

به [راهنمای API محیط برای فریم‌ورک‌ها](../guide/api-environment-frameworks.md) مراجعه کنید.
