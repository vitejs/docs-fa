# رندر سمت سرور (SSR)

:::tip نکته
رندر سمت سرور یا SSR، به قابلیتی در فریم‌ورک‌های فرانت‌اند مانند React ، Preact ، Vue و Svelte گفته می‌شود که اجازه می‌دهد همان اپلیکیشن در محیط Node.js اجرا شود، خروجی HTML تولید کند و سپس در مرورگر کاربر فرآیند "hydration" (فعال‌سازی تعاملی) را انجام دهد. اگر به دنبال یکپارچه‌سازی با فریم‌ورک‌های سنتی سمت سرور هستید، پیشنهاد می‌شود به [راهنمای اتصال به بک‌اند](./backend-integration) مراجعه کنید.

این راهنما فرض را بر آن دارد که شما پیش‌تر با مفاهیم SSR در فریم‌ورک انتخابی‌تان آشنا هستید، و تمرکز آن صرفاً بر نکات خاص و کاربردی SSR در Vite است.
:::

:::warning API سطح پایین
این رابط برنامه‌نویسی (API) مخصوص توسعه‌دهندگان کتابخانه‌ها و سازندگان فریم‌ورک‌هاست، و جزو ابزارهای سطح پایین Vite محسوب می‌شود. اگر هدف شما ساخت یک اپلیکیشن است، توصیه می‌کنیم ابتدا ابزارها و افزونه‌های سطح بالاتری که در [بخش SSR پروژه Awesome Vite](https://github.com/vitejs/awesome-vite#ssr) معرفی شده‌اند را بررسی کنید. با این حال، اپلیکیشن‌های بسیاری تاکنون با تکیه بر همین API بومی و سطح پایین Vite به‌خوبی توسعه یافته‌اند.

در حال حاضر، Vite در حال توسعه یک API پیشرفته‌تر برای SSR مبتنی بر [Environment API](https://github.com/vitejs/vite/discussions/16358) است. برای آگاهی بیشتر می‌توانید به لینک مورد نظر مراجعه کنید.
:::

## پروژه‌های نمونه

Vite به‌صورت داخلی از رندر سمت سرور (SSR) پشتیبانی می‌کند. پروژه [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) مجموعه‌ای از تنظیمات آماده‌ی SSR را فراهم کرده که می‌توانید به‌عنوان مرجع در این راهنما از آن‌ها استفاده کنید:

- [Vanilla (بدون فریم‌ورک خاص)](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

همچنین می‌توانید این پروژه‌ها را به‌صورت محلی با اجرای [دستور `create-vite`](./index.md#scaffolding-your-first-vite-project) راه‌اندازی کنید. در بخش انتخاب فریم‌ورک، گزینه‌ی `Others > create-vite-extra` را انتخاب نمایید.

## ساختار پروژه

یک اپلیکیشن معمولی با پشتیبانی از SSR (رندر سمت سرور) معمولاً دارای ساختاری مشابه زیر است:

```
- index.html
- server.js           # سرور اصلی اپلیکیشن
- src/
  - main.js           # کد عمومی برنامه که مستقل از محیط اجراست
  - entry-client.js   # در مرورگر DOM مسئول نصب برنامه روی
  - entry-server.js   # در فریم‌ورک SSR مربوط به API مسئول رندر کردن برنامه در سمت سرور با استفاده از
```

در فایل `index.html` باید به `entry-client.js` اشاره شود و همچنین محلی برای جای‌گذاری خروجی رندر شده توسط سرور در نظر گرفته شود:

```html [index.html]
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

می‌توانید به‌جای `‎<!--ssr-outlet-->‎` از هر نشانه‌گذاری دلخواه دیگری استفاده کنید، فقط کافی است که قابل شناسایی و جایگزینی دقیق باشد.

## منطق شرطی

اگه نیاز دارید کد شرطی بر اساس SSR یا کلاینت بنویسید، می‌تونید از این کد استفاده کنید:

```js twoslash
import 'vite/client'
// ---cut---
if (import.meta.env.SSR) {
  // ... فقط کد مخصوص سرور
}
```

این شرط در زمان build به‌صورت استاتیک جایگزین می‌شود، بنابراین کدهایی که استفاده نمی‌شوند حذف می‌شوند (tree-shaking)، که باعث سبک‌تر شدن باندل نهایی می‌شود.

## راه‌اندازی سرور توسعه (Dev Server)

وقتی دارید یک برنامه SSR می‌سازید، احتمالاً می‌خواهید کنترل کامل روی سرور اصلی‌تان داشته باشید و Vite را از محیط پروداکشن (production) جدا کنید. به همین دلیل، توصیه می‌شود از Vite در حالت middleware استفاده کنید. در ادامه یک نمونه با [Express](https://expressjs.com/) (نسخه ۴) آورده شده است:

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // ایجاد کنید و نوع اپلیکیشن را به middleware را در حالت Vite سرور
  // غیرفعال شود و سرور والد Vite داخلی HTML تنظیم کنید تا سرو 'custom'
  // بتواند کنترل را به دست بگیرد
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // خودتان express استفاده کنید. اگر از روتر middleware به عنوان vite مربوط connect از نمونه
  // .استفاده کنید router.use استفاده می‌کنید، باید از (express.Router())
  // زمانی که سرور مجدداً راه‌اندازی می‌شود )برای مثال بعد از اینکه کاربر فایل
  // همچنان همان ارجاع `vite.middlewares` (را تغییر می‌دهد، vite.config.js
  // .(های تزریق‌شده توسط پلاگین‌ها middleware‌ و Vite با یک پشته داخلی جدید از) خواهد بود
  // مورد زیر حتی پس از راه‌اندازی مجدد معتبر است
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // را سرو می‌کنیم - در ادامه به این موضوع خواهیم پرداخت index.html فایل
  })

  app.listen(5173)
}

createServer()
```

در اینجا `vite` یک نمونه از [ViteDevServer](./api-javascript#vitedevserver) است. `vite.middlewares` یک نمونه از [Connect](https://github.com/senchalabs/connect) است که می‌توان از آن به عنوان یک middleware در هر فریم‌ورک Node.js که با connect سازگار است استفاده کرد.

گام بعدی پیاده‌سازی یک handler کلی (`*`) برای سرو HTML رندر شده در سمت سرور است:

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite

// ---cut---
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. index.html خواندن فایل
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. مربوط به HMR شامل تزریق کلاینت .Vite توسط HTML اعمال تغییرات
    //    است Vite توسط پلاگین‌های HTML و همچنین انجام ترنسفورم‌های Vite
    //    @vitejs/plugin-react های سراسری از preamble مثل
    template = await vite.transformIndexHtml(url, template)

    // 3. را طوری تبدیل می‌کند ESM به‌طور خودکار کد ssrLoadModule .بارگذاری ورودی سمت سرور
    //    مشابه، کارایی در HMR قابل اجرا باشد! نیازی به باندل نیست و با Node.js که در
    //    کردن ماژول‌ها دارد invalidate
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. entry-server.js خروجی `render` اپلیکیشن. فرض شده که تابع HTML رندر کردن
    //    فریم‌ورک استفاده می‌کند، SSR های API از
    //    ReactDOMServer.renderToString() مثلاً
    const appHtml = await render(url)

    // 5. HTML رندرشده در قالب HTML قرار دادن
    const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

    // 6. نهایی به مرورگر HTML ارسال
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // استک‌ترِیس را اصلاح می‌کند Vite ،در صورت بروز خطا،
    // تا به کد اصلی شما ارجاع دهد
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

اسکریپت `dev` در فایل `package.json` نیز باید طوری تغییر داده شود که به‌جای آن از اسکریپت سرور استفاده کند.

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## ساخت(build) برای محیط پروداکشن

برای انتشار یک پروژه SSR در محیط پروداکشن، باید مراحل زیر را انجام دهید:

1. یک بیلد (build) برای کلاینت مثل همیشه تولید شود؛
2. یک بیلد SSR نیز تولید شود که مستقیماً با `import()‎` بارگذاری شود، تا نیازی به استفاده از `ssrLoadModule` در Vite نباشد.

اسکریپت‌های ما در فایل `package.json` به شکل زیر خواهند بود:

```json [package.json]
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

به فلگ `‎--ssr` توجه کنید که نشان می‌دهد این بیلد مخصوص SSR است. همچنین باید ورودی (entry) مربوط به SSR را مشخص کند.

سپس در فایل `server.js` باید منطق مخصوص پروداکشن را اضافه کنیم با بررسی مقدار `process.env.NODE_ENV`:

- به جای خواندن فایل `index.html` از ریشه پروژه، از فایل `dist/client/index.html` به عنوان قالب استفاده کنید، چون این فایل شامل لینک‌های درست برای فایل‌های خروجی کلاینت است.

- به جای استفاده از `await vite.ssrLoadModule('/src/entry-server.js')`، از `import('./dist/server/entry-server.js')` استفاده کنید (این فایل خروجی بیلد SSR است).

- ساخت و استفاده از سرور توسعه `vite` را فقط در حالت توسعه (dev) انجام دهید و در حالت پروداکشن، از میان افزارهای سرو فایل‌های استاتیک برای ارائه فایل‌ها از مسیر `dist/client` استفاده کنید.

برای مشاهده نمونه پیاده‌سازی، به [پروژه‌های نمونه](#example-projects) مراجعه کنید.

## تولید دستورهای پیش بارگذاری

دستور `vite build` از فلگ `‎--ssrManifest` پشتیبانی می‌کند که یک فایل به نام `.vite/ssr-manifest.json` در دایرکتوری خروجی بیلد ایجاد می‌کند:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

اسکریپت بالا حالا فایل `dist/client/.vite/ssr-manifest.json` را برای بیلد کلاینت تولید می‌کند (بله، مانیفست SSR از بیلد کلاینت ایجاد می‌شود چون هدف این است که ID های ماژول‌ها را به فایل‌های مربوط به کلاینت متصل کنیم). این مانیفست شامل اطلاعاتی است که به ما می‌گوید هر ID ماژول به کدام بخش‌ها (chunks) و فایل‌های مرتبط با آن ماژول در بیلد کلاینت اشاره دارد.

برای استفاده از مانیفست، فریمورک‌ها باید روشی فراهم کنند تا ID ماژول‌های کامپوننت‌هایی که در هنگام رندر سرور استفاده شده‌اند، جمع‌آوری شوند.

`‎@vitejs/plugin-vue` این قابلیت را به طور پیش‌فرض ارائه می‌دهد و به طور خودکار ID های ماژول کامپوننت‌هایی که در هنگام رندر سرور استفاده شده‌اند را در SSR context مربوط به Vue ثبت می‌کند:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ماژول‌هایی است که در طول رندر شدن استفاده شده‌اند ID یک مجموعه از ctx.modules حالا
```

در بخش پروداکشن فایل `server.js`، باید فایل manifest را بخوانیم و آن را به تابع `render` که از `src/entry-server.js` اکسپورت شده، بدهیم. این کار اطلاعات کافی برای تولید دستورهای preload مربوط به فایل‌هایی که در مسیرهای async استفاده شده‌اند را فراهم می‌کند. برای نمونه‌ی کامل، [کد دمو](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) را ببینید. همچنین می‌توان از این اطلاعات برای ارسال [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) استفاده کرد.

## پیش‌رندرینگ / تولید سایت ایستا (SSG)

اگر مسیرها (routes) و داده‌های مورد نیاز آن‌ها از قبل مشخص باشند، می‌توان آن‌ها را با استفاده از همان منطق SSR در حالت production، به صورت HTML ایستا (static) پیش‌پردازش کرد. این روش را می‌توان نوعی از تولید سایت ایستا یا SSG نیز در نظر گرفت. برای نمونه‌ی عملی، به [اسکریپت pre-render دمو](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) مراجعه کنید.

## وابستگی‌های خارجی در SSR

در حالت SSR، وابستگی‌ها به‌صورت پیش‌فرض از سیستم تبدیل ماژول Vite خارج (externalize) می‌شوند. این کار باعث افزایش سرعت در هر دو زمان توسعه (dev) و ساخت (build) پروژه می‌شود.

اگر یک وابستگی نیاز داشته باشد که توسط زنجیره‌ی تبدیل Vite پردازش شود (مثلاً چون از قابلیت‌های Vite به‌صورت مستقیم و بدون تبدیل در آن استفاده شده)، می‌توانید آن را به گزینه‌ی [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) اضافه کنید.

وابستگی‌هایی که لینک شده‌اند (مثل آن‌هایی که با `npm link` یا در محیط‌های monorepo استفاده شده‌اند)، به‌صورت پیش‌فرض external نمی‌شوند تا Vite بتواند از HMR استفاده کند. اگر نمی‌خواهید این رفتار اتفاق بیفتد (مثلاً برای شبیه‌سازی شرایطی که انگار وابستگی‌ها لینک نشده‌اند) می‌توانید آن‌ها را به گزینه‌ی [`ssr.external`](../config/ssr-options.md#ssr-external) اضافه کنید.

:::warning کار با aliasها
اگر aliasهایی تعریف کرده‌اید که یک پکیج را به پکیج دیگری هدایت می‌کنند، ممکن است بهتر باشد به‌جای آن، خود پکیج‌های داخل `node_modules` را alias کنید تا قابلیت external شدن آن‌ها در SSR به درستی عمل کند. هر دو ابزار [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) و [pnpm](https://pnpm.io/aliases/) از alias کردن با پیشوند `npm:‎` پشتیبانی می‌کنند.
:::

## منطق افزونه مخصوص SSR

برخی فریم‌ورک‌ها مثل Vue یا Svelte، کامپوننت‌ها را بسته به این‌که برای کلاینت باشند یا SSR، به شکل‌های مختلفی کامپایل می‌کنند. با استفاده از این ویژگی، افزونه‌ها می‌توانند رفتار متفاوتی در حالت SSR نسبت به کلاینت داشته باشند. برای پشتیبانی از این تبدیل‌های شرطی، Vite یک ویژگی اضافی به نام `ssr` را در آبجکت `options` به هوک‌های زیر از افزونه‌ها منتقل می‌کند:

- `resolveId`
- `load`
- `transform`

**مثال:**

```js twoslash
/** @type {() => import('vite').Plugin} */
// ---cut---
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // ... SSR انجام تبدیل مخصوص
      }
    },
  }
}
```

آبجکت `options` که در توابع `load` و `transform` استفاده می‌شود، اختیاری است. Rollup در حال حاضر از این آبجکت استفاده نمی‌کند، اما ممکن است در آینده برای افزودن اطلاعات بیشتر به این hookها از آن استفاده شود.

:::tip نکته
قبل از نسخه 2.7 از Vite، اطلاعات مربوط به SSR به جای اینکه در آبجکت `options` قرار بگیرد، به صورت یک پارامتر جداگانه به توابع پلاگین داده می‌شد. الان بیشتر فریم‌ورک‌ها و پلاگین‌ها به‌روز شده‌اند، ولی ممکن است هنوز در برخی منابع قدیمی نسخه قبلی این روش را ببینید.
:::

## هدف SSR

هدف پیش‌فرض برای ساخت SSR، محیط Node است، اما شما همچنین می‌توانید سرور را در یک Web Worker اجرا کنید. نحوه حل ارجاعات پکیج‌ها برای هر پلتفرم متفاوت است. شما می‌توانید هدف را به Web Worker تغییر دهید با تنظیم `ssr.target` به `'webworker'`.

## بسته‌بندی SSR

در برخی موارد مانند رانتایم `webworker`، ممکن است بخواهید بیلد SSR خود را به در یک فایل جاوا اسکریپت واحد بسته‌بندی (bundle) کنید. شما می‌توانید این رفتار را با تنظیم `ssr.noExternal` به `true` فعال کنید. این کار دو چیز انجام می‌دهد:

- تمام وابستگی‌ها را به عنوان `noExternal` در نظر می‌گیرد.
- اگر هرکدام از کتابخانه‌های داخلی Node.js ایمپورت شوند، یک خطا ایجاد می‌کند.

## شرایط حل بسته برای SSR

به طور پیش‌فرض، برای ساخت SSR، Vite از شرایطی که در [`resolve.conditions`](../config/shared-options.md#resolve-conditions) تنظیم شده است، برای حل ورودی بسته‌ها استفاده می‌کند. شما می‌توانید با استفاده از گزینه‌های [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) و [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions)، این رفتار را تغییر داده و سفارشی‌سازی کنید.

## Vite CLI

دستورات CLI مانند `‎$ vite dev` و `‎$ vite preview` می‌توانند برای برنامه‌های SSR نیز استفاده شوند. شما می‌توانید میدل‌ورهای SSR خود را با استفاده از [`configureServer`](/guide/api-plugin#configureserver) به سرور توسعه و با استفاده از [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver) به سرور پیش‌نمایش اضافه کنید.

:::tip نکته
از هوک پس از عملیات استفاده کنید تا میانه‌افزار SSR شما _پس از_ میدل‌ورهای Vite اجرا شود.
:::
