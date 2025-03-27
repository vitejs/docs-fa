# گزینه‌های سرور

مگر اینکه ذکر شده باشه، گزینه‌های این بخش فقط تو حالت توسعه (dev) اعمال می‌شن.

## server.host

- **تایپ:** `string | boolean`
- **پیش‌فرض:** `'localhost'`

مشخص می‌کنه سرور باید روی کدوم آدرس‌های IP گوش کنه. برای گوش دادن به همه آدرس‌ها، از جمله LAN و آدرس‌های عمومی، این رو به `0.0.0.0` یا `true` تنظیم کنین.

می‌تونین این رو از طریق خط فرمان با `host 0.0.0.0--` یا `host--` تنظیم کنین.

::: tip نکته

بعضی وقت‌ها ممکنه سرورهای دیگه به جای Vite جواب بدن.

مورد اول وقتیه که از `localhost` استفاده می‌شه. Node.js تو نسخه‌های زیر 17 به‌صورت پیش‌فرض ترتیب آدرس‌های رفع‌شده DNS رو تغییر می‌ده. وقتی به `localhost` دسترسی پیدا می‌کنین، مرورگرها از DNS برای رفع آدرس استفاده می‌کنن و ممکنه این آدرس با چیزی که Vite بهش گوش می‌ده فرق داشته باشه. Vite اگه تفاوت داشته باشه، آدرس رفع‌شده رو چاپ می‌کنه.

می‌تونین با [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) این رفتار رو غیرفعال کنین. اون موقع Vite آدرس رو به‌صورت `localhost` چاپ می‌کنه.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // حذف شده
})
```

مورد دوم وقتیه که از میزبان‌های wildcard (مثل `0.0.0.0`) استفاده می‌شه. چون سرورهایی که روی میزبان‌های غیر wildcard گوش می‌دن، نسبت به اونایی که روی wildcard هستن اولویت دارن.

:::

::: tip دسترسی به سرور تو WSL2 از LAN

وقتی Vite رو تو WSL2 اجرا می‌کنین، تنظیم `host: true` برای دسترسی به سرور از LAN کافی نیست. برای جزئیات بیشتر به [مستندات WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) نگاه کنین.

:::

## server.allowedHosts

- **تایپ:** `string[] | true`
- **پیش‌فرض:** `[]`

نام‌های میزبانی که Vite اجازه داره بهشون جواب بده. به‌صورت پیش‌فرض، `localhost`، دامنه‌های زیر `.localhost` و همه آدرس‌های IP مجازن. وقتی از HTTPS استفاده می‌کنین، این بررسی انجام نمی‌شه.

اگه یه رشته با `.` شروع بشه، اون نام میزبان بدون `.` و همه زیر دامنه‌هاش مجاز می‌شن. مثلاً `.example.com` شامل `example.com`، `foo.example.com` و `foo.bar.example.com` می‌شه. اگه روی `true` تنظیم بشه، سرور می‌تونه به درخواست‌های هر میزبانی جواب بده.

::: details چه میزبان‌هایی برای اضافه کردن امنن؟

میزبان‌هایی که شما کنترل آدرس‌های IPشون رو دارین، برای اضافه کردن به لیست میزبان‌های مجاز امنن.

مثلاً اگه دامنه `vite.dev` مال شماست، می‌تونین `vite.dev` و `.vite.dev` رو به لیست اضافه کنین. اگه مالک دامنه نیستین و به مالکش اعتماد ندارین، نباید اضافه‌ش کنین.

به‌خصوص، هیچ‌وقت دامنه‌های سطح بالا مثل `.com` رو به لیست اضافه نکنین. چون هر کسی می‌تونه دامنه‌ای مثل `example.com` بخره و آدرس IPش رو کنترل کنه.

:::

::: danger

تنظیم `server.allowedHosts` به `true` به هر وب‌سایتی اجازه می‌ده با حملات DNS rebinding به سرور توسعه‌تون درخواست بفرسته و کد منبع و محتواتون رو دانلود کنه. پیشنهاد می‌کنیم همیشه از یه لیست مشخص از میزبان‌های مجاز استفاده کنین. برای جزئیات بیشتر به [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6) نگاه کنین.

:::

::: details پیکربندی با متغیر محیطی
می‌تونین متغیر محیطی `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` رو تنظیم کنین تا یه میزبان مجاز دیگه اضافه کنین.
:::

## server.port

- **تایپ:** `number`
- **پیش‌فرض:** `5173`

پورت سرور رو مشخص می‌کنه. اگه پورت قبلاً در حال استفاده باشه، Vite خودکار پورت بعدی در دسترس رو امتحان می‌کنه، پس ممکنه پورت واقعی که سرور بهش گوش می‌ده با این فرق داشته باشه.

## server.strictPort

- **تایپ:** `boolean`

اگه روی `true` تنظیم بشه، اگه پورت در حال استفاده باشه، خارج می‌شه و پورت بعدی رو خودکار امتحان نمی‌کنه.

## server.https

- **تایپ:** `https.ServerOptions`

TLS + HTTP/2 رو فعال می‌کنه. مقدارش یه [آبجکت گزینه‌ها](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) هست که به `https.createServer()` ارسال می‌شه.

اگه گزینه [`server.proxy`](#server-proxy) هم استفاده بشه، فقط به TLS کاهش پیدا می‌کنه.

یه گواهینامه معتبر لازمه. برای تنظیم ساده، می‌تونین [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) رو به پلاگین‌های پروژه اضافه کنین که یه گواهینامه خود-امضا رو خودکار می‌سازه و کش می‌کنه. ولی پیشنهاد می‌کنیم گواهینامه‌های خودتون رو بسازین.

## server.open

- **تایپ:** `boolean | string`

وقتی سرور شروع می‌شه، اپلیکیشن رو خودکار تو مرورگر باز می‌کنه. اگه مقدارش یه رشته باشه، به‌عنوان مسیر URL استفاده می‌شه. اگه می‌خواین سرور تو یه مرورگر خاص باز بشه، می‌تونین متغیر محیطی `process.env.BROWSER` رو تنظیم کنین (مثلاً `firefox`). با `process.env.BROWSER_ARGS` هم می‌تونین آرگومان‌های اضافی بفرستین (مثلاً `incognito--`).

`BROWSER` و `BROWSER_ARGS` متغیرهای محیطی خاصی هستن که می‌تونین تو فایل `.env` تنظیم‌شون کنین. برای جزئیات بیشتر به [پکیج `open`](https://github.com/sindresorhus/open#app) نگاه کنین.

**مثال:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy

- **تایپ:** `<Record<string, string | ProxyOptions`

قوانین پراکسی سفارشی رو برای سرور توسعه تنظیم می‌کنه. یه آبجکت از جفت‌های `{ key: options }` می‌خواد. هر درخواستی که مسیرش با اون کلید شروع بشه، به هدف مشخص‌شده پراکسی می‌شه. اگه کلید با `^` شروع بشه، به‌عنوان `RegExp` تفسیر می‌شه. با گزینه `configure` می‌تونین به نمونه پراکسی دسترسی پیدا کنین. اگه یه درخواست با یکی از قوانین پراکسی مطابقت کنه، توسط Vite تبدیل نمی‌شه.

اگه از [`base`](/config/shared-options.md#base) غیر نسبی استفاده می‌کنین، باید هر کلید رو با اون `base` پیشوند کنین.

بر اساس [`http-proxy`](https://github.com/http-party/node-http-proxy#options) گسترش پیدا کرده. گزینه‌های اضافی [اینجا](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13) هستن.

بعضی وقت‌ها ممکنه بخواین سرور توسعه زیرین رو هم تنظیم کنین (مثلاً برای اضافه کردن میدلورهای سفارشی به اپلیکیشن داخلی [connect](https://github.com/senchalabs/connect)). برای این کار، باید یه [پلاگین](/guide/using-plugins.html) خودتون بنویسین و از تابع [configureServer](/guide/api-plugin.html#configureserver) استفاده کنین.

**مثال:**

```js
export default defineConfig({
  server: {
    proxy: {
      // :کوتاه‌نویسی رشته
      // http://localhost:5173/foo
      //   -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // :با گزینه‌ها
      // http://localhost:5173/api/bar
      //   -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // :RegExp با
      // http://localhost:5173/fallback/
      //   -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // استفاده از نمونه پراکسی
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // خواهد بود 'http-proxy' یک نمونه از  proxy کلید
        },
      },

      // :socket.io یا websockets پراکسی کردن
      // ws://localhost:5173/socket.io
      //   -> ws://localhost:5174/socket.io
      // .آسیب ‌پذیر شود CSRF احتیاط کنید زیرا ممکن است در برابر حملات `rewriteWsOrigin` هنگام استفاده از
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})
```

## server.cors

- **تایپ:** `boolean | CorsOptions`
- **پیش‌فرض:**

<div dir="ltr">
<code>
{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }
</code>
</div>

CORS رو برای سرور توسعه تنظیم می‌کنه. یه [آبجکت گزینه‌ها](https://github.com/expressjs/cors#configuration-options) بفرستین تا رفتارش رو دقیق تنظیم کنین یا با `true` به هر مبدأ اجازه بدین.

::: danger

تنظیم `server.cors` به `true` به هر وب‌سایتی اجازه می‌ده به سرور توسعه‌تون درخواست بفرسته و کد منبع و محتواتون رو دانلود کنه. پیشنهاد می‌کنیم همیشه از یه لیست مشخص از مبدأهای مجاز استفاده کنین.

:::

## server.headers

- **تایپ:** `OutgoingHttpHeaders`

هدرهای پاسخ سرور رو مشخص می‌کنه.

## server.hmr

- **تایپ:**
-
<div dir="ltr">
<code>
boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }
</code>
</div>

اتصال HMR رو غیرفعال یا تنظیم می‌کنه (برای وقتی که وب‌سوکت HMR باید آدرس متفاوتی از سرور HTTP استفاده کنه).

با تنظیم `server.hmr.overlay` به `false` می‌تونین پوشش خطای سرور رو غیرفعال کنین.

`protocol` پروتکل وب‌سوکت رو برای اتصال HMR مشخص می‌کنه: `ws` (وب‌سوکت) یا `wss` (وب‌سوکت امن).

`clientPort` یه گزینه پیشرفته‌ست که فقط پورت سمت کلاینت رو بازنویسی می‌کنه و بهتون اجازه می‌ده وب‌سوکت رو روی پورتی متفاوت از چیزی که کد کلاینت دنبالش می‌گرده ارائه بدین.

اگه `server.hmr.server` تعریف بشه، Vite درخواست‌های اتصال HMR رو از طریق سرور داده‌شده پردازش می‌کنه. اگه تو حالت میدلور نباشه، Vite سعی می‌کنه درخواست‌ها رو از طریق سرور موجود پردازش کنه. این می‌تونه برای استفاده از گواهینامه‌های خود-امضا یا ارائه Vite روی شبکه با یه پورت واحد مفید باشه.

برای مثال‌ها به [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) نگاه کنین.

::: tip نکته

تو تنظیمات پیش‌فرض، انتظار می‌ره پراکسی‌های معکوس جلوی Vite از پراکسی وب‌سوکت پشتیبانی کنن. اگه کلاینت HMR Vite نتونه به وب‌سوکت وصل بشه، کلاینت به اتصال مستقیم وب‌سوکت به سرور HMR Vite برمی‌گرده و پراکسی‌های معکوس رو دور می‌زنه:

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
.را ببینید https://vite.dev/config/server-options.html#server-hmr برای حذف خطای قبلی، مستندات .fallback به‌عنوان WebSocket اتصال مستقیم
```

خطایی که تو مرورگر موقع این بازگشت نشون داده می‌شه رو می‌تونین نادیده بگیرین. برای جلوگیری از خطا با دور زدن مستقیم پراکسی‌ها، می‌تونین:

- پراکسی معکوس رو طوری تنظیم کنین که وب‌سوکت رو هم پراکسی کنه
- [`server.strictPort = true`](#server-strictport) رو فعال کنین و `server.hmr.clientPort` رو با `server.port` یکی کنین
- `server.hmr.port` رو یه مقدار متفاوت از [`server.port`](#server-port) تنظیم کنین

:::

## server.warmup

- **نوع:** `{ []clientFiles?: string[], ssrFiles?: string }`
- **مرتبط:** [گرم کردن فایل‌های پراستفاده](/guide/performance.html#warm-up-frequently-used-files)

فایل‌ها رو از قبل گرم می‌کنه تا تبدیل و کش بشن. این کار بارگذاری اولیه صفحه رو موقع شروع سرور بهتر می‌کنه و از آبشار تبدیل جلوگیری می‌کنه.

`clientFiles` فایل‌هایی هستن که فقط تو کلاینت استفاده می‌شن و `ssrFiles` فایل‌هایی که فقط تو SSR استفاده می‌شن. اینا یه آرایه از مسیرهای فایل یا الگوهای [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) نسبت به `root` قبول می‌کنن.

فقط فایل‌هایی رو اضافه کنین که زیاد استفاده می‌شن تا سرور توسعه Vite موقع شروع بیش از حد بارگذاری نشه.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **تایپ:** `object | null`

گزینه‌های ناظر سیستم فایل که به [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api) ارسال می‌شن.

ناظر سرور Vite، `root` رو تماشا می‌کنه و به‌صورت پیش‌فرض دایرکتوری‌های `git`، `node_modules`، و دایرکتوری‌های `cacheDir` و `build.outDir` Vite رو نادیده می‌گیره. وقتی یه فایل تماشا‌شده تغییر می‌کنه، Vite HMR رو اعمال می‌کنه و صفحه رو فقط اگه نیاز باشه به‌روز می‌کنه.

اگه روی `null` تنظیم بشه، هیچ فایلی تماشا نمی‌شه. `server.watcher` یه منتشرکننده رویداد سازگار می‌ده، ولی فراخوانی `add` یا `unwatch` اثری نداره.

::: warning تماشای فایل‌ها تو `node_modules`

الان نمی‌شه فایل‌ها و بسته‌ها تو `node_modules` رو تماشا کرد. برای پیشرفت بیشتر و راه‌حل‌ها، می‌تونین [موضوع #8619](https://github.com/vitejs/vite/issues/8619) رو دنبال کنین.

:::

::: warning استفاده از Vite تو WSL2

وقتی Vite رو تو WSL2 اجرا می‌کنین، اگه فایل با برنامه‌های ویندوز (فرایند غیر WSL2) ویرایش بشه، تماشای سیستم فایل کار نمی‌کنه. این به خاطر [یه محدودیت WSL2](https://github.com/microsoft/WSL/issues/4739) هست. این برای اجرا تو Docker با بک‌اند WSL2 هم صدق می‌کنه.

برای درست کردنش، می‌تونین:

- **توصیه‌شده:** از برنامه‌های WSL2 برای ویرایش فایل‌هاتون استفاده کنین.
  - بهتره پوشه پروژه رو بیرون از سیستم فایل ویندوز بذارین. دسترسی به سیستم فایل ویندوز از WSL2 کنده و حذف این سربار عملکرد رو بهتر می‌کنه.
- `{ usePolling: true }` رو تنظیم کنین.
  - توجه کنین که [`usePolling` مصرف CPU رو بالا می‌بره](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode

- **تایپ:** `boolean`
- **پیش‌فرض:** `false`

سرور Vite رو تو حالت میدلور می‌سازه.

- **مرتبط:** [appType](./shared-options#apptype)، [SSR - تنظیم سرور توسعه](/guide/ssr#setting-up-the-dev-server)

- **مثال:**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // middleware در حالت Vite ایجاد سرور
  const vite = await createViteServer({
    server: { middlewareMode: true },
    // را حذف کن HTML Vite میان‌افزارهای پیش‌فرض
    appType: 'custom',
  })
  // Vite استفاده از میان‌افزارهای
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // .است، پاسخ باید اینجا ارسال شود 'custom' برابر appType چون
    // ،و خطای ۴۰۴ اضافه می‌کند HTML میان‌افزارهایی برای Vite ،باشد 'mpa' یا 'spa' برابر appType توجه: اگر
    // .قرار بگیرند Vite بنابراین میان‌افزارهای کاربر باید قبل از میان‌افزارهای
  })
}

createServer()
```

## server.fs.strict

- **تایپ:** `boolean`
- **پیش‌فرض:** `true` (از Vite 2.7 به‌صورت پیش‌فرض فعاله)

ارائه فایل‌ها بیرون از ریشه فضای کاری رو محدود می‌کنه.

## server.fs.allow

- **تایپ:** `[]string`

فایل‌هایی که می‌تونن از طریق `/@fs/` ارائه بشن رو محدود می‌کنه. وقتی `server.fs.strict` روی `true` باشه، دسترسی به فایل‌های بیرون این لیست که از یه فایل مجاز ایمپورت نشدن، خطای 403 می‌ده.

هم دایرکتوری‌ها و هم فایل‌ها رو می‌تونین بدین.

Vite ریشه فضای کاری احتمالی رو پیدا می‌کنه و به‌عنوان پیش‌فرض استفاده می‌کنه. یه فضای کاری معتبر باید این شرایط رو داشته باشه، وگرنه به [ریشه پروژه](/guide/#index-html-and-project-root) برمی‌گرده:

- تو `package.json` فیلد `workspaces` داشته باشه
- یکی از این فایل‌ها رو داشته باشه:
  - `lerna.json`
  - `pnpm-workspace.yaml`

یه مسیر رو برای مشخص کردن ریشه فضای کاری سفارشی قبول می‌کنه. می‌تونه مسیر مطلق یا نسبی به [ریشه پروژه](/guide/#index-html-and-project-root) باشه. مثلاً:

```js
export default defineConfig({
  server: {
    fs: {
      // اجازه ارائه فایل‌ها از یه سطح بالاتر از ریشه پروژه
      allow: ['..'],
    },
  },
})
```

وقتی `server.fs.allow` مشخص بشه، تشخیص خودکار ریشه فضای کاری غیرفعال می‌شه. برای گسترش رفتار اصلی، یه ابزار `searchForWorkspaceRoot` ارائه شده:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // جستجو برای ریشه فضای کاری
        searchForWorkspaceRoot(process.cwd()),
        // قوانین سفارشی‌تون
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ],
    },
  },
})
```

## server.fs.deny

- **تایپ:** `[]string`
- **پیش‌فرض:** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

لیست سیاه برای فایل‌های حساسی که سرور توسعه Vite نمی‌تونه ارائه‌شون کنه. این نسبت به [`server.fs.allow`](#server-fs-allow) اولویت بالاتری داره. الگوهای [picomatch](https://github.com/micromatch/picomatch#globbing-features) پشتیبانی می‌شن.

## server.origin

- **تایپ:** `string`

مبدأ URLهای دارایی تولیدشده رو تو زمان توسعه مشخص می‌کنه.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList

- **تایپ:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **پیش‌فرض:**
<div dir="ltr">
<code>
  (sourcePath) => sourcePath.includes('node_modules')
</code>
</div>

اینکه فایل‌های منبع تو sourcemap سرور نادیده گرفته بشن یا نه، برای پر کردن افزونه [`x_google_ignoreList` sourcemap](https://developer.chrome.com/articles/x-google-ignore-list/) استفاده می‌شه.

`server.sourcemapIgnoreList` معادل [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) برای سرور توسعه‌ست. تفاوت این دو گزینه اینه که تابع rollup با یه مسیر نسبی برای `sourcePath` فراخوانی می‌شه، ولی `server.sourcemapIgnoreList` با یه مسیر مطلق. تو توسعه، بیشتر ماژول‌ها نقشه و منبع رو تو یه پوشه دارن، پس مسیر نسبی برای `sourcePath` خود اسم فایله. تو این موارد، مسیرهای مطلق راحت‌ترن.

به‌صورت پیش‌فرض، همه مسیرهای شامل `node_modules` رو مستثنی می‌کنه. می‌تونین با `false` این رفتار رو غیرفعال کنین، یا برای کنترل کامل، یه تابع بدین که مسیر منبع و مسیر sourcemap رو می‌گیره و مشخص می‌کنه که مسیر منبع نادیده گرفته بشه یا نه.

```js
export default defineConfig({
  server: {
    // در مسیرشان را نادیده می‌گیرد node_modules مقدار پیش‌ فرض - تمام فایل‌های شامل
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip نکته
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) و [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) باید جداگانه تنظیم بشن. `server.sourcemapIgnoreList` فقط برای سروره و مقدار پیش‌فرضش از گزینه‌های rollup تعریف‌شده نمیاد.
:::
