# گزینه‌های ساخت

مگر آنکه ذکر شده باشد، گزینه‌های این بخش فقط به ساخت اعمال می‌شوند.

## build.target

- **نوع:** `string | string[]`
- **پیش‌فرض:** `'modules'`
- **مرتبط:** [سازگاری مرورگر](/guide/build#browser-compatibility)

هدف سازگاری مرورگر برای بسته نهایی. مقدار پیش‌فرض یک مقدار خاص از Vite است، `'modules'` که به مرورگرهایی با پشتیبانی از [ماژول‌های ES بومی](https://caniuse.com/es6-module)، [واردات دینامیک ESM بومی](https://caniuse.com/es6-module-dynamic-import) و [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) اشاره دارد. Vite مقدار `'modules'` را به `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']` تبدیل می‌کند.

مقدار خاص دیگری که وجود دارد، `'esnext'` است که فرض می‌کند پشتیبانی از واردات دینامیک بومی است و تنها حداقل تبدیل را انجام می‌دهد.

تبدیل با استفاده از esbuild انجام می‌شود و مقدار آن باید یک گزینه معتبر [هدف esbuild](https://esbuild.github.io/api/#target) باشد. اهداف سفارشی می‌توانند نسخه ES (برای مثال `es2015`)، مرورگری با نسخه (برای مثال `chrome58`) یا یک آرایه از چندین رشته هدف باشند.

توجه داشته باشید که ساخت زمانی شکست می‌خورد که کد حاوی ویژگی‌هایی باشد که نمی‌توان آنها را به‌طور ایمن با esbuild تبدیل کرد. برای جزئیات بیشتر به [مستندات esbuild](https://esbuild.github.io/content-types/#javascript) مراجعه کنید.

## build.modulePreload

- **نوع:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **پیش‌فرض:** `{ polyfill: true }`

به‌طور پیش‌فرض، یک [پلی‌فیل ماژول preload](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) به‌طور خودکار تزریق می‌شود. پلی‌فیل به‌طور خودکار در ماژول پروکسی هر ورودی `index.html` تزریق می‌شود. اگر ساخت برای استفاده از ورودی سفارشی غیر HTML از طریق `build.rollupOptions.input` پیکربندی شده باشد، باید پلی‌فیل را به‌صورت دستی در ورودی سفارشی خود وارد کنید:

```js
import 'vite/modulepreload-polyfill'
```

توجه: پلی‌فیل به [مد حالت کتابخانه](/guide/build#library-mode) اعمال نمی‌شود. اگر نیاز به پشتیبانی از مرورگرهایی دارید که واردات دینامیک بومی را پشتیبانی نمی‌کنند، احتمالاً باید از آن در کتابخانه خود استفاده نکنید.

پلی‌فیل را می‌توان با استفاده از `{ polyfill: false }` غیرفعال کرد.

لیست چانک‌هایی که باید برای هر واردات دینامیک پیش‌بارگذاری شوند، توسط Vite محاسبه می‌شود. به‌طور پیش‌فرض، مسیری مطلق شامل `base` هنگام بارگذاری این وابستگی‌ها استفاده می‌شود. اگر `base` نسبی باشد (`''` یا `'./'`)، در زمان اجرا از `import.meta.url` برای جلوگیری از مسیرهای مطلق که وابسته به base نهایی هستند، استفاده می‌شود.

پشتیبانی تجربی برای کنترل دقیق‌تر لیست وابستگی‌ها و مسیرهای آنها با استفاده از تابع `resolveDependencies` وجود دارد. [بازخورد دهید](https://github.com/vitejs/vite/discussions/13841). این تابع یک تابع از نوع `ResolveModulePreloadDependenciesFn` است:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

تابع `resolveDependencies` برای هر واردات دینامیک با لیستی از چانک‌هایی که به آن وابسته هستند فراخوانی می‌شود و همچنین برای هر چانک وارد شده در فایل‌های HTML ورودی نیز فراخوانی می‌شود. می‌توان یک آرایه جدید از وابستگی‌ها بازگرداند که این وابستگی‌ها فیلتر یا بیشتر وارد شده‌اند و مسیرهای آنها تغییر کرده‌اند. مسیرهای `deps` نسبت به `build.outDir` نسبی هستند. مقدار بازگشتی باید مسیری نسبی به `build.outDir` باشد.

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

مسیرهای وابستگی حل‌شده را می‌توان با استفاده از [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options) بیشتر تغییر داد.

## build.polyfillModulePreload

- **نوع:** `boolean`
- **پیش‌فرض:** `true`
- **قدیمی** به جای آن از `build.modulePreload.polyfill` استفاده کنید

آیا پلی‌فیل [پیش‌بارگذاری ماژول](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) به‌طور خودکار تزریق شود.

## build.outDir

- **نوع:** `string`
- **پیش‌فرض:** `dist`

دایرکتوری خروجی را مشخص کنید (نسبت به [ریشه پروژه](/guide/#index-html-and-project-root)).

## build.assetsDir

- **نوع:** `string`
- **پیش‌فرض:** `assets`

دایرکتوری را برای قرار دادن دارایی‌های تولیدشده (نسبت به `build.outDir`) مشخص کنید. این در [مد حالت کتابخانه](/guide/build#library-mode) استفاده نمی‌شود.

## build.assetsInlineLimit

- **نوع:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **پیش‌فرض:** `4096` (4 KiB)

دارایی‌هایی که وارد یا ارجاع داده می‌شوند و اندازه آنها کمتر از این آستانه است، به‌صورت URL های base64 درون خطی خواهند شد تا درخواست‌های اضافی HTTP جلوگیری شود. برای غیرفعال کردن این ویژگی، مقدار آن را به `0` تنظیم کنید.

اگر یک تابع بازگشتی داده شود، یک مقدار بولی می‌تواند برای انتخاب یا لغو انتخاب برگردانده شود. اگر چیزی بازگشتی داده نشود، منطق پیش‌فرض اعمال می‌شود.

محل‌های Git LFS به‌طور خودکار از درون‌خطی شدن خارج می‌شوند زیرا محتویات فایلی که نشان می‌دهند را ندارند.

::: نکته
اگر `build.lib` را مشخص کنید، `build.assetsInlineLimit` نادیده گرفته می‌شود و دارایی‌ها همیشه درون‌خطی خواهند شد، صرف‌نظر از اندازه فایل یا اینکه یک جایگزین Git LFS باشند.
:::

## build.cssCodeSplit

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

فعال‌سازی/غیرفعال‌سازی تقسیم‌بندی کد CSS. زمانی که فعال باشد، CSS وارد شده در چانک‌های JS ناهمگام به‌عنوان چانک‌ها نگهداری می‌شود و همزمان با چانک بارگذاری خواهد شد.

اگر غیرفعال شود، تمام CSS در پروژه به یک فایل CSS واحد استخراج می‌شود.

::: نکته
اگر `build.lib` را مشخص کنید، `build.cssCodeSplit` به‌طور پیش‌فرض `false` خواهد بود.
:::

## build.cssTarget

- **نوع:** `string | string[]`
- **پیش‌فرض:** همانند [`build.target`](#build-target)

این گزینه به کاربران اجازه می‌دهد تا هدف مرورگر متفاوتی برای فشرده‌سازی CSS نسبت به آنچه برای تبدیل جاوااسکریپت استفاده می‌شود، تنظیم کنند.

این گزینه فقط زمانی باید استفاده شود که شما مرورگر غیرمعمولی را هدف قرار داده باشید. یکی از مثال‌ها، WebView مرورگر WeChat در اندروید است که اکثر ویژگی‌های مدرن جاوااسکریپت را پشتیبانی می‌کند اما پشتیبانی از [نوتیشن رنگی هگزادسیمال #RGBA در CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors) ندارد. در این حالت، باید `build.cssTarget` را به `chrome61` تنظیم کنید تا از تبدیل رنگ‌های `rgba()` به نوتیشن هگزادسیمال `#RGBA` جلوگیری کنید.

## build.cssMinify

- **نوع:** `boolean | 'esbuild' | 'lightningcss'`
- **پیش‌فرض:** همانند [`build.minify`](#build-minify) برای کلاینت، `'esbuild'` برای SSR

این گزینه به کاربران اجازه می‌دهد تا فشرده‌سازی CSS را به‌طور خاص پیکربندی کنند، به‌جای اینکه به‌طور پیش‌فرض از `build.minify` استفاده کنند. Vite به‌طور پیش‌فرض از `esbuild` برای فشرده‌سازی CSS استفاده می‌کند. برای استفاده از [Lightning CSS](https://lightningcss.dev/minification.html) به‌جای آن، گزینه را به `'lightningcss'` تنظیم کنید. اگر این انتخاب شود، می‌توان آن را با استفاده از [`css.lightningcss`](./shared-options.md#css-lightningcss) پیکربندی کرد.

## build.sourcemap

- **نوع:** `boolean | 'inline' | 'hidden'`
- **پیش‌فرض:** `false`

نقشه‌های منبع برای تولید را ایجاد کنید. اگر `true` باشد، یک فایل نقشه منبع جداگانه ایجاد خواهد شد. اگر `'inline'` باشد، نقشه منبع به‌عنوان URI داده‌ای به فایل خروجی اضافه می‌شود. `'hidden'` مشابه `true` است، با این تفاوت که نظرات نقشه منبع مربوطه در فایل‌های بسته‌بندی‌شده مخفی می‌شود.

## build.rollupOptions

- **نوع:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

پیکربندی مستقیم برای بسته‌بندی Rollup زیربنایی. این مشابه گزینه‌هایی است که می‌توان از فایل پیکربندی Rollup صادر کرد و با گزینه‌های داخلی Vite ترکیب خواهد شد. برای جزئیات بیشتر به [مستندات Rollup](https://rollupjs.org/configuration-options/) مراجعه کنید.

## build.commonjsOptions

- **نوع:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

گزینه‌هایی که به [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) ارسال می‌شوند.

## build.dynamicImportVarsOptions

- **نوع:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **مرتبط:** [واردات دینامیک](/guide/features#dynamic-import)

گزینه‌هایی که به [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) ارسال می‌شوند.

## build.lib

- **نوع:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **مرتبط:** [مد حالت کتابخانه](/guide/build#library-mode)

ساخت به‌عنوان یک کتابخانه. `entry` ضروری است زیرا کتابخانه نمی‌تواند از HTML به‌عنوان ورودی استفاده کند. `name` متغیر سراسری نمایان است و زمانی که `formats` شامل `'umd'` یا `'iife'` باشد، ضروری است. مقادیر پیش‌فرض `formats` عبارتند از `['es', 'umd']` یا `['es', 'cjs']` اگر چندین ورودی استفاده شود.

`fileName` نام فایل خروجی بسته است که به‌طور پیش‌فرض `"name"` در `package.json` است. همچنین می‌توان آن را به‌عنوان یک تابع تعریف کرد که `format` و `entryName` را به‌عنوان آرگومان می‌گیرد و نام فایل را برمی‌گرداند.

اگر بسته شما CSS وارد کند، می‌توان از `cssFileName` برای مشخص کردن نام فایل CSS خروجی استفاده کرد. این به‌طور پیش‌فرض به همان مقدار `fileName` تنظیم می‌شود اگر به‌عنوان یک رشته تنظیم شود، در غیر این صورت به `"name"` در `package.json` نیز بازمی‌گردد.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.manifest

- **نوع:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [ادغام با بک‌اند](/guide/backend-integration)

آیا فایل مانفیست تولید شود که شامل نگاشت نام فایل‌های دارایی غیر هشدارده به نسخه‌های هش‌شده آنها باشد که می‌توانند توسط فریمورک‌های سرور برای رندر کردن لینک‌های دارایی صحیح استفاده شوند.

وقتی مقدار آن رشته باشد، به‌عنوان مسیر فایل مانفیست نسبت به `build.outDir` استفاده خواهد شد. وقتی به `true` تنظیم شود، مسیر آن به‌صورت `.vite/manifest.json` خواهد بود.

## build.ssrManifest

- **نوع:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [رندرینگ سمت سرور](/guide/ssr)

آیا فایل مانفیست SSR برای تعیین لینک‌های استایل و دستورالعمل‌های پیش‌بارگذاری دارایی در تولید ایجاد شود.

وقتی مقدار آن رشته باشد، به‌عنوان مسیر فایل مانفیست نسبت به `build.outDir` استفاده خواهد شد. وقتی به `true` تنظیم شود، مسیر آن به‌صورت `.vite/ssr-manifest.json` خواهد بود.

## build.ssr

- **نوع:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [رندرینگ سمت سرور](/guide/ssr)

ساخت مخصوص SSR را تولید کنید. مقدار آن می‌تواند یک رشته برای مشخص کردن ورودی SSR باشد، یا `true` که نیاز به مشخص کردن ورودی SSR از طریق `rollupOptions.input` دارد.

## build.emitAssets

- **نوع:** `boolean`
- **پیش‌فرض:** `false`

در ساخت‌های غیر مشتری، دارایی‌های ایستا تولید نمی‌شوند زیرا فرض بر این است که آنها به‌عنوان بخشی از ساخت مشتری تولید می‌شوند. این گزینه به فریمورک‌ها این امکان را می‌دهد که آنها را در محیط‌های دیگر به‌صورت اجباری تولید کنند. مسئولیت ادغام دارایی‌ها با یک مرحله پردازش بعد از ساخت بر عهده فریمورک است.

## build.ssrEmitAssets

- **نوع:** `boolean`
- **پیش‌فرض:** `false`

در ساخت SSR، دارایی‌های ایستا تولید نمی‌شوند زیرا فرض بر این است که آنها به‌عنوان بخشی از ساخت مشتری تولید می‌شوند. این گزینه به فریمورک‌ها این امکان را می‌دهد که آنها را هم در ساخت مشتری و هم در ساخت SSR به‌صورت اجباری تولید کنند. مسئولیت ادغام دارایی‌ها با یک مرحله پردازش بعد از ساخت بر عهده فریمورک است. این گزینه پس از پایدار شدن API محیط، با `build.emitAssets` جایگزین خواهد شد.

## build.minify

- **نوع:** `boolean | 'terser' | 'esbuild'`
- **پیش‌فرض:** `'esbuild'` برای ساخت مشتری، `false` برای ساخت SSR

برای غیرفعال کردن فشرده‌سازی، مقدار آن را به `false` تنظیم کنید یا فشرده‌ساز مورد نظر را مشخص کنید. مقدار پیش‌فرض [esbuild](https://github.com/evanw/esbuild) است که 20 ~ 40 برابر سریع‌تر از terser است و فقط 1 ~ 2 درصد فشرده‌سازی بدتری دارد. [معیارها](https://github.com/privatenumber/minification-benchmarks)

توجه کنید که گزینه `build.minify` فشرده‌سازی فضای خالی را زمانی که از فرمت `'es'` در حالت کتابخانه استفاده می‌کنید، انجام نمی‌دهد زیرا آنرا از نشانه‌گذاری‌های خالص حذف می‌کند و باعث شکست در درخت‌شکن می‌شود.

برای استفاده از `'terser'` باید آن را نصب کنید:

```sh
npm add -D terser
```

## build.terserOptions

- **نوع:** `TerserOptions`

گزینه‌های اضافی [minify options](https://terser.org/docs/api-reference#minify-options) برای ارسال به Terser.

علاوه بر این، می‌توانید گزینه `maxWorkers: number` را برای مشخص کردن حداکثر تعداد کارگران ایجاد‌شده ارسال کنید. به‌طور پیش‌فرض تعداد آن برابر با تعداد پردازنده‌ها منهای 1 است.

## build.write

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

برای غیرفعال کردن نوشتن بسته به دیسک، آن را به `false` تنظیم کنید. این عمدتاً در [فراخوانی‌های برنامه‌نویسی `build()`](/guide/api-javascript#build) استفاده می‌شود که نیاز به پردازش بعدی بسته قبل از نوشتن به دیسک دارند.

## build.emptyOutDir

- **نوع:** `boolean`
- **پیش‌فرض:** `true` اگر `outDir` داخل `root` باشد

به‌طور پیش‌فرض، Vite دایرکتوری `outDir` را هنگام ساخت خالی می‌کند اگر داخل ریشه پروژه باشد. اگر `outDir` خارج از ریشه باشد، هشداری صادر می‌شود تا از حذف تصادفی فایل‌های مهم جلوگیری شود. می‌توانید این گزینه را به‌طور صریح تنظیم کنید تا هشدار را غیرفعال کنید. این گزینه همچنین از طریق خط فرمان به‌عنوان `--emptyOutDir` در دسترس است.

## build.copyPublicDir

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

به‌طور پیش‌فرض، Vite فایل‌ها را از `publicDir` به `outDir` هنگام ساخت کپی می‌کند. برای غیرفعال کردن این ویژگی، آن را به `false` تنظیم کنید.

## build.reportCompressedSize

- **نوع:** `boolean`
- **پیش‌فرض:** `true`

فعال‌سازی/غیرفعال‌سازی گزارش اندازه فشرده‌شده gzip. فشرده‌سازی فایل‌های خروجی بزرگ ممکن است کند باشد، بنابراین غیرفعال کردن این گزینه می‌تواند عملکرد ساخت را برای پروژه‌های بزرگ افزایش دهد.

## build.chunkSizeWarningLimit

- **نوع:** `number`
- **پیش‌فرض:** `500`

محدودیت برای هشدارهای اندازه چانک (بر حسب کیلوبایت). این مقدار با اندازه چانک غیرفشرده مقایسه می‌شود زیرا [اندازه جاوااسکریپت خود به زمان اجرا مرتبط است](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **نوع:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **پیش‌فرض:** `null`

برای فعال کردن نظارت rollup، آن را به `{}` تنظیم کنید. این عمدتاً در مواردی استفاده می‌شود که شامل افزونه‌ها یا فرایندهای ادغام فقط ساخت است.

::: warning استفاده از Vite در Windows Subsystem for Linux (WSL) 2

مواردی وجود دارد که نظارت بر سیستم فایل در WSL2 کار نمی‌کند.
برای جزئیات بیشتر به [`server.watch`](./server-options.md#server-watch) مراجعه کنید.

:::
