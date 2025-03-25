# گزینه‌های مشترک

مگر در مواردی که به‌صورت جداگانه ذکر شده باشد، گزینه‌های این بخش برای همهٔ مراحل توسعه (dev)، ساخت (build) و پیش‌نمایش (preview) اعمال می‌شوند.

## root

- **نوع:** `string`
- **پیش‌فرض:** `()process.cwd`

دایرکتوری ریشهٔ پروژه (محلی که فایل `index.html` قرار دارد). می‌تواند یک مسیر مطلق یا مسیری نسبی نسبت به دایرکتوری کاری فعلی باشد.

برای اطلاعات بیشتر، [ریشهٔ پروژه](/guide/#index-html-and-project-root) را ببینید.

## base

- **نوع:** `string`
- **پیش‌فرض:** `/`
- **مرتبط:** [`server.origin`](/config/server-options.md#server-origin)

مسیر پایهٔ عمومی هنگام اجرا در حالت توسعه یا تولید. مقادیر معتبر شامل:

- مسیر URL مطلق، مانند: `/foo/`
- URL کامل، مانند: `/https://bar.com/foo` (بخش origin در حالت توسعه استفاده نمی‌شود، بنابراین مقدار آن با `/foo/` یکسان است)
- رشتهٔ خالی یا `/.` (برای استقرار توکار)

برای اطلاعات بیشتر، [مسیر پایهٔ عمومی](/guide/build#public-base-path) را ببینید.

## mode

- **نوع:** `string`
- مقدار پیش‌فرض: `'development'` برای serve و `'production'` برای build

تعیین این مقدار در تنظیمات، حالت پیش‌فرض را برای **هر دو مرحلهٔ serve و build** بازنویسی می‌کند. این مقدار همچنین می‌تواند از طریق گزینهٔ خط فرمان `--mode` بازنویسی شود.

برای اطلاعات بیشتر، [متغیرهای محیطی و حالت‌ها](/guide/env-and-mode) را ببینید.

## define

- **نوع:** `<Record<string, any`

تعریف جایگزینی‌های سراسری برای مقادیر ثابت. این مقادیر به‌عنوان ثابت‌های سراسری در زمان توسعه تعریف شده و در زمان ساخت به‌صورت ایستا جایگزین می‌شوند.

Vite از [تعاریف esbuild](https://esbuild.github.io/api/#define) برای انجام جایگزینی استفاده می‌کند، بنابراین مقدار باید به‌صورت رشته‌ای باشد که یک مقدار قابل سریال‌سازی با JSON (null، boolean، عدد، رشته، آرایه یا آبجکت) یا یک شناسهٔ منفرد را شامل شود. برای مقادیر غیررشته‌ای، Vite به‌صورت خودکار آن‌ها را با استفاده از `JSON.stringify` به رشته تبدیل می‌کند.

**مثال:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip نکته
برای کاربران TypeScript، حتماً نوع این مقادیر را در فایل `env.d.ts` یا `vite-env.d.ts` تعریف کنید تا از بررسی نوع و Intellisense بهره‌مند شوید.

مثال:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **نوع:** `[](<[]Plugin | Plugin[] | Promise<Plugin | Plugin)`

آرایه‌ای از پلاگین‌هایی که باید استفاده شوند. پلاگین‌های نادرست نادیده گرفته می‌شوند و آرایه‌ها صاف می‌شوند. اگر یک promise بازگردانده شود، پیش از اجرا حل خواهد شد. برای اطلاعات بیشتر دربارهٔ پلاگین‌های Vite، [API پلاگین](/guide/api-plugin) را ببینید.

## publicDir

- **نوع:** `string | false`
- **پیش‌فرض:** `"public"`

دایرکتوری‌ای برای ارائهٔ فایل‌های ایستا. فایل‌های موجود در این دایرکتوری در زمان توسعه در مسیر `/` ارائه می‌شوند و در زمان build به ریشهٔ `outDir` کپی می‌شوند، و همیشه به‌صورت مستقیم و بدون هیچ‌گونه تبدیلی ارائه یا کپی می‌گردند. مقدار این گزینه می‌تواند مسیر مطلق فایل سیستم یا مسیری نسبی نسبت به ریشهٔ پروژه باشد.

اگر `publicDir` را برابر `false` قرار دهید، این ویژگی غیرفعال می‌شود.

برای اطلاعات بیشتر، [دایرکتوری `public`](/guide/assets#the-public-directory) را ببینید.

## cacheDir

- **نوع:** `string`
- **پیش‌فرض:** `"node_modules/.vite"`

دایرکتوری برای ذخیرهٔ فایل‌های کش. فایل‌های موجود در این دایرکتوری شامل وابستگی‌های پیش‌پردازش‌شده یا سایر فایل‌های کش تولیدشده توسط Vite هستند که می‌توانند عملکرد را بهبود دهند. می‌توانید از پرچم `--force` استفاده کنید یا این دایرکتوری را دستی حذف کنید تا فایل‌های کش دوباره تولید شوند. مقدار این گزینه می‌تواند مسیر مطلق یا مسیری نسبی نسبت به ریشهٔ پروژه باشد. زمانی که فایل `package.json` وجود ندارد، پیش‌فرض به `.vite` تغییر می‌کند.

## resolve.alias

- **نوع:**
<div dir="ltr">
<code>'Record&lt;string, string&gt; | Array&lt;{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }&gt;'</code>
</div>

این مقدار به‌عنوان گزینهٔ [entries در `@rollup/plugin-alias`](https://github.com/rollup/plugins/tree/master/packages/alias#entries) ارسال می‌شود. می‌تواند به‌صورت یک آبجکت یا آرایه‌ای از جفت‌های `{ find, replacement, customResolver }` باشد.

هنگام ایجاد alias برای مسیرهای فایل سیستم، همیشه از مسیرهای مطلق استفاده کنید. مقادیر نسبی به همان شکل استفاده می‌شوند و به مسیرهای فایل سیستم تبدیل نمی‌گردند.

امکان پیاده‌سازی رزولوشن پیشرفته‌تر از طریق [پلاگین‌ها](/guide/api-plugin) وجود دارد.

::: warning استفاده در SSR
اگر alias برای وابستگی‌های خارجی‌سازی‌شده در [SSR](/guide/ssr.md#ssr-externals) تنظیم کرده‌اید، ممکن است بخواهید به بسته‌های واقعی موجود در `node_modules` اشاره کنید. هم [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) و هم [pnpm](https://pnpm.io/aliases/) از alias کردن با پیشوند `npm:` پشتیبانی می‌کنند.
:::

## resolve.dedupe

- **نوع:** `[]string`

اگر در اپلیکیشن خود نسخه‌های تکراری از یک وابستگی دارید (احتمالاً به دلیل hoisting یا بسته‌های لینک‌شده در monorepo)، از این گزینه استفاده کنید تا Vite همیشه وابستگی‌های مشخص‌شده را از یک نسخهٔ یکسان (از ریشهٔ پروژه) resolve کند.

:::warning SSR + ESM
در ساخت SSR، حذف تکرار (deduplication) برای خروجی‌های ESM که با `build.rollupOptions.output` پیکربندی شده‌اند، کار نمی‌کند. راه‌حل موقت استفاده از خروجی‌های CJS است تا زمانی که پشتیبانی پلاگین‌ها از بارگذاری ماژول در ESM بهبود یابد.
:::

## resolve.conditions

- **نوع:** `[]string`
- **پیش‌فرض:**  (`defaultClientConditions`) `['module', 'browser', 'development|production']`

شرایط اضافی مجاز هنگام resolve کردن [صادرات شرطی](https://nodejs.org/api/packages.html#packages_conditional_exports) از یک بسته.

یک بسته با صادرات شرطی ممکن است فیلد `exports` زیر را در فایل `package.json` داشته باشد:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

در اینجا، `import` و `require` "شرط" هستند. شرط‌ها می‌توانند تو در تو باشند و باید از خاص‌ترین تا عمومی‌ترین مشخص شوند.

مقدار ویژهٔ `development|production` با توجه به مقدار `process.env.NODE_ENV` جایگزین می‌شود. اگر مقدار `process.env.NODE_ENV === 'production'` باشد، این مقدار با `production` جایگزین می‌شود، در غیر این صورت با `development`.

توجه داشته باشید که شرط‌های `import`، `require` و `default` همیشه در صورت برآورده شدن شرایط اعمال می‌شوند.

:::warning resolve کردن subpath exports
کلیدهای صادراتی که با "/" پایان می‌یابند توسط Node منسوخ شده‌اند و ممکن است به‌درستی کار نکنند. لطفاً از نویسندهٔ بسته بخواهید تا از [الگوهای subpath با `*`](https://nodejs.org/api/packages.html#package-entry-points) استفاده کند.
:::

## resolve.mainFields

- **نوع:** `[]string`
- **پیش‌فرض:** (`defaultClientMainFields`) `['browser', 'module', 'jsnext:main', 'jsnext']`

لیستی از فیلدها در `package.json` که هنگام resolve کردن نقطهٔ ورود یک بسته بررسی می‌شوند. توجه داشته باشید که این گزینه نسبت به صادرات شرطی که از فیلد `exports` resolve شده‌اند، اولویت پایین‌تری دارد: اگر نقطهٔ ورود از طریق `exports` با موفقیت resolve شود، فیلدهای اصلی نادیده گرفته می‌شوند.

## resolve.extensions

- **نوع:** `[]string`
- **پیش‌فرض:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

لیست پسوندهایی که هنگام import بدون پسوند بررسی می‌شوند. توجه داشته باشید که **توصیه نمی‌شود** برای انواع import سفارشی (مثلاً `.vue`) پسوند را حذف کنید، چرا که می‌تواند باعث تداخل در پشتیبانی IDE و تایپ شود.

## resolve.preserveSymlinks

- **نوع:** `boolean`
- **پیش‌فرض:** `false`

فعال کردن این گزینه باعث می‌شود Vite هویت فایل‌ها را بر اساس مسیر اصلی فایل (بدون دنبال کردن symlinkها) تعیین کند، به‌جای مسیر واقعی فایل (پس از دنبال کردن symlinkها).

- **مرتبط:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks)، [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **نوع:** `string`
- **مرتبط:** [سیاست امنیت محتوا (CSP)](/guide/features#content-security-policy-csp)

یک مقدار nonce که هنگام تولید تگ‌های script / style استفاده می‌شود. تنظیم این مقدار باعث می‌شود یک meta tag با مقدار nonce نیز تولید شود.

## css.modules

- **نوع:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * پیش‌فرض: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

پیکربندی رفتار ماژول‌های CSS. این گزینه‌ها به [postcss-modules](https://github.com/css-modules/postcss-modules) منتقل می‌شوند.

این گزینه هنگام استفاده از [Lightning CSS](../guide/features.md#lightning-css) اثری ندارد. در صورت فعال بودن، باید از [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) استفاده شود.

## css.postcss

- **نوع:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

پیکربندی PostCSS به‌صورت درون‌خطی یا مسیر سفارشی برای جستجوی تنظیمات PostCSS (پیش‌فرض، ریشهٔ پروژه است).

برای پیکربندی درون‌خطی، همان فرمت فایل `postcss.config.js` انتظار می‌رود. اما برای ویژگی `plugins` فقط [فرمت آرایه‌ای](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) قابل استفاده است.

جستجو با استفاده از [postcss-load-config](https://github.com/postcss/postcss-load-config) انجام می‌شود و تنها نام فایل‌های پیکربندی پشتیبانی‌شده بارگذاری می‌شوند. فایل‌های پیکربندی خارج از ریشهٔ workspace (یا [ریشهٔ پروژه](/guide/#index-html-and-project-root) در صورت عدم وجود workspace) به‌صورت پیش‌فرض جستجو نمی‌شوند. در صورت نیاز، می‌توانید یک مسیر سفارشی خارج از ریشه برای بارگذاری فایل پیکربندی مشخص کنید.

توجه داشته باشید که اگر یک پیکربندی درون‌خطی ارائه شود، Vite دیگر به دنبال منابع پیکربندی PostCSS نمی‌گردد.

## css.preprocessorOptions

- **نوع:** `<Record<string, object`

مشخص کردن گزینه‌هایی برای ارسال به پیش‌پردازنده‌های CSS. پسوند فایل‌ها به‌عنوان کلیدهای این آبجکت استفاده می‌شوند. گزینه‌های پشتیبانی‌شده برای هر پیش‌پردازنده را می‌توانید در مستندات مربوطه پیدا کنید:

- `sass`/`scss`:
  - انتخاب API مورد استفاده برای sass با گزینهٔ `api: "modern-compiler" | "modern" | "legacy"` (پیش‌فرض `"modern-compiler"` در صورت نصب بودن `sass-embedded`، در غیر این صورت `"modern"`). برای بهترین عملکرد، استفاده از `api: "modern-compiler"` همراه با بستهٔ `sass-embedded` توصیه می‌شود. API با مقدار `"legacy"` منسوخ شده و در Vite 7 حذف خواهد شد.
  - [گزینه‌ها (مدرن)](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
  - [گزینه‌ها (قدیمی)](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions)
- `less`: [گزینه‌ها](https://lesscss.org/usage/#less-options)
- `styl`/`stylus`: فقط [`define`](https://stylus-lang.com/docs/js.html#define-name-node) پشتیبانی می‌شود و به‌صورت یک آبجکت ارسال می‌شود.

**مثال:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
      scss: {
        api: 'modern-compiler', // یا "modern"، "legacy"
        importers: [
          // ...
        ],
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **نوع:** 
<div dir="ltr">
<code>string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))</code>
</div>

با استفاده از این گزینه می‌توان برای هر محتوای style کد اضافی تزریق کرد. توجه داشته باشید اگر استایل‌های واقعی (نه فقط متغیرها) را تزریق کنید، آن استایل‌ها در خروجی نهایی تکرار خواهند شد.

**مثال:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers

- **آزمایشی:** [ارسال بازخورد](https://github.com/vitejs/vite/discussions/15835)
- **نوع:** `number | true`
- **پیش‌فرض:** `0` (هیچ workerای ایجاد نمی‌شود و عملیات در main thread اجرا می‌شود)

اگر این گزینه تنظیم شود، پیش‌پردازنده‌های CSS در صورت امکان در worker اجرا می‌شوند. مقدار `true` به معنی استفاده از تعداد CPU منهای ۱ است.

## css.devSourcemap

- **آزمایشی:** [ارسال بازخورد](https://github.com/vitejs/vite/discussions/13845)
- **نوع:** `boolean`
- **پیش‌فرض:** `false`

فعال یا غیرفعال‌سازی sourcemap در زمان توسعه.

## css.transformer

- **آزمایشی:** [ارسال بازخورد](https://github.com/vitejs/vite/discussions/13835)
- **نوع:** `'postcss' | 'lightningcss'`
- **پیش‌فرض:** `'postcss'`

انتخاب موتور مورد استفاده برای پردازش CSS. برای اطلاعات بیشتر، [Lightning CSS](../guide/features.md#lightning-css) را ببینید.

::: info تکرار `@import`
توجه داشته باشید که postcss (با postcss-import) رفتار متفاوتی نسبت به مرورگرها در مواجهه با `@import` تکراری دارد. ببینید [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462).
:::

## css.lightningcss

- **آزمایشی:** [ارسال بازخورد](https://github.com/vitejs/vite/discussions/13835)
- **نوع:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

پیکربندی Lightning CSS. لیست کامل گزینه‌های transform را می‌توانید در [مخزن Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts) ببینید.

## json.namedExports

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

فعال‌سازی یا غیرفعال‌سازی import با نام از فایل‌های `.json`.

## json.stringify

- **نوع:** `boolean | 'auto'`
- **پیش‌فرض:** `'auto'`

اگر مقدار `true` تنظیم شود، فایل JSON واردشده به صورت `export default JSON.parse("...")` تبدیل می‌شود که در مقایسه با literalها عملکرد بسیار بهتری دارد، به‌خصوص زمانی که فایل JSON بزرگ باشد.

اگر مقدار `'auto'` باشد، فقط زمانی داده‌ها به رشته تبدیل می‌شوند که [حجم آن‌ها بیشتر از ۱۰ کیلوبایت باشد](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **نوع:** `ESBuildOptions | false`

`ESBuildOptions` تنظیماتی را به ارث می‌برد از [گزینه‌های transform در esbuild](https://esbuild.github.io/api/#transform). رایج‌ترین کاربرد آن سفارشی‌سازی JSX است:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

به‌صورت پیش‌فرض، esbuild روی فایل‌های `ts`، `jsx` و `tsx` اعمال می‌شود. می‌توانید این رفتار را با `esbuild.include` و `esbuild.exclude` سفارشی کنید. این گزینه‌ها می‌توانند regex، الگوی [picomatch](https://github.com/micromatch/picomatch#globbing-features) یا آرایه‌ای از آن‌ها باشند.

همچنین می‌توانید از `esbuild.jsxInject` استفاده کنید تا importهای کمکی JSX به‌صورت خودکار در همه فایل‌هایی که توسط esbuild پردازش می‌شوند، تزریق شود:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

زمانی که [`build.minify`](./build-options.md#build-minify) `true` باشد، تمام بهینه‌سازی‌های فشرده‌سازی به‌صورت پیش‌فرض اعمال می‌شوند. برای غیرفعال‌سازی [بخش‌هایی خاص](https://esbuild.github.io/api/#minify)، می‌توانید گزینه‌های `esbuild.minifyIdentifiers`، `esbuild.minifySyntax` یا `esbuild.minifyWhitespace` را روی `false` تنظیم کنید. توجه داشته باشید گزینهٔ `esbuild.minify` نمی‌تواند گزینهٔ `build.minify` را بازنویسی کند.

اگر مقدار آن `false` باشد، تمام پردازش‌های esbuild غیرفعال می‌شوند.

## assetsInclude

- **نوع:** `[]string | RegExp | (string | RegExp)`
- **مرتبط:** [مدیریت دارایی‌های ایستا](/guide/assets)

مشخص کردن الگوهای اضافی [picomatch](https://github.com/micromatch/picomatch#globbing-features) که به‌عنوان دارایی‌های ایستا در نظر گرفته شوند، به‌طوری که:

- هنگام اشاره از HTML یا درخواست مستقیم از طریق `fetch` یا XHR از چرخهٔ transform پلاگین‌ها حذف می‌شوند.
- هنگام import از جاوااسکریپت، آدرس URL نهایی به‌عنوان رشته بازگردانده می‌شود (می‌توان آن را با پلاگینی با `enforce: 'pre'` بازنویسی کرد).

لیست نوع دارایی‌های پیش‌فرض را می‌توانید [اینجا](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) ببینید.

**مثال:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **نوع:** `'info' | 'warn' | 'error' | 'silent'`

تنظیم سطح جزئیات پیام‌های خروجی در کنسول. مقدار پیش‌فرض `'info'` است.

## customLogger

- **نوع:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

استفاده از logger سفارشی برای ثبت پیام‌ها. می‌توانید از API مربوط به `createLogger` در Vite استفاده کنید تا logger پیش‌فرض را دریافت و آن را برای مثال جهت تغییر پیام‌ها یا فیلتر کردن هشدارهای خاص سفارشی کنید.

```ts twoslash
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // خالی را نادیده بگیر CSS هشدار مربوط به فایل‌های
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

برای جلوگیری از پاک شدن صفحهٔ ترمینال هنگام ثبت برخی پیام‌ها توسط Vite، مقدار آن را برابر `false` قرار دهید. در خط فرمان می‌توانید از `--clearScreen false` استفاده کنید.

## envDir

- **نوع:** `string`
- **پیش‌فرض:** `root`

دایرکتوری‌ای که فایل‌های `.env` از آن بارگذاری می‌شوند. می‌تواند مسیر مطلق یا مسیری نسبی نسبت به ریشهٔ پروژه باشد.

برای اطلاعات بیشتر دربارهٔ فایل‌های محیطی، [اینجا](/guide/env-and-mode#env-files) را ببینید.

## envPrefix

- **نوع:** `[]string | string`
- **پیش‌فرض:** `VITE_`

متغیرهای محیطی‌ای که با `envPrefix` شروع می‌شوند در کد سمت کلاینت از طریق `import.meta.env` در دسترس قرار می‌گیرند.

:::warning نکات امنیتی
نباید مقدار `envPrefix` را برابر `''` قرار دهید، زیرا تمام متغیرهای محیطی شما را در دسترس کلاینت قرار می‌دهد و می‌تواند باعث افشای ناخواستهٔ اطلاعات حساس شود. در صورت تشخیص `''`، Vite خطا می‌دهد.

اگر می‌خواهید یک متغیر بدون پیشوند را در دسترس قرار دهید، می‌توانید از گزینهٔ [define](#define) استفاده کنید:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **نوع:** `'spa' | 'mpa' | 'custom'`
- **پیش‌فرض:** `'spa'`

نوع اپلیکیشن شما: اپلیکیشن تک‌صفحه‌ای (SPA)، [چندصفحه‌ای (MPA)](../guide/build#multi-page-app) یا اپلیکیشن سفارشی (SSR و فریم‌ورک‌های با پردازش HTML سفارشی):

- `'spa'`: شامل میان‌افزارهای HTML و استفاده از fallback برای SPA. در حالت preview با پیکربندی `single: true` در [sirv](https://github.com/lukeed/sirv)
- `'mpa'`: شامل میان‌افزارهای HTML
- `'custom'`: بدون میان‌افزار HTML

برای اطلاعات بیشتر، [راهنمای SSR در Vite](/guide/ssr#vite-cli) را ببینید. مرتبط با: [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **نوع:** `<Record<string, 'warn' | undefined`
- **مرتبط:** [تغییرات ناسازگار](/changes/)

فعال‌سازی تغییرات ناسازگار آینده به‌منظور آمادگی برای مهاجرت آسان به نسخهٔ اصلی بعدی Vite. این لیست ممکن است در هر زمان با توسعهٔ ویژگی‌های جدید به‌روزرسانی، اضافه یا حذف شود.

برای جزئیات بیشتر، صفحهٔ [تغییرات ناسازگار](/changes/) را ببینید.