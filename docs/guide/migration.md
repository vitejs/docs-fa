# مهاجرت از نسخه ۶

## پشتیبانی Node.js

Vite دیگر از Node.js نسخه ۱۸ پشتیبانی نمی‌کند، چرا که به پایان عمر خود (EOL) رسیده است. از این پس حداقل به Node.js نسخه 20.19+ یا 22.12+ نیاز دارید.

## تغییر Target مرورگر پیش‌فرض

مقدار پیش‌فرض `build.target` برای مرورگرها به نسخه‌های جدیدتر به‌روزرسانی شده است:

- Chrome: از 87 → 107
- Edge: از 88 → 107
- Firefox: از 78 → 104
- Safari: از 14.0 → 16.0

این نسخه‌های مرورگر مطابق با مجموعه قابلیت‌های «به طور گسترده در دسترس» در [Baseline](https://web-platform-dx.github.io/web-features/) هستند (تا تاریخ ۱ مه ۲۰۲۵). به عبارت دیگر، همه این نسخه‌ها پیش از ۱ نوامبر ۲۰۲۲ منتشر شده‌اند.

در Vite نسخه ۵، مقدار پیش‌فرض `'modules'` بود، که اکنون دیگر پشتیبانی نمی‌شود. به جای آن، مقدار جدید `'baseline-widely-available'` به عنوان پیش‌فرض معرفی شده است.

## تغییرات عمومی

### حذف پشتیبانی از API قدیمی Sass

پشتیبانی از API قدیمی Sass طبق برنامه‌ریزی قبلی حذف شده است. Vite اکنون فقط از API مدرن Sass پشتیبانی می‌کند. می‌توانید گزینه‌های `css.preprocessorOptions.sass.api` و `css.preprocessorOptions.scss.api` را از تنظیمات خود حذف کنید.

## حذف ویژگی‌های منقضی‌شده

- `splitVendorChunkPlugin` (از نسخه 5.2.7 منقضی شده بود)
  - این پلاگین برای ساده‌تر کردن مهاجرت به Vite 2.9 معرفی شده بود.
  - اکنون می‌توان از گزینه `build.rollupOptions.output.manualChunks` برای کنترل چانک‌ها استفاده کرد.
- `enforce` / `transform` در سطح هوک برای `transformIndexHtml` (در نسخه 4.0.0 منقضی شده بود)
  - ساختار آن به سبک [هوک‌های آبجکت در Rollup](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.) تغییر کرد.
  - اکنون باید به جای `enforce` از `order` و به جای `transform` از `handler` استفاده شود.

## پیشرفته

تغییرات ناسازگار دیگری نیز وجود دارند که فقط تعداد کمی از کاربران را تحت تأثیر قرار می‌دهند:

- [‎[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - محدوده نسخه‌ی وابستگی‌های هم‌سطح (peer dependencies) برای پیش‌پردازنده‌های CSS مشخص شده است.
- [‎[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - ویژگی `legacy.proxySsrExternalModules` از نسخه ۶ به بعد در Vite هیچ تأثیری نداشت. اکنون این ویژگی به طور کامل حذف شده است.
- [‎[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - ویژگی‌های بدون استفاده زیر اکنون حذف شده‌اند: `ModuleRunnerOptions.root`, `ViteDevServer._importGlobMap`, `ResolvePluginOptions.isFromTsImporter`, `ResolvePluginOptions.getDepsOptimizer`, `ResolvePluginOptions.shouldExternalize`, `ResolvePluginOptions.ssrConfig`
- [‎[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - این ویژگی‌ها از ابتدا منقضی (deprecated) شده بودند و اکنون به‌طور کامل حذف شده‌اند.
- [‎[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - این تایپ‌ها به‌عنوان بخشی از API رانتایم که اکنون منقضی شده، معرفی شده بودند. این تایپ‌ها اکنون به‌طور کامل حذف شده‌اند: `HMRBroadcaster`, `HMRBroadcasterClient`, `ServerHMRChannel`, `HMRChannel`
- [‎[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - اکنون مقدار `__vite_ssr_exportName__` برای context رانتایم ماژول الزامی شده است.
- [‎[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries` اکنون دیگر مسیرهای رشته‌ای (literal string paths) را نمی‌پذیرد. در عوض، همیشه باید به‌صورت glob ارائه شود.
- [‎[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - برخی از میان‌افزارها اکنون پیش از اجرای هوک‌های `configureServer` و `configurePreviewServer` اعمال می‌شوند. توجه داشته باشید: اگر انتظار ندارید که یک مسیر خاص از گزینه‌های [`server.cors`](../config/server-options.md#server-cors) یا [`preview.cors`](../config/preview-options.md#preview-cors) تأثیر بگیرد، حتماً هدرهای مرتبط را به‌صورت دستی از پاسخ حذف کنید.

## مهاجرت از نسخه ۵

ابتدا راهنمای [مهاجرت از نسخه ۵](https://v6.vite.dev/guide/migration.html) را در مستندات Vite نسخه ۶ بخوانید تا برنامه‌تان را به Vite ۶ منتقل کنید، سپس تغییرات گفته‌شده در این صفحه را اعمال نمایید.
