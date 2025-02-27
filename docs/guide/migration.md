# مهاجرت از v5

## API محیطی

به عنوان بخشی از [(Environment API) API محیطی](/guide/api-environment.md) جدید و آزمایشی، یک بازسازی داخلی بزرگ مورد نیاز بود. Vite 6 تلاش می‌کند تا از ایجاد تغییرات مخرب جلوگیری کند تا اکثر پروژه‌ها بتوانند به سرعت به نسخه جدید ارتقا یابند. ما منتظر خواهیم ماند تا بخش بزرگی از اکوسیستم به نسخه جدید مهاجرت کند تا APIهای جدید را تثبیت کرده و استفاده از آن‌ها را توصیه کنیم. ممکن است برخی موارد خاص وجود داشته باشد، اما این موارد تنها بر استفاده‌های سطح پایین توسط فریمورک‌ها و ابزارها تأثیر خواهند گذاشت. ما با نگهدارندگان اکوسیستم همکاری کرده‌ایم تا این تفاوت‌ها را قبل از انتشار کاهش دهیم. لطفاً در صورت مشاهده‌ی مشکل، یک [گزارش اشکال](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) ثبت کنید.

برخی APIهای داخلی به دلیل تغییرات در پیاده‌سازی Vite حذف شده‌اند. اگر به یکی از آن‌ها متکی بودید، لطفاً یک [درخواست ویژگی](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml) ایجاد کنید.

## API رانتایم Vite

API آزمایشی رانتایم Vite به API جدید "Module Runner" تکامل یافته است که در Vite 6 به عنوان بخشی از [(Environment API)API محیطی](/guide/api-environment) جدید منتشر شده است. از آنجا که این قابلیت در نسخه قبلی آزمایشی بود، حذف API قبلی که در Vite 5.1 معرفی شده بود، یک تغییر مخرب محسوب نمی‌شود، اما کاربران باید استفاده‌ی خود را به معادل جدید در "Module Runner" به‌روزرسانی کنند.

## تغییرات کلی

### مقدار پیش‌فرض `resolve.conditions`

این تغییر بر کاربرانی که گزینه‌های [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions) را پیکربندی نکرده‌اند تأثیری ندارد.

در Vite 5، مقدار پیش‌فرض `resolve.conditions` مقدار `[]` بود و برخی شرایط به‌صورت داخلی اضافه می‌شدند. مقدار پیش‌فرض `ssr.resolve.conditions` برابر با مقدار `resolve.conditions` بود.

در Vite 6، برخی از این شرایط دیگر به‌صورت داخلی اضافه نمی‌شوند
و باید در تنظیمات پیکربندی گنجانده شوند:

- `resolve.conditions` دیگر شامل `['module', 'browser', 'development|production']` نیست.
- `ssr.resolve.conditions` دیگر شامل `['module', 'node', 'development|production']` نیست.

مقادیر پیش‌فرض این گزینه‌ها به مقادیر مربوطه به‌روز شده و `ssr.resolve.conditions` دیگر از مقدار `resolve.conditions` به عنوان مقدار پیش‌فرض استفاده نمی‌کند. توجه داشته باشید که `development|production` یک متغیر خاص است که بسته به مقدار `process.env.NODE_ENV` به `production` یا `development` تبدیل می‌شود. این مقادیر پیش‌فرض از `vite` به عنوان `defaultClientConditions` و `defaultServerConditions` اکسپورت می‌شوند.

اگر مقدار سفارشی برای `resolve.conditions` یا `ssr.resolve.conditions` مشخص کرده‌اید، باید آن را به‌روزرسانی کنید تا شرایط جدید را نیز شامل شود.
به عنوان مثال، اگر قبلاً مقدار `['custom']` را برای `resolve.conditions` تعیین کرده بودید، اکنون باید مقدار `['custom', ...defaultClientConditions]` را مشخص کنید.

### JSON stringify

در Vite 5، زمانی که گزینه [`json.stringify: true`](/config/shared-options#json-stringify) تنظیم شده بود، [`json.namedExports`](/config/shared-options#json-namedexports) غیرفعال می‌شد.

در Vite 6، حتی اگر `json.stringify: true` تنظیم شده باشد، `json.namedExports` غیرفعال نمی‌شود و مقدار آن رعایت خواهد شد. اگر می‌خواهید رفتار قبلی را داشته باشید، می‌توانید `json.namedExports: false` را تنظیم کنید.

همچنین در Vite 6 مقدار پیش‌فرض جدیدی برای `json.stringify` معرفی شده که مقدار `'auto'` است و تنها فایل‌های JSON بزرگ را به‌صورت رشته‌ای ذخیره می‌کند. برای غیرفعال کردن این رفتار، مقدار `json.stringify: false` را تنظیم کنید.

### پشتیبانی گسترده‌تر از رفرنس دادن به asset ها در عناصر HTML

در Vite 5، تنها تعداد محدودی از عناصر HTML می‌توانستند به asset هایی که توسط Vite پردازش و بسته‌بندی می‌شوند ارجاع دهند، مانند `<link href>`، `<img src>` و غیره.

در Vite 6، این پشتیبانی به تعداد بیشتری از عناصر HTML گسترش یافته است. لیست کامل در مستندات [ویژگی‌های HTML](/guide/features.html#html) موجود است.

برای جلوگیری از پردازش HTML در برخی عناصر خاص، می‌توانید از ویژگی `vite-ignore` در آن عنصر استفاده کنید.

### postcss-load-config

بسته [`postcss-load-config`](https://npmjs.com/package/postcss-load-config) از نسخه 4 به نسخه 6 ارتقا یافته است. اکنون برای بارگذاری فایل‌های پیکربندی TypeScript، به [`tsx`](https://www.npmjs.com/package/tsx) یا [`jiti`](https://www.npmjs.com/package/jiti) نیاز است، به جای [`ts-node`](https://www.npmjs.com/package/ts-node). همچنین برای بارگذاری فایل‌های پیکربندی YAML، به [`yaml`](https://www.npmjs.com/package/yaml) نیاز است.

### استفاده پیش‌فرض از API مدرن در Sass

در Vite 5، به طور پیش‌فرض از API قدیمی برای Sass استفاده می‌شد. در Vite 5.4 پشتیبانی از API مدرن اضافه شد.

از Vite 6، به طور پیش‌فرض از API مدرن برای Sass استفاده می‌شود. اگر همچنان مایل به استفاده از API قدیمی هستید، می‌توانید [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions) را تنظیم کنید. اما توجه داشته باشید که پشتیبانی از API قدیمی در Vite 7 حذف خواهد شد.

برای مهاجرت به API مدرن، به [مستندات Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/) مراجعه کنید.

### سفارشی‌سازی نام فایل خروجی CSS در حالت کتابخانه‌ای

در Vite 5، نام فایل خروجی CSS در حالت کتابخانه‌ای همیشه `style.css` بود و نمی‌توان آن را از طریق پیکربندی Vite به راحتی تغییر داد.

در Vite 6، نام پیش‌فرض فایل اکنون از مقدار `"name"` در `package.json` مشابه فایل‌های خروجی JS استفاده می‌کند. اگر مقدار [`build.lib.fileName`](/config/build-options.md#build-lib) با یک رشته تنظیم شده باشد، مقدار آن نیز برای نام فایل خروجی CSS استفاده خواهد شد. برای تعیین نام خاصی برای فایل CSS، می‌توانید از [`build.lib.cssFileName`](/config/build-options.md#build-lib) استفاده کنید.

برای مهاجرت، اگر به نام `style.css` متکی بودید، باید ارجاعات خود را به نام جدید بر اساس نام بسته خود به‌روزرسانی کنید. به عنوان مثال:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

اگر ترجیح می‌دهید که همچنان از `style.css` مانند Vite 5 استفاده کنید، می‌توانید مقدار `build.lib.cssFileName: 'style'‎` را تنظیم کنید.

## تغییرات پیشرفته

تعدادی از تغییرات مهم دیگر وجود دارند که تنها بر تعداد کمی از کاربران تأثیر می‌گذارند:

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - پشتیبانی از ایمپورت پیش‌فرض فایل‌های CSS در Vite 4 منسوخ شد و در Vite 5 حذف شد، اما در حالت توسعه SSR همچنان به‌طور ناخواسته پشتیبانی می‌شد. این پشتیبانی اکنون به‌طور کامل حذف شده است.
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - مقدار پیش‌فرض [`build.cssMinify`](/config/build-options#build-cssminify) اکنون `'esbuild'` است، حتی برای بیلدهای SSR.
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - گزینه `server.proxy[path].bypass` اکنون برای درخواست‌های ارتقاء WebSocket نیز فراخوانی می‌شود و در این حالت، پارامتر `res` مقدار `undefined` خواهد داشت.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - حداقل نسخه‌ی `terser` برای [`build.minify: 'terser'`](/config/build-options#build-minify) از 5.4.0 به 5.16.0 ارتقا یافته است.
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - مقدار پیش‌فرض [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) اکنون `true` است (قبلاً `'auto'` بود).
    - این ممکن است منجر به افزایش حجم باندل شود، اما باعث ایجاد بیلدهای قطعی‌تری خواهد شد.
    - اگر یک فایل CommonJS را به عنوان نقطه ورودی مشخص می‌کنید، ممکن است به مراحل بیشتری نیاز داشته باشید. برای اطلاعات بیشتر، [مستندات پلاگین commonjs](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) را مطالعه کنید.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - دامنه‌های بازه‌ای (`{01..03}` ⇒ `['01', '02', '03']`) و دامنه‌های افزایشی (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) دیگر در globها پشتیبانی نمی‌شوند.
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - این PR نه تنها یک تغییر مخرب را معرفی می‌کند که در بالا به عنوان "مقدار پیش‌فرض برای `resolve.conditions`" ذکر شد، بلکه باعث می‌شود که `resolve.mainFields` برای وابستگی‌های no-externalized در SSR استفاده نشود. اگر از `resolve.mainFields` استفاده می‌کردید و می‌خواهید آن را برای وابستگی‌های no-externalized در SSR اعمال کنید، می‌توانید از [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields) استفاده کنید.
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - این بهینه‌سازی انتخابی به دلیل موارد حاشیه‌ای هنگام نوشتن یک فایل در یک پوشه کش شده و ایمپورت فوری آن حذف شد.
- ~~[[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~متغیرهای استفاده شده در درونیابی اکنون باید قبل از درونیابی اعلان شوند. برای جزئیات بیشتر، [changelog `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16) را ببینید.~~ این تغییر مخرب در نسخه v6.1.0 برگردانده شد.
  - [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - به‌روزرسانی‌های یک ماژول مخصوص SSR دیگر باعث بارگذاری مجدد کامل صفحه در کلاینت نمی‌شود. برای بازگرداندن رفتار قبلی، می‌توان از یک افزونه سفارشی Vite استفاده کرد:
    <details>
    <summary>برای مشاهده مثال کلیک کنید</summary>

    ```ts
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true,
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## مهاجرت از v4

ابتدا به [راهنمای مهاجرت از Vite 4](https://v5.vite.dev/guide/migration.html) مراجعه کنید تا تغییرات لازم برای مهاجرت به Vite 5 را بررسی کنید و سپس ادامه تغییرات این صفحه را دنبال کنید.
