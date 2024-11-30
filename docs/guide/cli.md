# رابط خط فرمان - CLI

## سرور توسعه

### `vite`

سرور توسعه Vite را در دایرکتوری فعلی شروع کنید. `vite dev` و `vite serve` نام‌های مستعار برای `vite` هستند.

#### استفاده

```bash
vite [root]
```

استفاده از فایل پیکربندی مشخص شده

#### گزینه‌ها

| گزینه‌ها                   |                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `‎--host [host]`           | مشخص کردن نام هاست (`string`)                                                                              |
| `‎--port <port>‎`          | مشخص کردن پورت (`number`)                                                                                  |
| `‎--open [path]‎`          | باز کردن مرورگر در هنگام راه‌اندازی (`boolean \| string`)                                                              |
| `‎--cors`                  | فعال کردن CORS ؛(`boolean`)                                                                               |
| `‎--strictPort`            | خروج اگر پورت مشخص شده در حال استفاده باشد (`boolean`)                                                     |
| `‎--force`               | مجبور کردن بهینه‌ساز برای نادیده گرفتن کش و دوباره بیلد گرفتن (`boolean`)                                  |
| `‎-c, --config <file>‎`    | استفاده از فایل کانفیگ مشخص شده (`string`)                                                                 |
| `‎--base <path>‎`          | مسیر پایه public (پیش‌فرض: `/`) (`string`)                                                                 |
| `‎-l, --logLevel <level>‎` | info \| warn \| error \| silent (`string`)                                                                 |
| `‎--clearScreen`           | اجازه/غیرفعال کردن پاک کردن صفحه هنگام لاگ‌گیری (`boolean`)                                                |
| `‎--profile`               | شروع inspector داخلی Node.js ؛([Performance bottlenecks](/guide/troubleshooting#performance-bottlenecks)) |
| `‎-d, --debug [feat]‎`     | نمایش لاگ‌های دیباگ (`string \| boolean`)                                                                  |
| `‎-f, --filter <filter>‎`  | فیلتر کردن لاگ‌های دیباگ (`string`)                                                                        |
| `‎-m, --mode <mode>‎`      | تنظیم حالت env ؛(`string`)                                                                                |
| `‎-h, --help`              | نمایش گزینه‌های موجود CLI                                                                                  |
| `‎-v, --version`           | نمایش شماره نسخه                                                                                           |

## بیلد

### `vite build`

بیلد برای پروداکشن

#### استفاده

```bash
vite build [root]
```

#### گزینه‌ها

| گزینه‌ها                         |                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `‎--target <target>‎`            | هدف ترنسپایل (پیش‌فرض: `"modules"`) (`string`)                                                                      |
| `‎--outDir <dir>‎`               | دایرکتوری خروجی (پیش‌فرض: `dist`) (`string`)                                                                        |
| `‎--assetsDir <dir>‎`            | دایرکتوری زیر outDir برای قرار دادن asset ها (پیش‌فرض: `"assets"`) (`string`)                                       |
| `‎--assetsInlineLimit <number>‎` | حد آستانه inline دارایی‌های استاتیک به صورت base64 بر حسب بایت (پیش‌فرض: `4096`) (`number`)                         |
| `‎--ssr [entry]‎`                | ورودی مشخص شده برای رندرینگ سمت سرور (SSR) (`string`)                                                          |
| `‎--sourcemap [output]‎`         | خروجی source map برای بیلد (پیش‌فرض: `false`) (`boolean \| "inline" \| "hidden"`)                                 |
| `‎--minify [minifier]‎`          | فعال/غیرفعال کردن فشرده‌سازی، یا مشخص کردن فشرده‌سازی برای استفاده (پیش‌فرض: `"esbuild"`) (`boolean \| "terser" \| "esbuild"`) |
| `‎--manifest [name]‎`            | تولید فایل json مانیفست بیلد (`boolean \| string`)                                                                  |
| `‎--ssrManifest [name]‎`         | تولید فایل json مانیفست ssr ؛(`boole   an \| string`)                                                                  |
| `‎--emptyOutDir‎`                | خالی کردن اجباری outDir وقتی که خارج از root است (`boolean`)                                                        |
| `‎-w, --watch`                   | اجرای مجدد بیلد هنگام تغییر در فایل‌ها یا ماژول‌ها (`boolean`)                                                              |
| `‎-c, --config <file>‎`          | استفاده از فایل کانفیگ مشخص شده (`string`)                                                                          |
| `‎--base <path>‎`                | مسیر پایه عمومی (پیش‌فرض: `/`) (`string`)                                                                           |
| `‎-l, --logLevel <level>‎`       | Info \| warn \| error \| silent (`string`)                                                                          |
| `‎--clearScreen`                 | اجازه/غیرفعال کردن پاک کردن صفحه هنگام لاگ‌گیری (`boolean`)                                                         |
| `‎--profile`               | شروع inspector داخلی Node.js ؛([Performance bottlenecks](/guide/troubleshooting#performance-bottlenecks)) |
| `‎-d, --debug [feat]‎`           | نمایش لاگ‌های دیباگ (`string \| boolean`)                                                                           |
| `‎-f, --filter <filter>‎`        | فیلتر کردن لاگ‌های دیباگ (`string`)                                                                                 |
| `‎-m, --mode <mode>‎`            | تنظیم حالت env ؛(`string`)                                                                                          |
| `‎-h, --help`                    | نمایش گزینه‌های موجود CLI                                                                                           |
| `‎--app`                         | بیلد همه محیط‌ها، مشابه `builder: {}` (`boolean`, آزمایشی)                                             |

## سایر موارد

### `vite optimize`

پیش‌باندل وابستگی‌ها.

#### استفاده

```bash
vite optimize [root]
```

#### گزینه‌ها

| گزینه‌ها                   | توضیحات                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `‎--force`                 | مجبور کردن بهینه‌ساز برای نادیده گرفتن کش و دوباره بیلد گرفتن (`boolean`) |
| `‎-c, --config <file>‎`    | استفاده از فایل کانفیگ مشخص شده (`string`)                                |
| `‎--base <path>‎`          | مسیر پایه public (پیش‌فرض: `/`) (`string`)                                |
| `‎-l, --logLevel <level>‎` | Info \| warn \| error \| silent (`string`)                                |
| `‎--clearScreen`           | اجازه/غیرفعال کردن پاک کردن صفحه هنگام لاگ‌گیری (`boolean`)               |
| `‎-d, --debug [feat]‎`     | نمایش لاگ‌های دیباگ (`string \| boolean`)                                 |
| `‎-f, --filter <filter>‎`  | فیلتر کردن لاگ‌های دیباگ (`string`)                                       |
| `‎-m, --mode <mode>‎`      | تنظیم حالت env ؛(`string`)                                                |
| `‎-h, --help`              | نمایش گزینه‌های موجود CLI                                                 |

### `vite preview`

پیش‌نمایش محلی بیلد پروداکشن. از این به عنوان سرور پروداکشن استفاده نکنید زیرا برای این منظور طراحی نشده است.

#### استفاده

```bash
vite preview [root]
```

#### گزینه‌ها

| گزینه‌ها                   |                                                             |
| -------------------------- | ----------------------------------------------------------- |
| `‎--host [host]`           | مشخص کردن نام هاست (`string`)                               |
| `‎--port <port>‎`          | مشخص کردن پورت (`number`)                                   |
| `‎--strictPort`            | خروج اگر پورت مشخص شده در حال استفاده باشد (`boolean`)      |
| `‎--open [path]‎`          | باز کردن مرورگر در هنگام راه‌اندازی (`boolean \| string`)                                                              |
| `‎--outDir <dir>‎`         | دایرکتوری خروجی (پیش‌فرض: `dist`) (`string`)                |
| `‎-c, --config <file>‎`    | استفاده از فایل کانفیگ مشخص شده (`string`)                  |
| `‎--base <path>‎`          | مسیر پایه عمومی (پیش‌فرض: `/`) (`string`)                   |
| `‎-l, --logLevel <level>‎` | Info \| warn \| error \| silent (`string`)                  |
| `‎--clearScreen`           | اجازه/غیرفعال کردن پاک کردن صفحه هنگام لاگ‌گیری (`boolean`) |
| `‎-d, --debug [feat]‎`     | نمایش لاگ‌های دیباگ (`string \| boolean`)                   |
| `‎-f, --filter <filter>‎`  | فیلتر کردن لاگ‌های دیباگ (`string`)                         |
| `‎-m, --mode <mode>‎`      | تنظیم حالت env ؛(`string`)                                  |
| `‎-h, --help`              | نمایش گزینه‌های موجود CLI                                   |
