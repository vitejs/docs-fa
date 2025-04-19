# گزینه‌های بیلد

مگر اینکه ذکر شده باشه، گزینه‌های این بخش فقط موقع بیلد اعمال می‌شن.

## build.target

- **تایپ:** `[]string | string`
- **پیش‌فرض:** `'modules'`
- **مرتبط:** [سازگاری با مرورگر](/guide/build#browser-compatibility)

هدف سازگاری مرورگر برای باندل نهایی. مقدار پیش‌فرض یه مقدار خاص Vite هست، `'modules'`، که مرورگرهایی رو هدف می‌گیره که از [ماژول‌های ES بومی](https://caniuse.com/es6-module)، [ایمپورت داینامیک ESM بومی](https://caniuse.com/es6-module-dynamic-import) و [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) پشتیبانی می‌کنن. Vite مقدار `'modules'` رو به `‎[‎'es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'‎]` تبدیل می‌کنه.

یه مقدار خاص دیگه `'esnext'` هست که فرض می‌کنه پشتیبانی از ایمپورت داینامیک بومی وجود داره و فقط حداقل ترنسپایل رو انجام می‌ده.

ترنسفورم با esbuild انجام می‌شه و مقدار باید یه [گزینه هدف esbuild](https://esbuild.github.io/api/#target) معتبر باشه. هدف‌های سفارشی می‌تونن یه نسخه ES (مثل `es2015`)، یه مرورگر با نسخه (مثل `chrome58`) یا آرایه‌ای از چند رشته هدف باشن.

اگه کد شامل ویژگی‌هایی باشه که esbuild نتونه به‌خوبی ترنسپایلشون کنه، بیلد خطا می‌ده. برای جزئیات بیشتر به [مستندات esbuild](https://esbuild.github.io/content-types/#javascript) نگاه کنین.

## build.modulePreload

- **تایپ:** <br>`boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **پیش‌فرض:** `{ polyfill: true }`

به‌صورت پیش‌فرض، یه [پلی‌فیل module preload](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) به‌صورت خودکار تزریق می‌شه. این پلی‌فیل توی ماژول پراکسی هر ورودی `index.html` تزریق می‌شه. اگه بیلد برای استفاده از یه ورودی سفارشی غیر HTML با `build.rollupOptions.input` تنظیم شده باشه، باید پلی‌فیل رو دستی تو ورودی سفارشی ایمپورت کنین:

```js
import 'vite/modulepreload-polyfill'
```

توجه: این پلی‌فیل تو [حالت کتابخانه](/guide/build#library-mode) اعمال نمی‌شه. اگه نیاز دارین مرورگرهایی رو پشتیبانی کنین که ایمپورت داینامیک بومی ندارن، بهتره ازش تو کتابخونتون استفاده نکنین.

با `{ polyfill: false }` می‌تونین پلی‌فیل رو غیرفعال کنین.

لیست چانک‌هایی که باید برای هر ایمپورت داینامیک پیش‌بارگذاری بشن توسط Vite محاسبه می‌شه. به‌صورت پیش‌فرض، یه مسیر مطلق شامل `base` برای بارگذاری این وابستگی‌ها استفاده می‌شه. اگه `base` نسبی باشه (`''` یا `'./‎'`)، از `import.meta.url` تو زمان اجرا استفاده می‌شه تا از مسیرهای مطلقی که به `base` نهایی وابسته‌ان جلوگیری بشه.

پشتیبانی آزمایشی برای کنترل دقیق‌تر لیست وابستگی‌ها و مسیرهاشون با تابع `resolveDependencies` وجود داره. [نظرتون رو بدین](https://github.com/vitejs/vite/discussions/13841). این تابع باید از نوع `ResolveModulePreloadDependenciesFn` باشه:

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

تابع `resolveDependencies` برای هر ایمپورت داینامیک با لیست چانک‌هایی که بهش وابسته‌ان فراخوانی می‌شه و همین‌طور برای هر چانک ایمپورت‌شده تو فایل‌های HTML ورودی. می‌تونین یه آرایه وابستگی جدید برگردونین که فیلتر شده یا وابستگی‌های بیشتری تزریق شده و مسیرهاشون تغییر کرده باشه. مسیرهای `deps` نسبت به `build.outDir` هستن. مقدار برگشتی باید یه مسیر نسبی به `build.outDir` باشه.

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

مسیرهای وابستگی رفع‌شده رو می‌تونین با [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options) بیشتر تغییر بدین.

## build.polyfillModulePreload

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`
- **منسوخ‌شده:** به جاش از `build.modulePreload.polyfill` استفاده کنین

آیا یه [پلی‌فیل module preload](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) به‌صورت خودکار تزریق بشه یا نه.

## build.outDir

- **تایپ:** `string`
- **پیش‌فرض:** `dist`

دایرکتوری خروجی رو مشخص می‌کنه (نسبت به [ریشه پروژه](/guide/#index-html-و-ریشه-root-پروژه)).

## build.assetsDir

- **تایپ:** `string`
- **پیش‌فرض:** `assets`

دایرکتوری‌ای که asset های تولیدشده توش قرار می‌گیرن رو مشخص می‌کنه (نسبت به `build.outDir`). تو [حالت کتابخانه](/guide/build#library-mode) استفاده نمی‌شه.

## build.assetsInlineLimit

- **تایپ:** `number | ((filePath: string, content: Buffer) => boolean | undefined)`
- **پیش‌فرض:** `4096` (4 کیلوبایت)

asset های ایمپورت‌شده یا ارجاع‌شده که از این حد کوچیک‌تر باشن، به‌صورت URLهای base64 اینلاین می‌شن تا درخواست‌های HTTP اضافی کم بشه. با `0` می‌تونین اینلاین کردن رو کامل غیرفعال کنین.

اگه یه callback بفرستین، می‌تونین یه مقدار بولین برگردونین تا اینلاین بشه یا نه. اگه چیزی برنگردونین، منطق پیش‌فرض اعمال می‌شه.

فایل‌های placeholder Git LFS به‌صورت خودکار از اینلاین شدن مستثنی هستن چون محتوای فایلی که نمایندگی می‌کنن رو ندارن.

::: tip نکته
اگه `build.lib` رو مشخص کنین، `build.assetsInlineLimit` نادیده گرفته می‌شه و دارایی‌ها همیشه اینلاین می‌شن، بدون توجه به اندازه فایل یا placeholder بودن Git LFS.
:::

## build.cssCodeSplit

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

تقسیم‌بندی کد CSS رو فعال یا غیرفعال می‌کنه. وقتی فعال باشه، CSS ایمپورت‌شده تو چانک‌های JS ناهمگام به‌صورت چانک نگه داشته می‌شه و وقتی چانک بارگذاری می‌شه، همراهش فچ می‌شه.

اگه غیرفعال باشه، همه CSS پروژه تو یه فایل CSS واحد استخراج می‌شه.

::: tip نکته
اگه `build.lib` رو مشخص کنین، `build.cssCodeSplit` به‌صورت پیش‌فرض `false` می‌شه.
:::

## build.cssTarget

- **تایپ:** `[]string | string`
- **پیش‌فرض:** همون [`build.target`](#build-target)

این گزینه به کاربرها اجازه می‌ده هدف مرورگر متفاوتی برای مینیفای CSS نسبت به ترنسپایل JS تنظیم کنن.

فقط وقتی باید استفاده بشه که یه مرورگر غیرمعمول رو هدف گرفتین. یه مثالش Android WeChat WebView هست که بیشتر ویژگی‌های مدرن JS رو پشتیبانی می‌کنه
ولی از [نوتاسیون رنگ هگزادسیمال #RGBA در CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors) نه.
تو این مورد، باید `build.cssTarget` رو به `chrome61` تنظیم کنین تا Vite رنگ‌های `rgba()‎` رو به نوتاسیون هگزادسیمال #RGBA تبدیل نکنه.

## build.cssMinify

- **تایپ:** `boolean | 'esbuild' | 'lightningcss'`
- **پیش‌فرض:** برای کلاینت همون [`build.minify`](#build-minify)، برای SSR `'esbuild'‎`

این گزینه به کاربرها اجازه می‌ده مینیفای CSS رو جدا از `build.minify` تنظیم کنن، تا بتونین مینیفای JS و CSS رو جداگانه پیکربندی کنین. Vite به‌صورت پیش‌فرض از `esbuild` برای مینیفای CSS استفاده می‌کنه. با تنظیمش به `'lightningcss'` می‌تونین از [Lightning CSS](https://lightningcss.dev/minification.html) استفاده کنین. اگه انتخابش کنین، با [`css.lightningcss`](./shared-options.md#css-lightningcss) قابل پیکربندی هست.

## build.sourcemap

- **تایپ:** `boolean | 'inline' | 'hidden'‎`
- **پیش‌فرض:** `false`

نقشه‌های منبع (sourcemap) رو برای تولید بسازین. اگه `true` باشه، یه فایل sourcemap جدا ساخته می‌شه. اگه `'inline'` باشه، sourcemap به‌عنوان یه data URI به فایل خروجی اضافه می‌شه. `'hidden'` مثل `true` کار می‌کنه ولی کامنت‌های sourcemap تو فایل‌های باندل‌شده حذف می‌شن.

## build.rollupOptions

- **تایپ:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

باندل Rollup زیرساختی رو مستقیم سفارشی کنین. این همون گزینه‌هایی هست که می‌تونین از یه فایل کانفیگ Rollup اکسپورت کنین و با گزینه‌های داخلی Rollup توی Vite ادغام می‌شه. برای جزئیات بیشتر به [مستندات گزینه‌های Rollup](https://rollupjs.org/configuration-options/) نگاه کنین.

## build.commonjsOptions

- **تایپ:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

گزینه‌هایی که به [‎@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) ارسال می‌شن.

## build.dynamicImportVarsOptions

- **تایپ:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **مرتبط:** [ایمپورت داینامیک](/guide/features#dynamic-import)

گزینه‌هایی که به [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) ارسال می‌شن.

## build.lib

- **تایپ:** `‎{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **مرتبط:** [حالت کتابخانه](/guide/build#library-mode)

به‌عنوان یه کتابخانه بیلد کنین. `entry` لازمه چون کتابخانه نمی‌تونه از HTML به‌عنوان ورودی استفاده کنه. `name` متغیر جهانی‌ای هست که افشا می‌شه و وقتی `formats` شامل `'umd'` یا `'iife'` باشه لازمه. فرمت‌های پیش‌فرض `['es', 'umd']` هستن، یا اگه چند ورودی استفاده بشه، `['es', 'cjs']`.

`fileName` اسم فایل خروجی بسته هست که به‌صورت پیش‌فرض از `"name"` توی `package.json` میاد. می‌تونه یه تابع باشه که `format` و `entryName` رو می‌گیره و اسم فایل رو برمی‌گردونه.

اگه بسته‌تون CSS ایمپورت می‌کنه، با `cssFileName` می‌تونین اسم فایل CSS خروجی رو مشخص کنین. اگه `fileName` یه رشته باشه، به همون مقدار پیش‌فرض می‌شه، وگرنه به `"name"` توی `package.json` برمی‌گرده.

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

- **تایپ:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [یکپارچه‌سازی بک‌اند](/guide/backend-integration)

آیا یه فایل manifest ساخته بشه که نگاشت اسم فایل‌های دارایی بدون هش به نسخه‌های هش‌شده‌شون رو داشته باشه، که بعدش یه فریم‌ورک سرور می‌تونه ازش برای رندر کردن لینک‌های درست دارایی‌ها استفاده کنه.

اگه مقدارش یه رشته باشه، به‌عنوان مسیر فایل manifest نسبت به `build.outDir` استفاده می‌شه. اگه `true` باشه، مسیرش `‎.vite/manifest.json` می‌شه.

## build.ssrManifest

- **تایپ:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [رندر سمت سرور](/guide/ssr)

آیا یه فایل manifest برای SSR ساخته بشه که برای مشخص کردن لینک‌های استایل و دایرکتیوهای پیش‌بارگذاری دارایی تو تولید استفاده می‌شه.

اگه مقدارش یه رشته باشه، به‌عنوان مسیر فایل manifest نسبت به `build.outDir` استفاده می‌شه. اگه `true` باشه، مسیرش `‎.vite/ssr-manifest.json` می‌شه.

## build.ssr

- **تایپ:** `boolean | string`
- **پیش‌فرض:** `false`
- **مرتبط:** [رندر سمت سرور](/guide/ssr)

بیلد متمرکز بر SSR تولید کنه. مقدار می‌تونه یه رشته باشه که مستقیم ورودی SSR رو مشخص کنه، یا `true` باشه که نیاز داره ورودی SSR از طریق `rollupOptions.input` مشخص بشه.

## build.emitAssets

- **تایپ:** `boolean`
- **پیش‌فرض:** `false`

تو بیلدهای غیر کلاینت، asset های استاتیک منتشر نمی‌شن چون فرض می‌شه که به‌عنوان بخشی از بیلد کلاینت منتشر می‌شن. این گزینه به فریم‌ورک‌ها اجازه می‌ده تو بیلد محیط‌های دیگه انتشارشون رو اجباری کنن. وظیفه فریم‌ورکه که دارایی‌ها رو با یه مرحله بعد از بیلد ادغام کنه.

## build.ssrEmitAssets

- **تایپ:** `boolean`
- **پیش‌فرض:** `false`

تو بیلد SSR، asset های استاتیک منتشر نمی‌شن چون فرض می‌شه که به‌عنوان بخشی از بیلد کلاینت منتشر می‌شن. این گزینه به فریم‌ورک‌ها اجازه می‌ده تو هر دو بیلد کلاینت و SSR انتشارشون رو اجباری کنن. وظیفه فریم‌ورکه که دارایی‌ها رو با یه مرحله بعد از بیلد ادغام کنه. این گزینه وقتی API محیط پایدار بشه با `build.emitAssets` جایگزین می‌شه.

## build.minify

- **تایپ:** `boolean | 'terser' | 'esbuild'‎`
- **پیش‌فرض:** `'esbuild'` برای بیلد کلاینت، `false` برای بیلد SSR

با `false` مینیفای کردن رو غیرفعال کنین، یا مینیفایری که می‌خواین استفاده بشه رو مشخص کنین. پیش‌فرض [esbuild](https://github.com/evanw/esbuild) هست که 20 تا 40 برابر سریع‌تر از terser هست و فشرده‌سازیش فقط 1 تا 2 درصد ضعیف‌تره. [مقایسه‌ها](https://github.com/privatenumber/minification-benchmarks)

توجه کنین که گزینه `build.minify` تو حالت کتابخانه با فرمت `'es'` فضای خالی رو مینیفای نمی‌کنه، چون حاشیه‌نویسی‌های خالص رو حذف می‌کنه و tree-shaking رو خراب می‌کنه.

اگه روی `'terser'` تنظیم بشه، باید terser نصب بشه:

```sh
npm add -D terser
```

## build.terserOptions

- **تایپ:** `TerserOptions`

گزینه‌های اضافی [مینیفای](https://terser.org/docs/api-reference#minify-options) که به terser ارسال می‌شن.

می‌تونین یه گزینه `maxWorkers: number` هم بفرستین تا حداکثر تعداد کارگرهایی که ساخته می‌شن رو مشخص کنین. پیش‌فرضش تعداد CPUها منهای 1 هست.

## build.write

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

با `false` نوشتن باندل روی دیسک رو غیرفعال کنین. بیشتر تو فراخوانی‌های برنامه‌ریزی‌شده [`build()‎`](/guide/api-javascript#build) استفاده می‌شه که نیاز به پردازش بیشتر باندل قبل از نوشتن روی دیسک دارن.

## build.emptyOutDir

- **تایپ:** `boolean`
- **پیش‌فرض:** `true` اگه `outDir` داخل `root` باشه

به‌صورت پیش‌فرض، اگه `outDir` داخل ریشه پروژه باشه، Vite موقع بیلد اون رو خالی می‌کنه. اگه `outDir` بیرون ریشه باشه، یه هشدار می‌ده تا از حذف تصادفی فایل‌های مهم جلوگیری کنه. می‌تونین این گزینه رو صریح تنظیم کنین تا هشدار رو غیرفعال کنین. از خط فرمان هم با `‎--emptyOutDir` در دسترسه.

## build.copyPublicDir

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

به‌صورت پیش‌فرض، Vite موقع بیلد فایل‌ها رو از `publicDir` به `outDir` کپی می‌کنه. با `false` این کار رو غیرفعال کنین.

## build.reportCompressedSize

- **تایپ:** `boolean`
- **پیش‌فرض:** `true`

گزارش اندازه فشرده‌شده با gzip رو فعال یا غیرفعال کنین. فشرده‌سازی فایل‌های خروجی بزرگ می‌تونه کند باشه، پس غیرفعال کردنش ممکنه عملکرد بیلد رو برای پروژه‌های بزرگ بهتر کنه.

## build.chunkSizeWarningLimit

- **تایپ:** `number`
- **پیش‌فرض:** `500`

حد هشدار برای اندازه چانک (به کیلوبایت). با اندازه چانک فشرده‌نشده مقایسه می‌شه چون [اندازه JS خودش به زمان اجرا ربط داره](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **تایپ:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **پیش‌فرض:** `null`

با `{}` ناظر rollup رو فعال کنین. بیشتر تو مواردی استفاده می‌شه که پلاگین‌ها یا فرآیندهای یکپارچه‌سازی فقط برای بیلد هستن.

::: warning استفاده از Vite تو WSL2

بعضی وقت‌ها پایش سیستم فایل تو WSL2 کار نمی‌کنه.
برای جزئیات بیشتر به [`server.watch`](./server-options.md#server-watch) نگاه کنین.

:::
