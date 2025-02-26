<!-- # Migration from v5

## Environment API

As part of the new experimental [Environment API](/guide/api-environment.md), a big internal refactoring was needed. Vite 6 strives to avoid breaking changes to ensure most projects can quickly upgrade to the new major. We'll wait until a big portion of the ecosystem has moved to stabilize and start recommending the use of the new APIs. There may be some edge cases but these should only affect low level usage by frameworks and tools. We have worked with maintainers in the ecosystem to mitigate these differences before the release. Please [open an issue](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) if you spot a regression.

Some internal APIs have been removed due to changes in Vite's implementation. If you were relying on one of them, please create a [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml).

## Vite Runtime API

The experimental Vite Runtime API evolved into the Module Runner API, released in Vite 6 as part of the new experimental [Environment API](/guide/api-environment). Given that the feature was experimental the removal of the previous API introduced in Vite 5.1 isn't a breaking change, but users will need to update their use to the Module Runner equivalent as part of migrating to Vite 6.

## General Changes

### Default value for `resolve.conditions`

This change does not affect users that did not configure [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions).

In Vite 5, the default value for `resolve.conditions` was `[]` and some conditions were added internally. The default value for `ssr.resolve.conditions` was the value of `resolve.conditions`.

From Vite 6, some of the conditions are no longer added internally and need to be included in the config values.
The conditions that are no longer added internally for

- `resolve.conditions` are `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions` are `['module', 'node', 'development|production']`

The default values for those options are updated to the corresponding values and `ssr.resolve.conditions` no longer uses `resolve.conditions` as the default value. Note that `development|production` is a special variable that is replaced with `production` or `development` depending on the value of `process.env.NODE_ENV`. These default values are exported from `vite` as `defaultClientConditions` and `defaultServerConditions`.

If you specified a custom value for `resolve.conditions` or `ssr.resolve.conditions`, you need to update it to include the new conditions.
For example, if you previously specified `['custom']` for `resolve.conditions`, you need to specify `['custom', ...defaultClientConditions]` instead.

### JSON stringify

In Vite 5, when [`json.stringify: true`](/config/shared-options#json-stringify) is set, [`json.namedExports`](/config/shared-options#json-namedexports) was disabled.

From Vite 6, even when `json.stringify: true` is set, `json.namedExports` is not disabled and the value is respected. If you wish to achieve the previous behavior, you can set `json.namedExports: false`.

Vite 6 also introduces a new default value for `json.stringify` which is `'auto'`, which will only stringify large JSON files. To disable this behavior, set `json.stringify: false`.

### Extended support of asset references in HTML elements

In Vite 5, only a few supported HTML elements were able to reference assets that will be processed and bundled by Vite, such as `<link href>`, `<img src>`, etc.

Vite 6 extends the support to even more HTML elements. The full list can be found at the [HTML features](/guide/features.html#html) docs.

To opt-out of HTML processing on certain elements, you can add the `vite-ignore` attribute on the element.

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) has been updated to v6 from v4. [`tsx`](https://www.npmjs.com/package/tsx) or [`jiti`](https://www.npmjs.com/package/jiti) is now required to load TypeScript postcss config files instead of [`ts-node`](https://www.npmjs.com/package/ts-node). Also [`yaml`](https://www.npmjs.com/package/yaml) is now required to load YAML postcss config files.

### Sass now uses modern API by default

In Vite 5, the legacy API was used by default for Sass. Vite 5.4 added support for the modern API.

From Vite 6, the modern API is used by default for Sass. If you wish to still use the legacy API, you can set [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions). But note that the legacy API support will be removed in Vite 7.

To migrate to the modern API, see [the Sass documentation](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/).

### Customize CSS output file name in library mode

In Vite 5, the CSS output file name in library mode was always `style.css` and cannot be easily changed through the Vite config.

From Vite 6, the default file name now uses `"name"` in `package.json` similar to the JS output files. If [`build.lib.fileName`](/config/build-options.md#build-lib) is set with a string, the value will also be used for the CSS output file name. To explicitly set a different CSS file name, you can use the new [`build.lib.cssFileName`](/config/build-options.md#build-lib) to configure it.

To migrate, if you had relied on the `style.css` file name, you should update references to it to the new name based on your package name. For example:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

If you prefer to stick with `style.css` like in Vite 5, you can set `build.lib.cssFileName: 'style'` instead.

## Advanced

There are other breaking changes which only affect few users.

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - Support for default import of CSS files was [deprecated in Vite 4](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) and removed in Vite 5, but it was still unintentionally supported in SSR dev mode. This support is now removed.
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) is now enabled by default even for SSR builds.
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass` is now called for WebSocket upgrade requests and in that case, the `res` parameter will be `undefined`.
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - Minimal supported terser version for [`build.minify: 'terser'`](/config/build-options#build-minify) was bumped to 5.16.0 from 5.4.0.
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) is now `true` by default (was `'auto'` before).
    - This may lead to larger bundle sizes but will result in more deterministic builds.
    - If you are specifying a CommonJS file as an entry point, you may need additional steps. Read [the commonjs plugin documentation](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) for more details.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - Range braces (`{01..03}` ⇒ `['01', '02', '03']`) and incremental braces (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) are no longer supported in globs.
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - This PR not only introduces a breaking change mentioned above as "Default value for `resolve.conditions`", but also makes `resolve.mainFields` to not be used for no-externalized dependencies in SSR. If you were using `resolve.mainFields` and want to apply that to no-externalized dependencies in SSR, you can use [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields).
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - This opt-in optimization was removed due to edge cases when writing a file in a cached folder and immediately importing it.
- ~~[[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~Variables used in interpolation should be declared before the interpolation now. For more details, see [the `dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16).~~ This breaking change was reverted in v6.1.0.
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - Updates to an SSR-only module no longer triggers a full page reload in the client. To return to the previous behaviour, a custom Vite plugin can be used:
    <details>
    <summary>Click to expand example</summary>

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

## Migration from v4

Check the [Migration from v4 Guide](https://v5.vite.dev/guide/migration.html) in the Vite v5 docs first to see the needed changes to port your app to Vite 5, and then proceed with the changes on this page. -->








<!-- 



# مهاجرت از نسخه v5

## API محیط

به عنوان بخشی از [API محیط آزمایشی](/guide/api-environment.md)، نیاز به بازسازی داخلی بزرگی بود. Vite 6 تلاش دارد تا تغییرات غیرقابل برگشتی را کاهش دهد تا پروژه‌ها بتوانند به راحتی به نسخه جدید ارتقا یابند. ما منتظریم تا بخش بزرگی از اکوسیستم به این نسخه مهاجرت کند و سپس استفاده از APIهای جدید را توصیه کنیم. ممکن است برخی موارد خاص وجود داشته باشد که بیشتر بر استفاده سطح پایین توسط فریم‌ورک‌ها و ابزارها تأثیر می‌گذارد. ما با نگهدارندگان در اکوسیستم همکاری کرده‌ایم تا این تفاوت‌ها قبل از انتشار کاهش یابند. اگر بازگشتی را مشاهده کردید، لطفاً [یک مشکل جدید باز کنید](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml).

برخی از APIهای داخلی به دلیل تغییرات در پیاده‌سازی Vite حذف شده‌اند. اگر به یکی از آن‌ها وابسته بودید، لطفاً یک [درخواست ویژگی](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml) ایجاد کنید.

## API زمان اجرا Vite

API زمان اجرای آزمایشی Vite به API اجرایی ماژول تبدیل شد و در Vite 6 همراه با [API محیط آزمایشی](/guide/api-environment) منتشر شد. از آن‌جا که این ویژگی آزمایشی بود، حذف API قبلی که در Vite 5.1 معرفی شده بود، تغییر غیرقابل برگشتی نیست، اما کاربران باید برای مهاجرت به Vite 6، استفاده خود را به معادل‌های API اجرایی ماژول به‌روز کنند.

## تغییرات عمومی

### مقدار پیش‌فرض برای resolve.conditions

این تغییر بر کاربرانی که تنظیمات [resolve.conditions](/config/shared-options#resolve-conditions) / [ssr.resolve.conditions](/config/ssr-options#ssr-resolve-conditions) / [ssr.resolve.externalConditions](/config/ssr-options#ssr-resolve-externalconditions) را پیکربندی نکرده‌اند تأثیر نمی‌گذارد.

در Vite 5، مقدار پیش‌فرض برای resolve.conditions برابر [] بود و برخی شرایط به صورت داخلی اضافه می‌شدند. مقدار پیش‌فرض برای ssr.resolve.conditions همان مقدار resolve.conditions بود.

از Vite 6 به بعد، برخی شرایط دیگر به صورت داخلی اضافه نمی‌شوند و باید در مقادیر پیکربندی گنجانده شوند.
شرایطی که دیگر به صورت داخلی اضافه نمی‌شوند به شرح زیر است:

- resolve.conditions: ['module', 'browser', 'development|production']
- ssr.resolve.conditions: ['module', 'node', 'development|production']

مقدار پیش‌فرض برای این گزینه‌ها به مقادیر معادل به‌روز شده است و ssr.resolve.conditions دیگر از resolve.conditions به عنوان مقدار پیش‌فرض استفاده نمی‌کند. توجه داشته باشید که development|production یک متغیر خاص است که با توجه به مقدار process.env.NODE_ENV به production یا development تبدیل می‌شود. این مقادیر پیش‌فرض از Vite به عنوان defaultClientConditions و defaultServerConditions صادر شده‌اند.

اگر شما یک مقدار سفارشی برای resolve.conditions یا ssr.resolve.conditions مشخص کرده‌اید، باید آن را به‌روز کنید تا شرایط جدید را شامل شود.
برای مثال، اگر قبلاً ['custom'] را برای resolve.conditions مشخص کرده‌اید، باید آن را به ['custom', ...defaultClientConditions] به‌روز کنید.

### JSON stringify

در Vite 5، زمانی که [json.stringify: true](/config/shared-options#json-stringify) تنظیم می‌شد، [json.namedExports](/config/shared-options#json-namedexports) غیرفعال می‌شد.

از Vite 6 به بعد، حتی زمانی که json.stringify: true تنظیم شود، json.namedExports غیرفعال نمی‌شود و مقدار آن رعایت می‌شود. اگر می‌خواهید رفتار قبلی را داشته باشید، می‌توانید json.namedExports: false را تنظیم کنید.

Vite 6 همچنین یک مقدار پیش‌فرض جدید برای json.stringify معرفی کرده است که به صورت 'auto' تنظیم شده است و فقط فایل‌های JSON بزرگ را رشته‌ای می‌کند. برای غیرفعال کردن این رفتار، json.stringify: false را تنظیم کنید.

### پشتیبانی گسترش‌یافته از ارجاع‌های دارایی در عناصر HTML

در Vite 5، تنها برخی از عناصر HTML پشتیبانی شده قادر به ارجاع به دارایی‌هایی بودند که توسط Vite پردازش و بسته‌بندی می‌شدند، مانند <link href>، <img src> و غیره.

Vite 6 پشتیبانی را به سایر عناصر HTML گسترش می‌دهد. لیست کامل این عناصر را می‌توانید در مستندات [ویژگی‌های HTML](/guide/features.html#html) بیابید.

برای جلوگیری از پردازش HTML روی برخی از عناصر، می‌توانید ویژگی vite-ignore را به آن‌ها اضافه کنید.

### postcss-load-config

[postcss-load-config](https://npmjs.com/package/postcss-load-config) از نسخه v4 به v6 به‌روز شده است. اکنون برای بارگذاری فایل‌های پیکربندی postcss تایپ‌اسکریپت، به [tsx](https://www.npmjs.com/package/tsx) یا [jiti](https://www.npmjs.com/package/jiti) نیاز دارید و دیگر از [ts-node](https://www.npmjs.com/package/ts-node) استفاده نمی‌شود. همچنین برای بارگذاری فایل‌های پیکربندی YAML postcss به [yaml](https://www.npmjs.com/package/yaml) نیاز دارید.

### Sass اکنون به صورت پیش‌فرض از API مدرن استفاده می‌کند

در Vite 5، به طور پیش‌فرض از API قدیمی برای Sass استفاده می‌شد. Vite 5.4 پشتیبانی از API مدرن را اضافه کرد.

از Vite 6 به بعد، به طور پیش‌فرض از API مدرن برای Sass استفاده می‌شود. اگر همچنان می‌خواهید از API قدیمی استفاده کنید، می‌توانید تنظیمات [css.preprocessorOptions.sass.api: 'legacy' / css.preprocessorOptions.scss.api: 'legacy'](/config/shared-options#css-preprocessoroptions) را انجام دهید. اما توجه داشته باشید که پشتیبانی از API قدیمی در Vite 7 حذف خواهد شد.

برای مهاجرت به API مدرن، به مستندات [Sass](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/) مراجعه کنید.

### سفارشی‌سازی نام فایل خروجی CSS در حالت کتابخانه

در Vite 5، نام فایل CSS خروجی در حالت کتابخانه همیشه style.css بود و به راحتی نمی‌شد آن را از طریق پیکربندی Vite تغییر داد.

از Vite 6 به بعد، نام فایل پیش‌فرض اکنون از "name" در فایل package.json استفاده می‌کند، مشابه با فایل‌های خروجی JS. اگر [build.lib.fileName](/config/build-options.md#build-lib) با یک رشته تنظیم شود، این مقدار همچنین برای نام فایل CSS خروجی استفاده خواهد شد. برای تنظیم نام فایل CSS به طور صریح، می‌توانید از [build.lib.cssFileName](/config/build-options.md#build-lib) استفاده کنید.

برای مهاجرت، اگر به نام style.css وابسته بودید، باید مراجع به آن را به نام جدید براساس نام بسته خود به‌روز کنید. به عنوان مثال:

json [package.json]
```json
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

اگر ترجیح می‌دهید که مانند Vite 5 از `style.css` استفاده کنید، می‌توانید به جای آن `build.lib.cssFileName: 'style'` را تنظیم کنید.

## پیشرفته

تغییرات شکستن دیگری وجود دارد که فقط بر تعداد کمی از کاربران تأثیر می‌گذارد.

- [[#17922] fix(css)!: حذف واردات پیش‌فرض در SSR dev](https://github.com/vitejs/vite/pull/17922)
  - پشتیبانی از واردات پیش‌فرض فایل‌های CSS در [Vite 4](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string) منسوخ شد و در Vite 5 حذف شد، اما همچنان به طور تصادفی در حالت توسعه SSR پشتیبانی می‌شد. این پشتیبانی اکنون حذف شده است.
- [[#15637] fix!: تنظیم پیش‌فرض `build.cssMinify` به `'esbuild'` برای SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) اکنون به طور پیش‌فرض حتی برای ساخت‌های SSR فعال است.
- [[#18070] feat!: عبور از پراکسی با WebSocket](https://github.com/vitejs/vite/pull/18070)
  - اکنون برای درخواست‌های ارتقاء WebSocket از `server.proxy[path].bypass` استفاده می‌شود و در این حالت، پارامتر `res` مقدار `undefined` خواهد داشت.
- [[#18209] refactor!: افزایش نسخه حداقلی terser به 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - نسخه حداقلی terser برای [`build.minify: 'terser'`](/config/build-options#build-minify) از 5.4.0 به 5.16.0 افزایش یافت.
- [[#18231] chore(deps): به‌روزرسانی وابستگی @rollup/plugin-commonjs به v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) اکنون به طور پیش‌فرض `true` است (قبلاً `'auto'` بود).
    - این ممکن است منجر به حجم‌های بزرگتر بسته‌ها شود، اما باعث می‌شود ساخت‌ها به‌طور دقیق‌تر انجام شوند.
    - اگر یک فایل CommonJS را به عنوان نقطه ورودی مشخص کرده‌اید، ممکن است به اقدامات اضافی نیاز داشته باشید. برای جزئیات بیشتر، به [مستندات پلاگین commonjs](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) مراجعه کنید.
- [[#18243] chore(deps)!: مهاجرت `fast-glob` به `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - براکت‌های بازه (`{01..03}` ⇒ `['01', '02', '03']`) و براکت‌های افزایشی (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) دیگر در glob‌ها پشتیبانی نمی‌شوند.
- [[#18395] feat(resolve)!: اجازه حذف شرایط](https://github.com/vitejs/vite/pull/18395)
  - این PR نه تنها تغییر شکستن ذکر شده به عنوان "مقدار پیش‌فرض برای `resolve.conditions`" را معرفی می‌کند، بلکه باعث می‌شود `resolve.mainFields` برای وابستگی‌های بدون خروجی در SSR استفاده نشود. اگر از `resolve.mainFields` استفاده می‌کنید و می‌خواهید آن را برای وابستگی‌های بدون خروجی در SSR اعمال کنید، می‌توانید از [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields) استفاده کنید.
- [[#18493] refactor!: حذف گزینه fs.cachedChecks](https://github.com/vitejs/vite/pull/18493)
  - این بهینه‌سازی اختیاری به دلیل موارد خاص هنگام نوشتن یک فایل در یک پوشه کش‌شده و بلافاصله وارد کردن آن حذف شد.
- ~~[[#18697] fix(deps)!: به‌روزرسانی وابستگی dotenv-expand به v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~متغیرهایی که در جایگزینی استفاده می‌شوند باید قبل از جایگزینی اعلام شوند. برای جزئیات بیشتر، به [تغییرات changelog dotenv-expand](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16) مراجعه کنید.~~ این تغییر در v6.1.0 بازگشت داده شد.
- [[#16471] feat: v6 - API محیط](https://github.com/vitejs/vite/pull/16471)





 

 - به‌روزرسانی‌های ماژول مخصوص SSR دیگر باعث بارگذاری کامل صفحه در کلاینت نمی‌شود. برای بازگشت به رفتار قبلی، می‌توان از یک پلاگین سفارشی Vite استفاده کرد:
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


## مهاجرت از نسخه v4

ابتدا [راهنمای مهاجرت از نسخه v4](https://v5.vite.dev/guide/migration.html) را در مستندات Vite v5 بررسی کنید تا تغییرات مورد نیاز برای انتقال اپلیکیشن خود به Vite 5 را مشاهده کنید و سپس به تغییرات این صفحه بپردازید. -->





# مهاجرت از v5

## API محیطی

به عنوان بخشی از [(Environment API)API محیطی](/guide/api-environment.md) جدید و آزمایشی، یک بازسازی داخلی بزرگ مورد نیاز بود. Vite 6 تلاش می‌کند تا از ایجاد تغییرات مخرب جلوگیری کند تا اکثر پروژه‌ها بتوانند به سرعت به نسخه جدید ارتقا یابند. ما منتظر خواهیم ماند تا بخش بزرگی از اکوسیستم به نسخه جدید مهاجرت کند تا APIهای جدید را تثبیت کرده و استفاده از آن‌ها را توصیه کنیم. ممکن است برخی موارد خاص وجود داشته باشد، اما این موارد تنها بر استفاده‌های سطح پایین توسط فریمورک‌ها و ابزارها تأثیر خواهند گذاشت. ما با نگهدارندگان اکوسیستم همکاری کرده‌ایم تا این تفاوت‌ها را قبل از انتشار کاهش دهیم. لطفاً در صورت مشاهده‌ی مشکل، یک [گزارش اشکال](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml) ثبت کنید.

برخی APIهای داخلی به دلیل تغییرات در پیاده‌سازی Vite حذف شده‌اند. اگر به یکی از آن‌ها متکی بودید، لطفاً یک [درخواست ویژگی](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml) ایجاد کنید.

## API زمان اجرا Vite

API زمان اجرای آزمایشی Vite به API جدید "Module Runner" تکامل یافته است که در Vite 6 به عنوان بخشی از [(Environment API)API محیطی](/guide/api-environment) جدید منتشر شده است. از آنجا که این قابلیت در نسخه قبلی آزمایشی بود، حذف API قبلی که در Vite 5.1 معرفی شده بود، یک تغییر مخرب محسوب نمی‌شود، اما کاربران باید استفاده‌ی خود را به معادل جدید در "Module Runner" به‌روزرسانی کنند.

## تغییرات کلی

### مقدار پیش‌فرض `resolve.conditions`

این تغییر بر کاربرانی که گزینه‌های [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions) را پیکربندی نکرده‌اند تأثیری ندارد.

در Vite 5، مقدار پیش‌فرض `resolve.conditions` مقدار `[]` بود و برخی شرایط به‌صورت داخلی اضافه می‌شدند. مقدار پیش‌فرض `ssr.resolve.conditions` برابر با مقدار `resolve.conditions` بود.

در Vite 6، برخی از این شرایط دیگر به‌صورت داخلی اضافه نمی‌شوند و باید در تنظیمات پیکربندی گنجانده شوند:

- `resolve.conditions` دیگر شامل `['module', 'browser', 'development|production']` نیست.
- `ssr.resolve.conditions` دیگر شامل `['module', 'node', 'development|production']` نیست.

مقادیر پیش‌فرض این گزینه‌ها به مقادیر مربوطه به‌روز شده و `ssr.resolve.conditions` دیگر از مقدار `resolve.conditions` به عنوان مقدار پیش‌فرض استفاده نمی‌کند. توجه داشته باشید که `development|production` یک متغیر خاص است که بسته به مقدار `process.env.NODE_ENV` به `production` یا `development` تبدیل می‌شود. این مقادیر پیش‌فرض از `vite` به عنوان `defaultClientConditions` و `defaultServerConditions` صادر می‌شوند.

اگر مقدار سفارشی برای `resolve.conditions` یا `ssr.resolve.conditions` مشخص کرده‌اید، باید آن را به‌روزرسانی کنید تا شرایط جدید را نیز شامل شود. به عنوان مثال، اگر قبلاً مقدار `['custom']` را برای `resolve.conditions` تعیین کرده بودید، اکنون باید مقدار `['custom', ...defaultClientConditions]` را مشخص کنید.

### `JSON.stringify`

در Vite 5، زمانی که گزینه [`json.stringify: true`](/config/shared-options#json-stringify) تنظیم شده بود، [`json.namedExports`](/config/shared-options#json-namedexports) غیرفعال می‌شد.

در Vite 6، حتی اگر `json.stringify: true` تنظیم شده باشد، `json.namedExports` غیرفعال نمی‌شود و مقدار آن رعایت خواهد شد. اگر می‌خواهید رفتار قبلی را داشته باشید، می‌توانید `json.namedExports: false` را تنظیم کنید.

همچنین در Vite 6 مقدار پیش‌فرض جدیدی برای `json.stringify` معرفی شده که مقدار `'auto'` است و تنها فایل‌های JSON بزرگ را به‌صورت رشته‌ای ذخیره می‌کند. برای غیرفعال کردن این رفتار، مقدار `json.stringify: false` را تنظیم کنید.

### پشتیبانی گسترده‌تر از مراجع منابع در عناصر HTML

در Vite 5، تنها تعداد محدودی از عناصر HTML می‌توانستند به منابعی که توسط Vite پردازش و بسته‌بندی می‌شوند ارجاع دهند، مانند `<link href>`، `<img src>` و غیره.

در Vite 6، این پشتیبانی به تعداد بیشتری از عناصر HTML گسترش یافته است. لیست کامل در مستندات [ویژگی‌های HTML](/guide/features.html#html) موجود است.

برای جلوگیری از پردازش HTML در برخی عناصر خاص، می‌توانید از ویژگی `vite-ignore` در آن عنصر استفاده کنید.

### `postcss-load-config`

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

### استفاده از `style.css` مانند Vite 5

اگر ترجیح می‌دهید که همچنان از `style.css` مانند Vite 5 استفاده کنید، می‌توانید مقدار `build.lib.cssFileName: 'style'` را تنظیم کنید.

## تغییرات پیشرفته

تعدادی از تغییرات مهم دیگر وجود دارند که تنها بر تعداد کمی از کاربران تأثیر می‌گذارند:

- **حذف وارد کردن پیش‌فرض CSS در حالت توسعه SSR**
  - پشتیبانی از وارد کردن پیش‌فرض فایل‌های CSS در Vite 4 منسوخ شد و در Vite 5 حذف شد، اما در حالت توسعه SSR همچنان به‌طور ناخواسته پشتیبانی می‌شد. این پشتیبانی اکنون کاملاً حذف شده است.

- **تغییر مقدار پیش‌فرض `build.cssMinify`**
  - مقدار پیش‌فرض [`build.cssMinify`](/config/build-options#build-cssminify) اکنون `'esbuild'` است، حتی برای بیلدهای SSR.

- **پشتیبانی از WebSocket در `server.proxy.bypass`**
  - گزینه `server.proxy[path].bypass` اکنون برای درخواست‌های ارتقاء WebSocket نیز فراخوانی می‌شود و در این حالت، پارامتر `res` مقدار `undefined` خواهد داشت.

- **افزایش حداقل نسخه پشتیبانی‌شده‌ی `terser`**
  - حداقل نسخه‌ی `terser` برای [`build.minify: 'terser'`](/config/build-options#build-minify) به نسخه 5.16.0 ارتقا یافته است.

- **بروزرسانی `@rollup/plugin-commonjs` به نسخه 28**
  - مقدار پیش‌فرض [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) اکنون `true` است (قبلاً مقدار `'auto'` بود).
  - این تغییر ممکن است اندازه باندل‌ها را افزایش دهد اما بیلدهای قطعی‌تری را فراهم می‌کند.

- **مهاجرت از `fast-glob` به `tinyglobby`**
  - براکت‌های `{} {01..03}` و `{} {2..8..2}` دیگر در الگوهای glob پشتیبانی نمی‌شوند.

- **تغییرات در `resolve.conditions` و `resolve.mainFields`**
  - مقدار پیش‌فرض `resolve.conditions` تغییر کرده و `resolve.mainFields` دیگر برای وابستگی‌های بدون `external` در SSR اعمال نمی‌شود.

- **حذف گزینه `fs.cachedChecks`**
  - این بهینه‌سازی اختیاری به دلیل مشکلات خاص حذف شده است.

      <details>
    <summary>Click to expand example</summary>

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

