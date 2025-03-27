# گزینه‌های سرور

مگر در مواردی که به‌صورت جداگانه ذکر شده باشد، گزینه‌های این بخش فقط در محیط توسعه (dev) اعمال می‌شوند.

## server.host

- **نوع:** `string | boolean`
- **پیش‌فرض:** `'localhost'`

مشخص می‌کند که سرور باید به کدام آدرس‌های IP گوش دهد. برای گوش دادن به همهٔ آدرس‌ها (شامل LAN و آدرس‌های عمومی)، مقدار این گزینه را برابر `0.0.0.0` یا `true` قرار دهید.

می‌توانید این گزینه را در خط فرمان با استفاده از `host 0.0.0.0--` یا `host--` تنظیم کنید.

::: tip نکته

مواردی وجود دارد که ممکن است سرورهای دیگر به جای Vite پاسخ دهند.

اولین مورد وقتی است که از `localhost` استفاده می‌شود. نسخه‌های زیر ۱۷ Node.js به‌صورت پیش‌فرض نتایج آدرس‌های DNS-resolved را بازچینی می‌کنند. هنگام دسترسی به `localhost`، مرورگرها از DNS برای resolve کردن استفاده می‌کنند و این آدرس ممکن است با آدرسی که Vite به آن گوش می‌دهد متفاوت باشد. Vite در صورت وجود تفاوت، آدرس resolve شده را چاپ می‌کند.

می‌توانید از [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) برای غیرفعال کردن این بازچینی استفاده کنید. در این صورت Vite آدرس را به‌صورت `localhost` چاپ خواهد کرد.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // ...
})
```

مورد دوم، وقتی است که از hostهای wildcard (مانند `0.0.0.0`) استفاده می‌شود. در این حالت، سرورهایی که روی host غیر wildcard گوش می‌دهند، نسبت به سرورهایی که روی host wildcard هستند، اولویت دارند.

:::

::: tip دسترسی به سرور از LAN در WSL2

هنگام اجرای Vite در WSL2، تنها تنظیم `host: true` برای دسترسی به سرور از طریق شبکهٔ محلی کافی نیست.
برای جزئیات بیشتر، [مستندات WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) را ببینید.

:::

## server.allowedHosts

- **نوع:** `string[] | true`
- **پیش‌فرض:** `[]`

لیست hostnameهایی که Vite مجاز به پاسخ‌گویی به آن‌ها است. به‌صورت پیش‌فرض، `localhost`، دامنه‌هایی با پسوند `.localhost` و همهٔ آدرس‌های IP مجاز هستند. هنگام استفاده از HTTPS، این بررسی انجام نمی‌شود.

اگر یک رشته با `.` شروع شود، آن hostname (بدون `.`) و همهٔ زیر دامنه‌های آن مجاز خواهند بود. برای مثال، `.example.com` باعث مجاز شدن `example.com`، `foo.example.com` و `foo.bar.example.com` می‌شود. اگر مقدار برابر `true` قرار گیرد، سرور مجاز است به درخواست‌های هر hostی پاسخ دهد.

::: details چه hostهایی برای اضافه شدن امن هستند؟

hostهایی که شما کنترل IP مقصد آن‌ها را دارید، برای اضافه کردن امن هستند.

برای مثال، اگر شما صاحب دامنهٔ `vite.dev` هستید، می‌توانید `vite.dev` و `.vite.dev` را در لیست مجاز قرار دهید. اگر مالک دامنه نیستید یا به مالک آن اعتماد ندارید، نباید آن را اضافه کنید.

به‌ویژه، **هرگز** دامنه‌های سطح بالا مانند `.com` را اضافه نکنید. چون هر کسی می‌تواند دامنه‌ای مانند `example.com` را خریداری کرده و آدرس IP آن را کنترل کند.

:::

::: danger

قرار دادن مقدار `server.allowedHosts` برابر `true` باعث می‌شود که هر وب‌سایتی بتواند با استفاده از حملات DNS rebinding به سرور توسعهٔ شما درخواست ارسال کند و کد منبع و محتوای شما را دانلود کند. اکیداً توصیه می‌شود همیشه از یک لیست مشخص از hostهای مجاز استفاده کنید.
بیشتر بخوانید: [GHSA-vg6x-rcgg-rjx6](https://github.com/vitejs/vite/security/advisories/GHSA-vg6x-rcgg-rjx6)

:::

::: details پیکربندی از طریق متغیر محیطی

می‌توانید از متغیر محیطی `VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS__` برای افزودن یک host مجاز اضافی استفاده کنید.

:::

## server.port

- **نوع:** `number`
- **پیش‌فرض:** `5173`

شمارهٔ پورتی که سرور روی آن گوش می‌دهد. توجه داشته باشید اگر پورت قبلاً در حال استفاده باشد، Vite به‌صورت خودکار پورت بعدی موجود را امتحان می‌کند، بنابراین ممکن است پورت نهایی که سرور به آن گوش می‌دهد با پورت تعیین‌شده متفاوت باشد.

## server.strictPort

- **نوع:** `boolean`

اگر مقدار این گزینه برابر `true` باشد، در صورتی که پورت در حال استفاده باشد، Vite بلافاصله متوقف می‌شود و به‌جای امتحان کردن پورت بعدی، خارج می‌شود.

## server.https

- **نوع:** `https.ServerOptions`

فعال‌سازی TLS + HTTP/2. توجه داشته باشید اگر گزینهٔ [`server.proxy`](#server-proxy) نیز استفاده شود، فقط TLS فعال می‌شود و HTTP/2 غیرفعال خواهد شد.

می‌توانید یک [شیء تنظیمات](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) معتبر برای `()https.createServer` نیز ارائه دهید.

یک گواهی معتبر مورد نیاز است. برای تنظیم ساده، می‌توانید پلاگین [vitejs/plugin-basic-ssl@](https://github.com/vitejs/vite-plugin-basic-ssl) را به پروژه اضافه کنید تا به‌صورت خودکار یک گواهی self-signed ایجاد و کش کند. با این حال توصیه می‌شود گواهی اختصاصی خودتان را ایجاد کنید.

## server.open

- **نوع:** `boolean | string`

باز کردن خودکار اپلیکیشن در مرورگر هنگام شروع سرور. اگر مقدار به‌صورت رشته‌ای باشد، به‌عنوان مسیر URL استفاده خواهد شد. اگر می‌خواهید سرور را در مرورگر خاصی باز کنید، می‌توانید از متغیر محیطی `process.env.BROWSER` (مثلاً `firefox`) استفاده کنید. همچنین می‌توانید `process.env.BROWSER_ARGS` را برای ارسال آرگومان‌های اضافه (مثلاً `incognito--`) تنظیم کنید.

متغیرهای `BROWSER` و `BROWSER_ARGS` را می‌توانید در فایل `.env` نیز تعریف کنید. برای اطلاعات بیشتر به [بستهٔ `open`](https://github.com/sindresorhus/open#app) مراجعه کنید.

**مثال:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy

- **نوع:** `<Record<string, string | ProxyOptions`

پیکربندی قوانین پراکسی برای سرور توسعه. انتظار می‌رود به‌صورت یک آبجکت `{ کلید: گزینه‌ها }` باشد. هر درخواستی که مسیر آن با کلید آغاز شود، به target مشخص‌شده پراکسی می‌شود. اگر کلید با `^` شروع شود، به‌صورت `RegExp` تفسیر خواهد شد. از گزینهٔ `configure` برای دسترسی به نمونهٔ پراکسی استفاده می‌شود. اگر یک درخواست با هر یک از قوانین پراکسی مطابقت داشته باشد، دیگر توسط Vite پردازش نخواهد شد.

توجه داشته باشید اگر از [`base`](/config/shared-options.md#base) غیر نسبی استفاده می‌کنید، باید هر کلید را با آن `base` پیشوند دهید.

این قابلیت براساس [`http-proxy`](https://github.com/http-party/node-http-proxy#options) ساخته شده و گزینه‌های اضافی [در اینجا](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13) در دسترس هستند.

در برخی موارد ممکن است بخواهید سرور داخلی را نیز پیکربندی کنید (مثلاً افزودن میان‌افزارهای اختصاصی به اپلیکیشن [connect](https://github.com/senchalabs/connect)). برای این منظور باید [پلاگین اختصاصی](/guide/using-plugins.html) بنویسید و از تابع [configureServer](/guide/api-plugin.html#configureserver) استفاده کنید.

**مثال:**

```js
export default defineConfig({
  server: {
    proxy: {
      // :حالت ساده با رشته
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

      // استفاده از نمونهٔ پراکسی
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

- **نوع:** `boolean | CorsOptions`
- **پیش‌فرض:**
<div dir="ltr">
<code>
{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }
</code>
</div>

- (اجازه به localhost، `127.0.0.1` و `1::`)

پیکربندی CORS برای سرور توسعه. برای تنظیم دقیق‌تر رفتار، یک [شیء گزینه‌ها](https://github.com/expressjs/cors#configuration-options) ارسال کنید یا مقدار `true` را برای اجازه به همهٔ originها قرار دهید.

::: danger

اگر مقدار `server.cors` برابر `true` باشد، هر وب‌سایتی می‌تواند درخواست‌هایی به سرور توسعهٔ شما ارسال کند و کد منبع و محتوای شما را دانلود کند. توصیه می‌شود همیشه از یک لیست مشخص از originهای مجاز استفاده کنید.

:::

## server.headers

- **نوع:** `OutgoingHttpHeaders`

مشخص کردن هدرهای پاسخ سرور.

## server.hmr

- **نوع:**

<div dir="ltr">
<code>
boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }
</code>
</div>

غیرفعال‌سازی یا پیکربندی اتصال HMR (در مواقعی که اتصال WebSocket برای HMR باید از آدرسی متفاوت نسبت به سرور HTTP استفاده کند).

برای غیرفعال کردن لایهٔ خطای سرور، مقدار `server.hmr.overlay` را برابر `false` قرار دهید.

`protocol` مشخص‌کنندهٔ پروتکل WebSocket برای اتصال HMR است: `ws` (WebSocket) یا `wss` (WebSocket امن).

`clientPort` گزینه‌ای پیشرفته است که فقط پورت سمت کلاینت را بازنویسی می‌کند و به شما امکان می‌دهد WebSocket را روی پورتی متفاوت از پورتی که کلاینت جست‌وجو می‌کند اجرا کنید.

اگر `server.hmr.server` تعریف شده باشد، Vite درخواست‌های اتصال HMR را از طریق سرور مشخص‌شده پردازش می‌کند. اگر در حالت middleware نباشد، Vite تلاش می‌کند تا این درخواست‌ها را از طریق سرور موجود پردازش کند. این گزینه هنگام استفاده از گواهی‌های self-signed یا انتشار Vite روی شبکه با یک پورت مفید است.

مثال‌هایی را می‌توانید در [vite-setup-catalogue](https://github.com/sapphi-red/vite-setup-catalogue) ببینید.

::: tip نکته

در پیکربندی پیش‌فرض، پراکسی‌های معکوس جلوی Vite باید از پراکسی کردن WebSocket پشتیبانی کنند. اگر اتصال WebSocket کلاینت HMR با شکست مواجه شود، کلاینت تلاش می‌کند تا WebSocket را مستقیماً و بدون عبور از پراکسی‌ها به سرور HMR متصل کند:

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
.را ببینید https://vite.dev/config/server-options.html#server-hmr برای حذف خطای قبلی، مستندات .fallback به‌عنوان WebSocket اتصال مستقیم
```

خطایی که هنگام fallback در مرورگر نمایش داده می‌شود قابل صرف‌نظر است. برای جلوگیری از این خطا، می‌توانید:

- پراکسی معکوس را طوری پیکربندی کنید که WebSocket را نیز پراکسی کند.
- گزینهٔ [`server.strictPort = true`](#server-strictport) را فعال کرده و مقدار `server.hmr.clientPort` را با `server.port` برابر قرار دهید.
- مقدار `server.hmr.port` را با مقدار متفاوتی از [`server.port`](#server-port) تنظیم کنید.

:::

## server.warmup

- **نوع:** `{ []clientFiles?: string[], ssrFiles?: string }`
- **مرتبط:** [پیش‌گرم کردن فایل‌های پرکاربرد](/guide/performance.html#warm-up-frequently-used-files)

پیش‌گرم کردن فایل‌ها برای تبدیل (transform) و کش کردن نتایج از قبل. این کار زمان بارگذاری اولیهٔ صفحه در هنگام شروع سرور را بهبود می‌بخشد و از تبدیل‌های زنجیره‌ای جلوگیری می‌کند.

`clientFiles` فایل‌هایی هستند که فقط در کلاینت استفاده می‌شوند و `ssrFiles` فایل‌هایی هستند که فقط در SSR استفاده می‌شوند. هر دو می‌توانند آرایه‌ای از مسیر فایل یا الگوهای [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) باشند که نسبت به `root` هستند.

تنها فایل‌هایی را اضافه کنید که به‌طور مکرر استفاده می‌شوند تا بار اضافی روی سرور توسعه ایجاد نشود.

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

- **نوع:** `object | null`

گزینه‌های مربوط به پایش فایل‌ها برای ارسال به [chokidar](https://github.com/paulmillr/chokidar/tree/3.6.0#api).

پایشگر سرور Vite، دایرکتوری `root` را پایش می‌کند و به‌صورت پیش‌فرض پوشه‌های `git`، `node_modules`، و دایرکتوری‌های `cacheDir` و `build.outDir` Vite را نادیده می‌گیرد. هنگام تغییر فایل، Vite فقط در صورت نیاز HMR را اعمال کرده و صفحه را به‌روزرسانی می‌کند.

اگر مقدار این گزینه برابر `null` باشد، هیچ فایلی پایش نمی‌شود. `server.watcher` همچنان یک event emitter سازگار ارائه می‌دهد، اما متدهای `add` یا `unwatch` بی‌اثر خواهند بود.

::: warning پایش فایل‌های `node_modules`

در حال حاضر، پایش فایل‌ها و بسته‌ها در `node_modules` ممکن نیست. برای پیگیری پیشرفت و راه‌حل‌ها، [issue #8619](https://github.com/vitejs/vite/issues/8619) را دنبال کنید.

:::

::: warning استفاده از Vite در WSL2

در هنگام اجرای Vite در WSL2، پایش فایل‌ها زمانی کار نمی‌کند که فایل توسط برنامه‌های ویندوز (خارج از WSL2) ویرایش شده باشد. این مشکل ناشی از [محدودیت WSL2](https://github.com/microsoft/WSL/issues/4739) است. این مورد شامل اجرای Vite در Docker با backend WSL2 نیز می‌شود.

برای رفع آن، می‌توانید:

- **توصیه‌شده:** از برنامه‌های WSL2 برای ویرایش فایل‌ها استفاده کنید.
  - همچنین توصیه می‌شود پوشهٔ پروژه را خارج از فایل‌سیستم ویندوز قرار دهید. دسترسی به فایل‌سیستم ویندوز از WSL2 کند است و حذف این سربار، عملکرد را بهبود می‌بخشد.
- گزینهٔ `{ usePolling: true }` را تنظیم کنید.
  - توجه داشته باشید که [`usePolling` باعث مصرف زیاد CPU می‌شود](https://github.com/paulmillr/chokidar/tree/3.6.0#performance).

:::

## server.middlewareMode

- **نوع:** `boolean`
- **پیش‌فرض:** `false`

اجرای سرور Vite در حالت middleware.

- **مرتبط:** [appType](./shared-options#apptype)، [SSR - راه‌اندازی سرور توسعه](/guide/ssr#setting-up-the-dev-server)

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

- **نوع:** `boolean`
- **پیش‌فرض:** `true` (از Vite 2.7 به‌صورت پیش‌فرض فعال شده)

محدودسازی ارائهٔ فایل‌ها به خارج از ریشهٔ workspace.

## server.fs.allow

- **نوع:** `[]string`

محدودسازی فایل‌هایی که می‌توان آن‌ها را از طریق مسیر `/fs@/` ارائه کرد. زمانی که `server.fs.strict` برابر `true` باشد، دسترسی به فایل‌هایی خارج از این لیست که از فایل مجاز import نشده‌اند، منجر به خطای 403 خواهد شد.

می‌توانید هم پوشه و هم فایل مشخص کنید.

Vite تلاش می‌کند ریشهٔ workspace را پیدا کند و از آن به‌عنوان پیش‌فرض استفاده کند. یک workspace معتبر باید یکی از شرایط زیر را داشته باشد، در غیر این صورت به [ریشهٔ پروژه](/guide/#index-html-and-project-root) بازمی‌گردد:

- شامل فیلد `workspaces` در `package.json` باشد
- شامل یکی از فایل‌های زیر باشد:
  - `lerna.json`
  - `pnpm-workspace.yaml`

می‌توانید یک مسیر مشخص نیز ارائه دهید (مطلق یا نسبی نسبت به [ریشهٔ پروژه](/guide/#index-html-and-project-root)):

```js
export default defineConfig({
  server: {
    fs: {
      // اجازه به دسترسی از یک سطح بالاتر از ریشهٔ پروژه
      allow: ['..'],
    },
  },
})
```

هنگامی که `server.fs.allow` مشخص شده باشد، تشخیص خودکار ریشهٔ workspace غیرفعال می‌شود. برای گسترش رفتار اصلی، می‌توانید از تابع `searchForWorkspaceRoot` استفاده کنید:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // workspace جست‌وجو برای ریشهٔ
        searchForWorkspaceRoot(process.cwd()),
        // قوانین سفارشی
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ],
    },
  },
})
```

## server.fs.deny

- **نوع:** `[]string`
- **پیش‌فرض:**

<div dir="ltr">
<code>
['.env', '.env.*', '*.{crt,pem}', '**/.git/**']
</code>
</div>

لیست فایل‌های حساس که دسترسی به آن‌ها در سرور توسعهٔ Vite ممنوع است. این لیست اولویت بالاتری نسبت به [`server.fs.allow`](#server-fs-allow) دارد. از الگوهای [picomatch](https://github.com/micromatch/picomatch#globbing-features) پشتیبانی می‌شود.

## server.origin

- **نوع:** `string`

مبدأ (origin) URLهایی که در زمان توسعه تولید می‌شوند را تعیین می‌کند.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList

- **نوع:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **پیش‌فرض:**
<div dir="ltr">
<code>
  (sourcePath) => sourcePath.includes('node_modules')
</code>
</div>

تعیین می‌کند که آیا فایل‌های منبع باید از sourcemap سرور نادیده گرفته شوند یا نه. این مقدار برای پر کردن [افزونهٔ `x_google_ignoreList`](https://developer.chrome.com/articles/x-google-ignore-list/) استفاده می‌شود.

`server.sourcemapIgnoreList` معادل [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) برای سرور توسعه است. تفاوت این دو گزینه این است که rollup از مسیر نسبی برای `sourcePath` استفاده می‌کند در حالی که `server.sourcemapIgnoreList` از مسیر مطلق استفاده می‌کند. در توسعه، بیشتر ماژول‌ها sourcemap و منبع را در یک پوشه دارند، پس مسیر مطلق مناسب‌تر است.

به‌صورت پیش‌فرض، تمام مسیرهایی که شامل `node_modules` هستند نادیده گرفته می‌شوند. می‌توانید مقدار `false` برای غیرفعال کردن این رفتار یا یک تابع برای کنترل کامل ارائه دهید.

```js
export default defineConfig({
  server: {
    // در مسیرشان را نادیده می‌گیرد node_modules مقدار پیش‌فرض - تمام فایل‌های شامل
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip نکته
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) و [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) باید به‌صورت جداگانه تنظیم شوند. `server.sourcemapIgnoreList` فقط مخصوص سرور است و مقدار پیش‌فرض آن از rollup گرفته نمی‌شود.
:::
