# گزینه‌های مشترک

مگر اینکه ذکر شده باشد، گزینه‌های این بخش برای همه حالت‌های توسعه (dev)، ساخت (build) و پیش‌نمایش (preview) اعمال می‌شوند.

## root

- **تایپ:** `string`
- **پیش‌فرض:** `()process.cwd`

پوشه ریشه پروژه (محلی که فایل `index.html` در آن قرار دارد). می‌تواند یک مسیر مطلق یا یک مسیر نسبت به پوشه کاری فعلی باشد.

برای اطلاعات بیشتر، به [ریشه پروژه](/guide/#index-html-و-ریشه-root-پروژه) مراجعه کنید.

## base

- **تایپ:** `string`
- **پیش‌فرض:** `/`
- **مرتبط:** [`server.origin`](/config/server-options.md#server-origin)

مسیر عمومی پایه هنگام ارائه در توسعه یا تولید. مقادیر معتبر شامل موارد زیر هستند:

- مسیر URL مطلق، مثل `/foo/`
- URL کامل، مثل `/https://bar.com/foo` (بخش origin در توسعه استفاده نمی‌شود، بنابراین مقدار همان `/foo/` است)
- رشته خالی یا `/.` (برای استقرار جاسازی‌شده)

برای اطلاعات بیشتر، به [مسیر پایه عمومی](/guide/build#public-base-path) مراجعه کنید.

## mode

- **تایپ:** `string`
- **پیش‌فرض:** `'development'` برای توسعه، `'production'` برای ساخت

مشخص کردن این در تنظیمات، حالت پیش‌فرض را برای **هر دو توسعه و ساخت** بازنویسی می‌کند. این مقدار همچنین می‌تواند از طریق گزینه `mode--` در خط فرمان بازنویسی شود.

برای اطلاعات بیشتر، به [متغیرهای محیطی و حالت‌ها](/guide/env-and-mode) مراجعه کنید.

## define

- **تایپ:** `<Record<string, any`

تعریف جایگزین‌های ثابت سراسری. موارد تعریف‌شده در طول توسعه به صورت سراسری تعریف می‌شوند و در زمان ساخت به صورت ایستا جایگزین می‌شوند.

Vite از [تعاریف esbuild](https://esbuild.github.io/api/#define) برای انجام جایگزینی‌ها استفاده می‌کند، بنابراین عبارات مقدار باید یک رشته شامل مقدار قابل سریال‌سازی JSON (null، بولین، عدد، رشته، آرایه یا آبجکت) یا یک شناسه واحد باشند. برای مقادیر غیررشته‌ای، Vite به صورت خودکار آن را با `JSON.stringify` به رشته تبدیل می‌کند.

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
برای کاربران TypeScript، مطمئن شوید که اعلان‌های تایپ را در فایل `vite-env.d.ts` اضافه کرده‌اید تا بررسی تایپ و Intellisense داشته باشید.

مثال:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **تایپ:** `[](<[]Plugin | Plugin[] | Promise<Plugin | Plugin)`

آرایه‌ای از پلاگین‌ها برای استفاده. پلاگین‌های falsy نادیده گرفته می‌شوند و آرایه‌های پلاگین‌ها به یک آرایه‌ی ساده تبدیل می‌شوند. اگر یک Promise برگردانده شود، قبل از اجرا رفع می‌شود. برای اطلاعات بیشتر در مورد پلاگین‌های Vite، به [API پلاگین](/guide/api-plugin) مراجعه کنید.

## publicDir

- **تایپ:** `string | false`
- **پیش‌فرض:** `"public"`

پوشه‌ای برای ارائه به عنوان دارایی‌های استاتیک ساده. فایل‌های این پوشه در طول توسعه در `/` ارائه می‌شوند و در زمان ساخت به ریشه `outDir` کپی می‌شوند و همیشه بدون تغییر ارائه یا کپی می‌شوند. مقدار می‌تواند یک مسیر مطلق در سیستم فایل یا یک مسیر نسبت به ریشه پروژه باشد.

تنظیم `publicDir` به `false` این قابلیت را غیرفعال می‌کند.

برای اطلاعات بیشتر، به [پوشه `public`](/guide/assets.html#دایرکتوری-public) مراجعه کنید.

## cacheDir

- **تایپ:** `string`
- **پیش‌فرض:** `"node_modules/.vite"`

پوشه‌ای برای ذخیره فایل‌های کش. فایل‌های این پوشه شامل وابستگی‌های پیش‌باندل‌شده یا سایر فایل‌های کش تولیدشده توسط Vite هستند که می‌توانند عملکرد را بهبود ببخشند. می‌توانید از پرچم `force--` استفاده کنید یا پوشه را به صورت دستی حذف کنید تا فایل‌های کش دوباره تولید شوند. مقدار می‌تواند یک مسیر مطلق در سیستم فایل یا یک مسیر نسبت به ریشه پروژه باشد. اگر فایل `package.json` تشخیص داده نشود، به صورت پیش‌فرض `vite.` خواهد بود.

## resolve.alias

- **تایپ:** <br>
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

به `rollup/plugin-alias@` به عنوان [گزینه entries](https://github.com/rollup/plugins/tree/master/packages/alias#entries) منتقل می‌شود. می‌تواند یک آبجکت یا آرایه‌ای از جفت‌های `{ find, replacement, customResolver }` باشد.

هنگام استفاده از alias برای مسیرهای سیستم فایل، همیشه از مسیرهای مطلق استفاده کنید. مقادیر alias نسبی به همان شکل استفاده می‌شوند و به مسیرهای سیستم فایل تبدیل نمی‌شوند.

برای انجام پردازش‌های پیشرفته‌تر هنگام حل مسیرها (resolution)، می‌توان از [پلاگین‌ها](/guide/api-plugin) استفاده کرد.

::: warning استفاده با SSR
اگر alias‌هایی را برای [وابستگی‌های خارجی SSR](/guide/ssr.md#ssr-externals) تنظیم کرده‌اید، ممکن است بخواهید پکیج‌های واقعی `node_modules` را alias کنید. هر دو [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) و [pnpm](https://pnpm.io/aliases/) از alias کردن از طریق پیشوند `:npm` پشتیبانی می‌کنند.
:::

## resolve.dedupe

- **تایپ:** `[]string`

اگر در پروژه‌ی خود چندین نسخه‌ی تکراری از یک کتابخانه یا وابستگی دارید (مثلاً به دلیل مدیریت وابستگی‌ها با hoisting یا بسته‌های لینک‌شده در یک monorepo)، می‌توانید از این گزینه استفاده کنید تا Vite همیشه فقط یک نسخه‌ی مشخص از آن کتابخانه را استفاده کند. این کار از بروز مشکلات ناسازگاری و افزایش حجم نهایی جلوگیری می‌کند، زیرا همه‌ی بخش‌های پروژه از یک نسخه‌ی مشترک استفاده خواهند کرد.

::: warning SSR + ESM
برای ساخت‌های SSR، حذف تکرار در خروجی‌های ساخت ESM که از `build.rollupOptions.output` تنظیم شده‌اند کار نمی‌کند. راه‌حل موقت استفاده از خروجی‌های ساخت CJS است تا زمانی که ESM پشتیبانی بهتری برای بارگذاری ماژول از پلاگین‌ها داشته باشد.
:::

## resolve.conditions

- **تایپ:** `[]string`
- **پیش‌فرض:**`['module', 'browser', 'development|production']` (`defaultClientConditions`)

شرایط اضافی که هنگام تعیین مسیر خروجی‌های شرطی ([Conditional Exports](https://nodejs.org/api/packages.html#packages_conditional_exports)) از یک پکیج مجاز هستند.

یک پکیج با اکسپورت‌های شرطی ممکن است فیلد `exports` زیر را در `package.json` خود داشته باشد:

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

در اینجا، `import` و `require` "شرایط" هستند. شرایط می‌توانند تودرتو باشند و باید از خاص‌ترین به عمومی‌ترین مشخص شوند.

`development|production` یک مقدار خاص است که بسته به مقدار `process.env.NODE_ENV` با `production` یا `development` جایگزین می‌شود. وقتی `'process.env.NODE_ENV === 'production` باشد، به `production` و در غیر این صورت به `development` تبدیل می‌شود.

توجه کنید که شرایط `import`، `require` و `default` همیشه در صورت برآورده شدن الزامات اعمال می‌شوند.

## resolve.mainFields

- **تایپ:** `[]string`
- **پیش‌فرض:** (`defaultClientMainFields`) `['browser', 'module', 'jsnext:main', 'jsnext']`

فهرست فیلدهایی در `package.json` که هنگام رزولوشن نقطه ورود یک پکیج امتحان می‌شوند. توجه داشته باشید که این اولویت کمتری نسبت به اکسپورت شرطی رزولوش‌شده از فیلد `exports` دارد: اگر نقطه ورودی با موفقیت از `exports` رزولوش شود، فیلد main نادیده گرفته می‌شود.

## resolve.extensions

- **تایپ:** `[]string`
- **پیش‌فرض:** `['mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json.']`

فهرست پسوندهای فایل برای امتحان کردن در ایمپورت‌هایی که پسوند را حذف کرده‌اند. توجه داشته باشید که توصیه نمی‌شود پسوندها را برای تایپ‌های ایمپورت سفارشی (مثل `vue.`) حذف کنید، زیرا می‌تواند با پشتیبانی IDE و تایپ تداخل داشته باشد.

## resolve.preserveSymlinks

- **تایپ:** `boolean`
- **پیش‌فرض:** `false`

فعال کردن این تنظیم باعث می‌شود Vite هویت فایل را بر اساس مسیر اصلی فایل (یعنی مسیر بدون دنبال کردن symlink‌ها) به جای مسیر واقعی فایل (یعنی مسیر پس از دنبال کردن symlink‌ها) تعیین کند.

- **مرتبط:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks)،
[webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## html.cspNonce

- **تایپ:** `string`
- **مرتبط:** [سیاست امنیتی محتوا (CSP)](/guide/features#content-security-policy-csp)

یک نگهدارنده مقدار nonce که هنگام تولید تگ‌های اسکریپت/استایل استفاده می‌شود. تنظیم این مقدار همچنین یک تگ meta با مقدار nonce تولید می‌کند.

## css.modules

- **تایپ:**
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
     * undefined :پیش‌فرض
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

رفتار ماژول‌های CSS را پیکربندی می‌کند. گزینه‌ها به [postcss-modules](https://github.com/css-modules/postcss-modules) منتقل می‌شوند.

این گزینه هنگام استفاده از [Lightning CSS](../guide/features.md#lightning-css) تأثیری ندارد. در صورت فعال بودن، باید از [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) استفاده شود.

## css.postcss

- **تایپ:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

پیکربندی درون‌خطی PostCSS یا یک پوشه سفارشی برای جستجوی پیکربندی PostCSS (پیش‌فرض ریشه پروژه است).

برای پیکربندی درون‌خطی PostCSS، فرمت مشابه `postcss.config.js` انتظار می‌رود. اما برای ویژگی `plugins`، فقط [فرمت آرایه](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) قابل استفاده است.

جستجو با استفاده از [postcss-load-config](https://github.com/postcss/postcss-load-config) انجام می‌شود و فقط نام‌های فایل پیکربندی پشتیبانی‌شده بارگذاری می‌شوند. فایل‌های پیکربندی خارج از ریشه workspace (یا [ریشه پروژه](/guide/#index-html-و-ریشه-root-پروژه) اگر workspace یافت نشود) به صورت پیش‌فرض جستجو نمی‌شوند. در صورت نیاز، می‌توانید یک مسیر سفارشی خارج از ریشه را برای بارگذاری فایل پیکربندی خاص مشخص کنید.

توجه داشته باشید اگر پیکربندی درون‌خطی ارائه شود، Vite برای سایر منابع پیکربندی PostCSS جستجو نمی‌کند.

## css.preprocessorOptions

- **تایپ:** `<Record<string, object`

گزینه‌هایی را برای انتقال به پیش‌پردازنده‌های CSS مشخص می‌کند. پسوندهای فایل به عنوان کلید برای گزینه‌ها استفاده می‌شوند. گزینه‌های پشتیبانی‌شده برای هر پیش‌پردازنده را می‌توان در مستندات مربوطه آنها یافت:

- `sass`/`scss`:
  - اگر پکیج `sass-embedded` نصب شده باشد، از آن استفاده می‌کند؛ در غیر این صورت از `sass` معمولی استفاده می‌شود. برای عملکرد بهتر، توصیه می‌شود پکیج `sass-embedded` را نصب کنید.
  - [گزینه‌ها](https://sass-lang.com/documentation/js-api/interfaces/stringoptions/)
- `less`: [گزینه‌ها](https://lesscss.org/usage/#less-options).
- `styl`/`stylus`: فقط [`define`](https://stylus-lang.com/docs/js.html#define-name-node) پشتیبانی می‌شود که می‌تواند به صورت یک آبجکت منتقل شود.

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
        importers: [
          // ...
        ],
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **تایپ:**<br> `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

این گزینه می‌تواند برای تزریق کد اضافی به هر محتوای استایل استفاده شود. توجه داشته باشید که اگر استایل‌های واقعی و نه فقط متغیرها را شامل شوید، این استایل‌ها در باندل نهایی تکرار خواهند شد.

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

- **تایپ:** `number | true`
- **پیش‌فرض:** `true`

تعداد حداکثری رشته‌های پردازشی (threads) که پیش‌پردازنده‌های CSS می‌توانند استفاده کنند را مشخص می‌کند. اگر مقدار `true` باشد، به این معنی است که از حداکثر تعداد هسته‌های CPU منهای یک استفاده خواهد شد. اگر مقدار `0` تنظیم شود، Vite هیچ پردازشگری ایجاد نمی‌کند و پیش‌پردازنده‌ها را در نخ اصلی (main thread) اجرا خواهد کرد.

بسته به تنظیمات پیش‌پردازنده، ممکن است Vite حتی اگر این گزینه روی `0` تنظیم نشده باشد، باز هم پیش‌پردازنده‌ها را در نخ اصلی اجرا کند.

## css.devSourcemap

- **آزمایشی:** [بازخورد دهید](https://github.com/vitejs/vite/discussions/13845)
- **تایپ:** `boolean`
- **پیش‌فرض:** `false`

آیا در طول توسعه sourcemap‌ها فعال شوند یا خیر.

## css.transformer

- **آزمایشی:** [بازخورد دهید](https://github.com/vitejs/vite/discussions/13835)
- **تایپ:** `'postcss' | 'lightningcss'`
- **پیش‌فرض:** `'postcss'`

موتور مورد استفاده برای پردازش CSS را انتخاب می‌کند. برای اطلاعات بیشتر به [Lightning CSS](../guide/features.md#lightning-css) مراجعه کنید.

::: info تکرار `import@`ها
توجه داشته باشید که postcss (postcss-import) رفتار متفاوتی با `import@`های تکراری نسبت به مرورگرها دارد. به [postcss/postcss-import#462](https://github.com/postcss/postcss-import/issues/462) مراجعه کنید.
:::

## css.lightningcss

- **آزمایشی:** [بازخورد دهید](https://github.com/vitejs/vite/discussions/13835)
- **تایپ:**

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

Lightning CSS را پیکربندی می‌کند. گزینه‌های کامل تبدیل را می‌توان در [مخزن Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts) یافت.

## json.namedExports

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

آیا از ایمپورت‌های نام‌گذاری‌شده از فایل‌های `json.` پشتیبانی شود یا خیر.

## json.stringify

- **تایپ:** `boolean | 'auto'`
- **پیش‌فرض:** `'auto'`

اگر روی `true` تنظیم شود، JSON ایمپورت‌شده به `("...")export default JSON.parse` تبدیل می‌شود که به طور قابل‌توجهی عملکرد بهتری نسبت به آبجکت‌های لفظی دارد، به‌ویژه وقتی فایل JSON بزرگ باشد.

اگر روی `'auto'` تنظیم شود، داده‌ها فقط در صورتی به رشته تبدیل می‌شوند که [داده بزرگ‌تر از 10 کیلوبایت باشد](https://v8.dev/blog/cost-of-javascript-2019#json:~:text=A%20good%20rule%20of%20thumb%20is%20to%20apply%20this%20technique%20for%20objects%20of%2010%20kB%20or%20larger).

## esbuild

- **تایپ:** `ESBuildOptions | false`

`ESBuildOptions` گزینه‌های تبدیل خود [esbuild](https://esbuild.github.io/api/#transform) را گسترش می‌دهد. رایج‌ترین مورد استفاده، سفارشی‌سازی JSX است:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

به صورت پیش‌فرض، esbuild روی فایل‌های `ts`، `jsx` و `tsx` اعمال می‌شود. می‌توانید این را با `esbuild.include` و `esbuild.exclude` که می‌تواند یک regex، یک الگوی [picomatch](https://github.com/micromatch/picomatch#globbing-features)، یا آرایه‌ای از هر کدام باشد، سفارشی کنید.

علاوه بر این، می‌توانید از `esbuild.jsxInject` برای تزریق خودکار ایمپورت‌های کمکی JSX برای هر فایلی که توسط esbuild تبدیل می‌شود استفاده کنید:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

وقتی [`build.minify`](./build-options.md#build-minify) روی `true` باشد، همه بهینه‌سازی‌های فشرده‌سازی به صورت پیش‌فرض اعمال می‌شوند. برای غیرفعال کردن [جنبه‌های خاصی](https://esbuild.github.io/api/#minify) از آن، هر یک از گزینه‌های `esbuild.minifyIdentifiers`، `esbuild.minifySyntax` یا `esbuild.minifyWhitespace` را روی `false` تنظیم کنید. توجه داشته باشید که گزینه `esbuild.minify` نمی‌تواند `build.minify` را بازنویسی کند.

برای غیرفعال کردن تبدیل‌های esbuild، روی `false` تنظیم کنید.

## assetsInclude

- **تایپ:** `[]string | RegExp | (string | RegExp)`
- **مرتبط:** [مدیریت دارایی‌های استاتیک](/guide/assets)

الگوهای اضافی [picomatch](https://github.com/micromatch/picomatch#globbing-features) را به عنوان دارایی‌های استاتیک مشخص می‌کند تا:

- هنگام ارجاع از HTML یا درخواست مستقیم از طریق `fetch` یا XHR، از خط لوله تبدیل پلاگین خارج شوند.

- ایمپورت آنها از جاوااسکریپت، رشته URL رزولوش‌شده آنها را برمی‌گرداند (اگر پلاگینی با `'enforce: 'pre` برای مدیریت نوع دارایی به طور متفاوت داشته باشید، این می‌تواند بازنویسی شود).

فهرست نوع دارایی‌های داخلی را می‌توان [اینجا](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts) یافت.

**مثال:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **تایپ:** `'info' | 'warn' | 'error' | 'silent'`

سطح جزئیات خروجی کنسول را تنظیم می‌کند. پیش‌فرض `'info'` است.

## customLogger

- **تایپ:**
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

از یک logger سفارشی برای ثبت پیام‌ها استفاده کنید. می‌توانید از API `createLogger` در Vite استفاده کنید تا logger پیش‌فرض را بگیرید و آن را سفارشی کنید، مثلاً پیام را تغییر دهید یا هشدارهای خاصی را فیلتر کنید.

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

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

برای جلوگیری از پاک کردن صفحه ترمینال توسط Vite هنگام ثبت برخی پیام‌ها، روی `false` تنظیم کنید. از طریق خط فرمان، از `clearScreen false--` استفاده کنید.

## envDir

- **تایپ:** `string | false`
- **پیش‌فرض:** `root`

پوشه‌ای که فایل‌های `env.` از آن بارگذاری می‌شوند. می‌تواند یک مسیر مطلق یا یک مسیر نسبت به ریشه پروژه باشد. اگر مقدار آن `false` باشد، بارگذاری فایل‌های `‎.env` غیرفعال می‌شود.

برای اطلاعات بیشتر در مورد فایل‌های محیطی، [اینجا](/guide/env-and-mode.html#فایل‌های-%E2%80%8E-env) را ببینید.

## envPrefix

- **تایپ:** `[]string | string`
- **پیش‌فرض:** `VITE_‎`

متغیرهای محیطی که با `envPrefix` شروع می‌شوند از طریق `import.meta.env` به کد منبع سمت کلاینت شما در دسترس خواهند بود.

::: warning نکات امنیتی
`envPrefix` نباید به صورت `''` تنظیم شود، زیرا این کار همه متغیرهای محیطی شما را در معرض دید قرار می‌دهد و ممکن است منجر به نشت غیرمنتظره اطلاعات حساس شود. Vite هنگام تشخیص `''` خطا می‌دهد.

اگر می‌خواهید یک متغیر بدون پیشوند را در معرض دید قرار دهید، می‌توانید از [define](#define) استفاده کنید:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **تایپ:** `'spa' | 'mpa' | 'custom'`
- **پیش‌فرض:** `'spa'`

مشخص می‌کند که برنامه شما یک برنامه تک‌صفحه‌ای (SPA)، یک [برنامه چندصفحه‌ای (MPA)](../guide/build#multi-page-app) یا برنامه سفارشی (SSR و چارچوب‌هایی با مدیریت HTML سفارشی) است:

- `'spa'`: شامل میان‌افزارهای HTML و استفاده از بازگشت SPA. در پیش‌نمایش، [sirv](https://github.com/lukeed/sirv) را با `single: true` پیکربندی می‌کند.
- `'mpa'`: شامل میان‌افزارهای HTML.
- `'custom'`: شامل میان‌افزارهای HTML نمی‌شود.

برای اطلاعات بیشتر در راهنمای [SSR Vite](/guide/ssr#vite-cli) بخوانید. مرتبط: [`server.middlewareMode`](./server-options#server-middlewaremode).

## future

- **تایپ:** `<Record<string, 'warn' | undefined`
- **مرتبط:** [تغییرات ناسازگار](/changes/)

تغییرات ناسازگار آینده را فعال می‌کند تا برای مهاجرت روان به نسخه اصلی بعدی Vite آماده شوید. این فهرست ممکن است در هر زمان با توسعه ویژگی‌های جدید به‌روزرسانی، اضافه یا حذف شود.

برای جزئیات گزینه‌های ممکن، صفحه [تغییرات ناسازگار](/changes/) را ببینید.
