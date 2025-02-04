# متغیرهای محیطی (Env Variables) و حالت‌ها

## متغیرهای محیطی (Env Variables)

Vite متغیرهای محیطی (Env Variables) را روی شیء ویژه‌ی **`import.meta.env`** قرار می‌دهد که در زمان ساخت (build) به صورت ایستا جایگزین می‌شوند. برخی از متغیرهای داخلی در همه‌ی شرایط در دسترس هستند:

- **`import.meta.env.MODE`**: {string} [حالت](#modes) اجرای برنامه.

- **`import.meta.env.BASE_URL`**: {string} آدرس پایه‌ای (base url) که برنامه از آن سرویس‌دهی می‌شود. این مقدار توسط [`base` config option](/config/shared-options.md#base) تعیین می‌شود.

- **`import.meta.env.PROD`**: {boolean} مشخص می‌کند که آیا برنامه در حالت production در حال اجراست یا خیر. (این حالت زمانی فعال می‌شود که سرور توسعه با `NODE_ENV='production'` اجرا شود یا برنامه‌ای که با `NODE_ENV='production'` ساخته شده است، در حال اجرا باشد).

- **`import.meta.env.DEV`**: {boolean} مشخص می‌کند که آیا برنامه در حالت توسعه (development) اجرا می‌شود یا خیر (این مقدار همیشه برعکس `import.meta.env.PROD` است).

- **`import.meta.env.SSR`**: {boolean} مشخص می‌کند که آیا برنامه در [server](./ssr.md#conditional-logic) اجرا می‌شود یا خیر.

## فایل‌های `.env`

Vite از [dotenv](https://github.com/motdotla/dotenv) برای بارگذاری متغیرهای محیطی (environment variables) اضافی از فایل‌های زیر در دایرکتوری محیط [environment directory](/config/shared-options.md#envdir) استفاده می‌کند:

```
.env                # در همه موارد بارگذاری می‌شود
.env.local          # در همه موارد بارگذاری می‌شود، اما توسط git نادیده گرفته می‌شود
.env.[mode]         # فقط در حالت مشخص‌شده بارگذاری می‌شود
.env.[mode].local   # فقط در حالت مشخص‌شده بارگذاری می‌شود و توسط git نادیده گرفته می‌شود
```

:::tip اولویت‌های بارگذاری فایل‌های Env

یک فایل env مربوط به حالت خاص (مثلاً `.env.production`) اولویت بالاتری نسبت به فایل‌های عمومی (مثلاً `.env`) خواهد داشت.

Vite همیشه فایل‌های `.env` و `.env.local` را علاوه بر فایل مخصوص هر حالت (مانند `.env.[mode]`) بارگذاری می‌کند. متغیرهایی که در فایل‌های مخصوص هر حالت تعریف شده‌اند، نسبت به متغیرهای موجود در فایل‌های عمومی اولویت دارند. با این حال، متغیرهایی که فقط در `.env` یا `.env.local` تعریف شده‌اند، همچنان در محیط (environment) در دسترس خواهند بود.

علاوه بر این، متغیرهای محیطی (environment variables) که از قبل در هنگام اجرای Vite وجود دارند، بالاترین اولویت را دارند و توسط فایل‌های `.env` بازنویسی نمی‌شوند. به عنوان مثال، هنگام اجرای دستوری مانند `VITE_SOME_KEY=123 vite build`.

فایل‌های `.env` در هنگام راه‌اندازی Vite بارگذاری می‌شوند. پس از ایجاد تغییرات، سرور را دوباره راه‌اندازی کنید.
:::

متغیرهای محیطی (environment variables) بارگذاری‌شده همچنین از طریق `import.meta.env` به شکل رشته‌هایی در کد سمت کلاینت شما قابل دسترسی هستند.

برای جلوگیری از انتشار ناخواسته‌ی متغیرهای محیطی (environment variables) به سمت کلاینت، فقط متغیرهایی که با پیشوند `VITE_` شروع می‌شوند، در کدهای پردازش‌شده توسط Vite قابل استفاده خواهند بود. برای مثال، در مورد متغیرهای محیطی زیر:

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

فقط `VITE_SOME_KEY` به عنوان `import.meta.env.VITE_SOME_KEY` در کد سمت کلاینت شما در دسترس خواهد بود، اما `DB_PASSWORD` در دسترس نخواهد بود.

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

:::tip تجزیه‌ی ENV

همان‌طور که در بالا نشان داده شد، `VITE_SOME_KEY` یک عدد است، اما پس از تجزیه به صورت رشته بازگردانده می‌شود. همین اتفاق برای متغیرهای محیطی (environment variables) از نوع boolean نیز رخ می‌دهد. هنگام استفاده از این متغیرها در کد خود، مطمئن شوید که آن‌ها را به نوع داده‌ی مورد نظر تبدیل کنید.
:::

همچنین، Vite از [dotenv-expand](https://github.com/motdotla/dotenv-expand) برای گسترش متغیرهای نوشته‌شده در فایل‌های env به صورت پیش‌فرض استفاده می‌کند. برای یادگیری بیشتر درباره syntax این قابلیت، می‌توانید [مستندات آن‌ها](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow) را بررسی کنید.

توجه کنید که اگر قصد دارید از `$` در مقدار متغیر محیطی خود استفاده کنید، باید آن را با `\` (بک‌اسلش) قرار دهید.

```[.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

اگر می‌خواهید پیشوند (prefix) متغیرهای محیطی را سفارشی کنید، به گزینه [envPrefix](/config/shared-options.html#envprefix) مراجعه کنید.

:::warning نکات امنیتی

- فایل‌های `.env.*.local` فقط به صورت محلی (local-only) هستند و می‌توانند شامل متغیرهای حساس باشند. شما باید `*.local` را به فایل `.gitignore` خود اضافه کنید تا از ثبت آن‌ها در git جلوگیری شود.

- از آنجایی که هر متغیری که در سورس کد Vite شما قرار می‌گیرد، در نهایت به باندل (bundle) سمت کلاینت راه پیدا می‌کند، متغیرهای `VITE_*` **نباید** شامل هیچ اطلاعات حساسی باشند.
  :::

### IntelliSense برای TypeScript

به‌طور پیش‌فرض، Vite تعاریف نوع (Type Definitions) برای `import.meta.env` را در فایل `vite/client.d.ts` ارائه می‌دهد. در حالی که می‌توانید متغیرهای محیطی (environment variables) سفارشی‌تری را در فایل‌های `.env.[mode]` تعریف کنید، ممکن است بخواهید از قابلیت IntelliSense TypeScript برای متغیرهای env تعریف‌شده توسط کاربر که با پیشوند `VITE_` شروع می‌شوند، استفاده کنید.

برای این کار، می‌توانید یک فایل `vite-env.d.ts` در پوشه `src` ایجاد کرده و `ImportMetaEnv` را به شکل زیر توسعه دهید:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

اگر کد شما به `types` مربوط به محیط‌های مرورگر مانند [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) و [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts) وابسته است، می‌توانید فیلد [`lib`](https://www.typescriptlang.org/tsconfig#lib) را در `tsconfig.json` به‌روزرسانی کنید.

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning ایمپورت‌ها باعث خرابی type augmentation می‌شوند
اگر گسترش (augmentation) `ImportMetaEnv` کار نکرد، مطمئن شوید که هیچ عبارت import در فایل `vite-env.d.ts` ندارید. برای اطلاعات بیشتر، به [مستندات TypeScript](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined) مراجعه کنید.
:::

## جایگذاری Env در HTML

Vite همچنین از جایگذاری متغیرهای env در فایل‌های HTML پشتیبانی می‌کند. هر ویژگی از `import.meta.env` را می‌توان با استفاده از سینتکس ویژه `%ENV_NAME%` در فایل‌های HTML استفاده کرد:

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

اگر متغیر محیطی (env) در `import.meta.env` وجود نداشته باشد، مثلاً `%NON_EXISTENT%`، نادیده گرفته می‌شود و جایگزین نمی‌شود. این رفتار برخلاف `import.meta.env.NON_EXISTENT` در جاوااسکریپت است که در آن، مقدار به‌عنوان `undefined` جایگزین می‌شود.

با توجه به اینکه Vite توسط بسیاری از فریم‌ورک‌ها استفاده می‌شود، به‌طور عمدی در مورد جایگزینی‌های پیچیده‌ای مانند شرط‌ها (conditionals) نظر خاصی ندارد. Vite را می‌توان با استفاده از [یک پلاگین موجود از کاربران](https://github.com/vitejs/awesome-vite#transformers) یا یک پلاگین سفارشی که از هوک [`transformIndexHtml`](./api-plugin#transformindexhtml) استفاده می‌کند، گسترش داد.

## حالت‌ها (Modes)

به طور پیش‌فرض، سرور توسعه (`dev` command) در حالت `development` اجرا می‌شود و دستور `build` در حالت `production` اجرا می‌شود.

این بدان معناست که هنگام اجرای `vite build`، متغیرهای env از فایل `.env.production` بارگذاری می‌شوند (اگر چنین فایلی وجود داشته باشد):

```
# .env.production
VITE_APP_TITLE=My App
```

در برنامه‌تان می‌توانید title را با استفاده از `import.meta.env.VITE_APP_TITLE` نمایش دهید.

در برخی موارد، ممکن است بخواهید دستور `vite build` را با حالت (mode) متفاوتی اجرا کنید تا title متفاوتی نمایش داده شود. می‌توانید حالت پیش‌فرض مورد استفاده برای یک دستور را با استفاده از فلگ `--mode` تغییر دهید. به‌عنوان مثال، اگر می‌خواهید برنامه‌تان را برای حالت استیجینگ (staging) بسازید:

```bash
vite build --mode staging
```

و یک فایل `.env.staging` ایجاد کنید:

```
# .env.staging
VITE_APP_TITLE=My App (staging)
```

از آن‌جایی که `vite build` به‌طور پیش‌فرض یک build مربوط به محیط production اجرا می‌کند، می‌توانید این رفتار را تغییر داده و با استفاده از یک mode متفاوت و پیکربندی فایل `.env`، یک build مربوط به محیط development اجرا کنید:

```
# .env.testing
NODE_ENV=development
```

## `NODE_ENV` و Mode ها

مهم است توجه داشته باشید که `NODE_ENV` (`process.env.NODE_ENV`) و mode ها دو مفهوم متفاوت هستند. در اینجا نحوه تأثیر دستورات مختلف بر `NODE_ENV` و mode آورده شده است:

| Command                                              | NODE_ENV        | Mode            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

مقادیر مختلف `NODE_ENV` و mode همچنین در ویژگی‌های مربوط به `import.meta.env` منعکس می‌شوند:

| Command                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| Command              | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `NODE_ENV` در فایل‌های `.env`

`NODE_ENV=...` را می‌توان هم در دستور و هم در فایل `.env` تنظیم کرد. اگر `NODE_ENV` در یک فایل `.env.[mode]` مشخص شده باشد، می‌توان از mode برای کنترل مقدار آن استفاده کرد. با این حال، هر دو `NODE_ENV` و modes همچنان به‌عنوان دو مفهوم مجزا باقی می‌مانند.

مزیت اصلی استفاده از `NODE_ENV=...` در دستور این است که به Vite اجازه می‌دهد مقدار را زودتر تشخیص دهد. همچنین به شما امکان می‌دهد `process.env.NODE_ENV` را در تنظیمات Vite خود بخوانید، زیرا Vite فقط می‌تواند فایل‌های env را پس از ارزیابی تنظیمات بارگیری کند.
:::
