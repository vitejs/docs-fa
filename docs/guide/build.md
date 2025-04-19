# ساخت برای محیط تولید

هنگامی که زمان استقرار اپلیکیشن برای محیط تولید فرا می‌رسد، کافی است دستور `vite build` را اجرا کنید. به طور پیش‌فرض، این دستور از فایل `root>/index.html>` به عنوان نقطه ورود ساخت استفاده می‌کند و یک بسته اپلیکیشن تولید می‌کند که برای میزبانی روی سرویس‌های میزبانی استاتیک مناسب است. برای راهنمایی درباره سرویس‌های محبوب، بخش [استقرار سایت استاتیک](./static-deploy) را بررسی کنید.

## سازگاری با مرورگرها

به طور پیش‌فرض، بسته تولیدشده برای پشتیبانی از جاوااسکریپت مدرن تنظیم شده است، از جمله [ماژول‌های ES بومی](https://caniuse.com/es6-module)، [ایمپورت پویای ESM بومی](https://caniuse.com/es6-module-dynamic-import)، [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)، [ادغام تهی](https://caniuse.com/mdn-javascript_operators_nullish_coalescing) و [BigInt](https://caniuse.com/bigint). محدوده پشتیبانی پیش‌فرض مرورگرها به شرح زیر است:

<!-- برای اطلاعات بیشتر، ثابت `ESBUILD_MODULES_TARGET` را جستجو کنید -->

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

می‌توانید هدف‌های سفارشی را از طریق [گزینه تنظیمات `build.target`](/config/build-options.md#build-target) مشخص کنید، که پایین‌ترین هدف `es2015` است. اگر هدف پایین‌تری تنظیم شود، Vite همچنان به حداقل محدوده پشتیبانی مرورگرها نیاز دارد، زیرا به [ایمپورت پویای ESM بومی](https://caniuse.com/es6-module-dynamic-import) و [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) وابسته است:

<!-- برای اطلاعات بیشتر، ثابت `defaultEsbuildSupported` را جستجو کنید -->

- Chrome >=64
- Firefox >=67
- Safari >=11.1
- Edge >=79

توجه داشته باشید که به‌صورت پیش‌فرض، Vite تنها وظیفه‌ی تبدیل سینتکس (syntax transforms) را بر عهده دارد و **شامل پلی‌فیل‌ها (polyfills) نمی‌شود**. می‌توانید از وب‌سایت [https://cdnjs.cloudflare.com/polyfill/](https://cdnjs.cloudflare.com/polyfill/) استفاده کنید که بر اساس رشته‌ی UserAgent مرورگر کاربر، به‌صورت خودکار بسته‌ی مناسب پلی‌فیل را تولید می‌کند.

مرورگرهای قدیمی‌تر می‌توانند از طریق پلاگین [vitejs/plugin-legacy@](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) پشتیبانی شوند، که به طور خودکار چانک‌های قدیمی و پلی‌فیل‌های مربوط به ویژگی‌های زبان ES را تولید می‌کند. چانک‌های قدیمی تنها در مرورگرهایی که از ESM بومی پشتیبانی نمی‌کنند، به صورت شرطی بارگذاری می‌شوند.

## مسیر پایه عمومی {#public-base-path}

- مرتبط: [مدیریت asset ها](./assets)

اگر پروژه خود را در یک مسیر عمومی تودرتو مستقر می‌کنید، کافی است [گزینه تنظیمات `base`](/config/shared-options.md#base) را مشخص کنید تا همه مسیرهای asset ها به طور متناسب بازنویسی شوند. این گزینه همچنین می‌تواند به عنوان پرچم خط فرمان مشخص شود، مثلاً `/vite build --base=/my/public/path` .

آدرس asset های ایمپورت‌شده در جاوااسکریپت، ارجاعات `()url` در CSS و ارجاعات asset در فایل‌های `html.` به طور خودکار برای رعایت این گزینه در طول ساخت تنظیم می‌شوند.

استثنا زمانی است که نیاز دارید آدرس‌ها را به صورت پویا در لحظه ترکیب کنید. در این مورد، می‌توانید از متغیر سراسری تزریق‌شده `import.meta.env.BASE_URL` استفاده کنید که همان مسیر پایه عمومی خواهد بود. توجه داشته باشید که این متغیر در طول ساخت به صورت استاتیک جایگزین می‌شود، بنابراین باید دقیقاً به همان شکل استفاده شود (یعنی `import.meta.env['BASE_URL']` کار نخواهد کرد).

برای کنترل پیشرفته مسیر پایه، [گزینه‌های پیشرفته پایه](#advanced-base-options) را بررسی کنید.

### مسیر پایه نسبی

اگر مسیر پایه را از قبل نمی‌دانید، می‌توانید یک مسیر پایه نسبی با `‎"base": "./"‎` یا `‎"base": ""‎` تنظیم کنید. این کار باعث می‌شود همه آدرس‌های تولیدشده نسبت به هر فایل نسبی باشند.

:::warning پشتیبانی از مرورگرهای قدیمی‌تر هنگام استفاده از مسیرهای پایه نسبی

پشتیبانی از `import.meta` برای مسیرهای پایه نسبی مورد نیاز است. اگر نیاز به پشتیبانی از [مرورگرهایی دارید که از `import.meta` پشتیبانی نمی‌کنند](https://caniuse.com/mdn-javascript_operators_import_meta)، می‌توانید از [پلاگین `legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) استفاده کنید.

:::

## سفارشی‌سازی ساخت

ساخت را می‌توان از طریق [گزینه‌های تنظیمات ساخت](/config/build-options.md) سفارشی کرد. به طور خاص، می‌توانید [گزینه‌های Rollup](https://rollupjs.org/configuration-options/) را مستقیماً از طریق `build.rollupOptions` تنظیم کنید:

```js [vite.config.js]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

برای مثال، می‌توانید چند نسخه خروجی مختلف برای Rollup مشخص کنید و از پلاگین‌هایی استفاده نمایید که فقط هنگام ساخت (build) پروژه اعمال می‌شوند.

## استراتژی تقسیم چانک‌ها

می‌توانید نحوه تقسیم چانک‌ها را با استفاده از `build.rollupOptions.output.manualChunks` (به [مستندات Rollup](https://rollupjs.org/configuration-options/#output-manualchunks) مراجعه کنید) پیکربندی کنید. اگر از یک فریم‌ورک استفاده می‌کنید، به مستندات آن‌ها برای تنظیم نحوه تقسیم چانک‌ها مراجعه کنید.

## مدیریت خطای بارگذاری

Vite در صورت شکست بارگذاری ایمپورت‌های پویا، رویداد `vite:preloadError` را منتشر می‌کند. `event.payload` شامل خطای ایمپورت اصلی است. اگر `event.preventDefault()‎` را فراخوانی کنید، خطا صادر نخواهد شد.

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // برای مثال، تازه‌سازی صفحه
})
```

هنگامی که یک استقرار جدید رخ می‌دهد، سرویس میزبانی ممکن است asset های استقرارهای قبلی را حذف کند. در نتیجه، کاربری که پیش از استقرار جدید از سایت شما بازدید کرده است، ممکن است با خطای ایمپورت مواجه شود. این خطا به این دلیل رخ می‌دهد که asset های در حال اجرا روی دستگاه آن کاربر قدیمی هستند و تلاش می‌کند چانک قدیمی مربوطه را که حذف شده است، وارد کند. این رویداد برای رسیدگی به این موقعیت مفید است.

## بازسازی هنگام تغییر فایل‌ها

می‌توانید ناظر Rollup را با `vite build --watch` فعال کنید. یا می‌توانید [گزینه‌های ناظر](https://rollupjs.org/configuration-options/#watch) را مستقیماً از طریق `build.watch` تنظیم کنید:

```js [vite.config.js]
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    },
  },
})
```

با فعال بودن پرچم `‎--watch`، تغییرات در `vite.config.js` و همچنین هر فایل دیگری که باید بسته‌بندی شود، باعث بازسازی می‌شود.

## اپلیکیشن چندصفحه‌ای

فرض کنید ساختار کد منبع شما به صورت زیر است:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

در طول توسعه، کافی است به `/nested/` بروید یا به آن لینک دهید - همان‌طور که انتظار می‌رود، مانند یک سرور فایل استاتیک معمولی کار می‌کند.

در طول ساخت، تنها کاری که باید انجام دهید این است که چندین فایل `html.` را به عنوان نقاط ورود مشخص کنید:

```js twoslash [vite.config.js]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

اگر ریشه متفاوتی مشخص کنید، به یاد داشته باشید که `dirname__` همچنان پوشه فایل `vite.config.js` شما خواهد بود هنگام رفع مسیرهای ورودی. بنابراین، باید ورودی `root` خود را به آرگومان‌های `resolve` اضافه کنید.

توجه داشته باشید که برای فایل‌های HTML، نام داده‌شده به ورودی در آبجکت `rollupOptions.input` نادیده گرفته می‌شود و در عوض، شناسه رفع‌شده فایل را هنگام تولید asset HTML در پوشه dist رعایت می‌کند. این امر ساختار ثابتی با نحوه عملکرد سرور توسعه تضمین می‌کند.

## حالت کتابخانه

هنگامی که یک کتابخانه متمرکز بر مرورگر توسعه می‌دهید، احتمالاً بیشتر زمان خود را صرف یک صفحه آزمایشی/دمو می‌کنید که کتابخانه واقعی شما را ایمپورت می‌کند. با Vite، می‌توانید از `index.html` خود برای این منظور استفاده کنید تا تجربه توسعه روان داشته باشید.

هنگامی که زمان بسته‌بندی کتابخانه برای توزیع فرا می‌رسد، از [گزینه تنظیمات `build.lib`](/config/build-options.md#build-lib) استفاده کنید. مطمئن شوید که هر وابستگی‌ای که نمی‌خواهید در کتابخانه شما بسته‌بندی شود، مانند `vue` یا `react`، خارجی‌سازی کنید:

::: code-group

```js twoslash [vite.config.js (ورودی تک)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // پسوندهای مناسب اضافه خواهند شد
      fileName: 'my-lib',
    },
    rollupOptions: {
      // اطمینان حاصل کنید وابستگی‌هایی که نباید در کتابخانه بسته‌بندی شوند، خارجی‌سازی شوند

      external: ['vue'],
      output: {
        //  برای وابستگی‌های خارجی‌شده فراهم کنید UMD متغیرهای سراسری برای استفاده در ساخت

        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

```js twoslash [vite.config.js (ورودی‌های چندگانه)]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rollupOptions: {
      // اطمینان حاصل کنید وابستگی‌هایی که نباید در کتابخانه بسته‌بندی شوند، خارجی‌سازی شوند

      external: ['vue'],
      output: {
        // برای وابستگی‌های خارجی‌شده فراهم کنید UMD متغیرهای سراسری برای استفاده در ساخت

        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

:::

فایل ورودی شامل اکسپورت‌هایی خواهد بود که کاربران بسته شما می‌توانند ایمپورت کنند:

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

اجرای `vite build` با این پیکربندی از یک پیش‌تنظیم Rollup استفاده می‌کند که برای انتشار کتابخانه‌ها مناسب است و دو فرمت بسته تولید می‌کند:

- `es` و `umd` (برای ورودی تک)
- `es` و `cjs` (برای ورودی‌های چندگانه)

فرمت‌ها را می‌توان با [گزینه `build.lib.formats`](/config/build-options.md#build-lib) پیکربندی کرد.

```
$ vite build
...ساخت برای تولید
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

`package.json` پیشنهادی برای کتابخانه شما:

::: code-group

```json [package.json (ورودی تک)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

```json [package.json (ورودی‌های چندگانه)]
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::

### پشتیبانی از CSS

اگر کتابخانه شما CSS ایمپورت کند، این CSS به عنوان یک فایل CSS واحد در کنار فایل‌های JS ساخته‌شده بسته‌بندی می‌شود، مثلاً `dist/my-lib.css`. نام به طور پیش‌فرض به `build.lib.fileName` وابسته است، اما می‌توان آن را با [گزینه `build.lib.cssFileName`](/config/build-options.md#build-lib) تغییر داد.

می‌توانید فایل CSS را در `package.json` خود اکسپورت کنید تا کاربران بتوانند آن را وارد کنند:

```json {12}
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    },
    "./style.css": "./dist/my-lib.css"
  }
}
```

::: tip پسوندهای فایل
اگر `package.json` شامل `"type": "module"` نباشد، Vite برای سازگاری با Node.js پسوندهای متفاوتی تولید می‌کند. `js.` به `mjs.` و `cjs.` به `js.` تبدیل می‌شود.
:::

::: tip متغیرهای محیطی
در حالت کتابخانه، تمام استفاده‌های [`*.import.meta.env`](./env-and-mode.md) در زمان ساخت برای تولید به صورت استاتیک جایگزین می‌شوند. با این حال، استفاده‌های `*.process.env` جایگزین نمی‌شوند تا مصرف‌کنندگان کتابخانه شما بتوانند آن‌ها را به صورت پویا تغییر دهند. اگر این رفتار مطلوب نیست، می‌توانید به عنوان مثال از `define: { 'process.env.NODE_ENV': '"production"' }‎` برای جایگزینی استاتیک آن‌ها استفاده کنید یا از [`esm-env`](https://github.com/benmccann/esm-env) برای سازگاری بهتر با باندلرها و ران‌تایم‌ها استفاده کنید.
:::

::: warning استفاده پیشرفته
حالت کتابخانه شامل پیکربندی ساده و نظرشده‌ای برای کتابخانه‌های متمرکز بر مرورگر و فریم‌ورک‌های جاوااسکریپت است. اگر کتابخانه‌های غیرمرورگری می‌سازید یا به جریان‌های ساخت پیشرفته نیاز دارید، می‌توانید مستقیماً از [Rollup](https://rollupjs.org) یا [esbuild](https://esbuild.github.io) استفاده کنید.
:::

## گزینه‌های پیشرفته پایه {#advanced-base-options}

::: warning هشدار
این ویژگی آزمایشی است. [بازخورد دهید](https://github.com/vitejs/vite/discussions/13834).
:::

برای موارد استفاده پیشرفته، asset های مستقرشده و فایل‌های عمومی ممکن است در مسیرهای مختلفی قرار گیرند، برای مثال برای استفاده از استراتژی‌های کش متفاوت.
کاربر ممکن است بخواهد در سه مسیر مختلف مستقر کند:

- فایل‌های HTML ورودی تولیدشده (که ممکن است در طول SSR پردازش شوند)
- asset های هش‌شده تولیدشده (JS ، CSS و انواع فایل‌های دیگر مانند تصاویر)
- فایل‌های [عمومی](assets.md#the-public-directory) کپی‌شده

یک [پایه](#public-base-path) استاتیک واحد در این سناریوها کافی نیست. Vite پشتیبانی آزمایشی برای گزینه‌های پیشرفته پایه در طول ساخت ارائه می‌دهد، با استفاده از `experimental.renderBuiltUrl`.

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

اگر asset های هش‌شده و فایل‌های عمومی با هم مستقر نشوند، گزینه‌ها برای هر گروه می‌توانند به طور مستقل با استفاده از `type` asset که در پارامتر دوم `context` به تابع داده شده است، تعریف شوند.

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return {
        runtime: `window.__assetsPath(${JSON.stringify(filename)})`
      }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

توجه داشته باشید که `filename` ارسالی یک URL رمزگشایی‌شده است، و اگر تابع یک رشته URL بازگرداند، باید آن هم رمزگشایی‌شده باشد. Vite هنگام رندر کردن URLها به طور خودکار رمزگذاری را مدیریت می‌کند. اگر یک آبجکت با `runtime` بازگردانده شود، رمزگذاری باید در صورت نیاز توسط خودتان مدیریت شود، زیرا کد ران‌تایم همان‌طور که هست رندر خواهد شد.
