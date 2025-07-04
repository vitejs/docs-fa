# یکپارچه‌سازی با بک‌اند (Backend Integration)

:::tip نکته
اگر می‌خواهید HTML را با یک بک‌اند سنتی مثل Rails یا Laravel ارائه دهید، اما از Vite برای سرویس‌دهی به فایل‌های استاتیک (مثل CSS و JS) استفاده کنید، بهتر است ابتدا بررسی کنید که آیا یکپارچه‌سازی آماده‌ای برای فریم‌ورک مورد نظر شما در [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends) وجود دارد یا نه.

اگر هیچ یکپارچه‌سازی آماده‌ای موجود نبود و نیاز به راه‌اندازی سفارشی داشتید، می‌توانید با دنبال کردن مراحل این راهنما به صورت دستی آن را پیکربندی کنید.
:::

1. در فایل کانفیگ Vite خود، نقطه ورود (entry) را مشخص کرده و گزینه تولید مانیفست (build manifest) را فعال کنید:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     server: {
       cors: {
         // مبدأیی که قرار است از طریق مرورگر به آن دسترسی داشته باشید
         origin: 'http://my-backend.example.com',
       },
     },
     build: {
       // تولید می‌کند outDir را در مسیر .vite/manifest.json فایل
       manifest: true,
       rollupOptions: {
         // را بازنویسی می‌کند .html ورودی پیش‌فرض
         input: '/path/to/main.js',
       },
     },
   })
   ```

   اگر [polyfill مربوط به preload ماژول](/config/build-options.md#build-polyfillmodulepreload) را غیرفعال نکرده‌اید، باید این polyfill را هم در فایل ورودی (entry) خود وارد کنید.

   ```js
   // ابتدای ورودی برنامه خود را اضافه کنید
   import 'vite/modulepreload-polyfill'
   ```

2. برای محیط توسعه، موارد زیر را در قالب HTML سرور خود وارد کنید (آدرس `http://localhost:5173` را با آدرس محلی که Vite در آن اجرا می‌شود، جایگزین کنید):

   ```html
   <!-- if development -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   برای سرویس‌دهی صحیح asset ها، دو راه دارید:
   - اطمینان حاصل کنید که سرور به درستی تنظیم شده باشد تا درخواست‌های asset های استاتیک را به سرور Vite پروکسی کند.
   - گزینه [`server.origin`](/config/server-options.md#server-origin) را تنظیم کنید تا آدرس‌های URL برای asset های تولید شده با استفاده از آدرس سرور بک‌اند اضافه شوند، به جای اینکه از مسیر نسبی استفاده کنند.

   این کار برای بارگذاری صحیح asset هایی مانند تصاویر ضروری است.

   توجه داشته باشید که اگر از React همراه با `‎@vitejs/plugin-react` استفاده می‌کنید، باید این را قبل از اسکریپت‌های بالا اضافه کنید، زیرا این پلاگین قادر به تغییر HTML که شما سرو می‌کنید نیست (آدرس `http://localhost:5173` را با آدرس محلی که Vite در آن در حال اجرا است جایگزین کنید).

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. برای پروداکشن: پس از اجرای دستور `vite build`، یک فایل `‎.vite/manifest.json` همراه با سایر فایل‌های asset تولید خواهد شد. نمونه فایل مانفیست به شکل زیر خواهد بود:

   ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   - مانیفست دارای ساختار `Record<name, chunk>‎` است
   - برای چانک‌های ورودی یا چانک‌های ورودی پویا، کلید همان مسیر نسبی فایل src است که از مسیر ریشه پروژه شروع می‌شود.
   - برای چانک‌های غیر ورودی، کلید نام پایه فایل تولید شده با پیشوند `_` است.
   - برای فایل CSS تولید شده هنگامی که [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) برابر با `false` است، کلید `style.css` است.
   - چانک‌ها شامل اطلاعاتی درباره ایمپورت‌های استاتیک و پویای خود هستند (هر دو کلیدهایی هستند که به چانک مربوطه در مانیفست اشاره می‌کنند) و همچنین فایل‌های CSS و asset مرتبط (در صورت وجود).

4. می‌توانید از این فایل برای رندر کردن لینک‌ها یا دستورالعمل‌های پیش‌بارگذاری با نام‌های هش‌شده فایل‌ها استفاده کنید.

   در اینجا یک نمونه قالب HTML برای رندر کردن لینک‌های مناسب آورده شده است. سینتکس ارائه‌شده فقط برای توضیح است
   و باید با زبان قالب‌نویسی سرور شما جایگزین شود.
   تابع `importedChunks` فقط برای نمایش است و توسط Vite ارائه نمی‌شود.

   ```html
   <!-- if production -->

   <!-- for cssFile of manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- for chunk of importedChunks(manifest, name) -->
   <!-- for cssFile of chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- for chunk of importedChunks(manifest, name) -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   به طور مشخص، یک بک‌اند که HTML تولید می‌کند باید با توجه به
   فایل مانیفست و یک نقطه ورودی، تگ‌های زیر را شامل شود:
   - یک تگ `‎<link rel="stylesheet">‎` برای هر فایل در لیست `css` چانک نقطه ورودی.
   - به صورت بازگشتی تمام چانک‌های موجود در لیست `imports` ورودی را دنبال کنید و یک تگ
   `‎<link rel="stylesheet">`‎ برای هر فایل CSS از هر چانک ایمپورت‌شده اضافه کنید.
   - یک تگ برای کلید `file` چانک ورودی (برای جاوااسکریپت `‎<script type="module">‎`،
     یا برای CSS ‎`<link rel="stylesheet">`‎).
   - به صورت اختیاری، یک تگ `‎<link rel="modulepreload">‎` برای `file` برای هر چانک جاوااسکریپت
     ایمپورت‌شده، باز هم به صورت بازگشتی از چانک ورودی شروع کنید.

   با توجه به مثال مانیفست بالا، برای ورودی `views/foo.js`، تگ‌های زیر باید در محیط پروداکشن گنجانده شوند:

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <!-- optional -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   در حالی که موارد زیر باید برای ورودی `views/bar.js` گنجانده شوند:

   ```html
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/bar-gkvgaI9m.js"></script>
   <!-- optional -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   ::: details پیاده‌سازی شبه‌کد تابع `importedChunks`
   یک مثال از پیاده‌سازی شبه‌کد `importedChunks` در TypeScript
   (این کد نیاز به سازگاری با زبان برنامه‌نویسی و زبان قالب‌بندی شما خواهد داشت):

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()

     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
           continue
         }
         seen.add(file)

         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }

       return chunks
     }

     return getImportedChunks(manifest[name])
   }
   ```

   :::
