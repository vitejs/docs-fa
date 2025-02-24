### عیب‌یابی

برای اطلاعات بیشتر، به [Rollup's troubleshooting guide](https://rollupjs.org/troubleshooting/) نیز مراجعه کنید.

اگر پیشنهادات ارائه‌شده در اینجا کار نمی‌کنند، لطفاً سؤالات خود را در [GitHub Discussions](https://github.com/vitejs/vite/discussions) یا در کانال [Vite Land Discord](https://chat.vite.dev) کلید `#help` ارسال کنید.

#### CJS

### Vite CJS Node API deprecated

ساخت CJS از API نود Vite منسوخ شده است و در نسخه 6 Vite حذف خواهد شد. برای اطلاعات بیشتر، به [GitHub Discussions](https://github.com/vitejs/vite/discussions/13928) مراجعه کنید. شما باید فایل‌ها یا فریم‌ورک‌های خود را برای وارد کردن ساخت ESM از Vite به‌روزرسانی کنید.

در یک پروژه ابتدایی Vite، اطمینان حاصل کنید:

1. محتوای فایل `vite.config.js` از سینتکس ESM استفاده می‌کند.
2. نزدیک‌ترین فایل `package.json` بصورت `"type": "module"` است، یا از پسوند `.mjs`/`.mts` استفاده کنید، مانند `vite.config.mjs` یا `vite.config.mts`.

برای پروژه‌های دیگر، چندین رویکرد عمومی وجود دارد:

- **پیکربندی ESM به‌عنوان پیش‌فرض، انتخاب CJS در صورت نیاز:** اضافه‌کردن `"type": "module"` به `package.json` پروژه. تمام فایل‌های `*.js` اکنون به‌عنوان ESM تفسیر می‌شوند و باید از سینتکس ESM استفاده کنند. می‌توانید با تغییر نام فایل به پسوند `.cjs` از CJS استفاده کنید.
- **نگه‌داشتن CJS به‌عنوان پیش‌فرض، انتخاب ESM در صورت نیاز:** اگر `package.json` پروژه دارای `"type": "module"` نیست، تمام فایل‌های `*.js` به‌عنوان CJS تفسیر می‌شوند. می‌توانید با تغییر نام فایل به پسوند `.mjs` از ESM استفاده کنید.
- **وارد کردن داینامیک Vite:** اگر نیاز به استفاده از CJS دارید، می‌توانید با استفاده از `import('vite')` به‌صورت داینامیک Vite را وارد کنید. این نیاز به نوشتن کد شما در یک زمینه async دارد، اما همچنان قابل‌مدیریت است زیرا API Vite عمدتاً ناهمگام است.
  
اگر نمی‌دانید هشدار از کجا می‌آید، می‌توانید اسکریپت خود را با فلگ `VITE_CJS_TRACE=true` اجرا کنید تا تریس استک را لاگ کند:

```bash
VITE_CJS_TRACE=true vite dev
```

اگر می‌خواهید موقتاً هشدار را نادیده بگیرید، می‌توانید اسکریپت خود را با فلگ `VITE_CJS_IGNORE_WARNING=true` اجرا کنید:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

توجه داشته باشید که فایل‌های پیکربندی postcss هنوز از ESM + TypeScript (`.mts` یا `.ts` در `"type": "module"`) پشتیبانی نمی‌کنند. اگر پیکربندی‌های postcss با `.ts` دارید و `"type": "module"` را به `package.json` اضافه کرده‌اید، همچنین باید پیکربندی postcss را به `.cts` تغییر نام دهید.

#### CLI

##### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'`

مسیر پوشه پروژه شما ممکن است شامل `&` باشد، که با `npm` در ویندوز کار نمی‌کند ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

شما نیاز خواهید داشت به:

- تغییر به یک پکیج منیجر دیگر (مانند `pnpm`, `yarn`)
- حذف `&` از مسیر پروژه شما

#### پیکربندی

##### این پکیج ESM Only است

هنگام وارد کردن یک پکیج ESM Only با `require`، خطای زیر رخ می‌دهد.

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/dependency.js from /path/to/vite.config.js not supported.
> Instead change the require of index.js in /path/to/vite.config.js to a dynamic import() which is available in all CommonJS modules.

در Node.js <=22، فایل‌های ESM نمی‌توانند به‌صورت پیش‌فرض توسط [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require) بارگیری شوند.

درحالی‌که ممکن است با استفاده از [`--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require)، یا Node.js >22، یا در محیط‌های دیگر کار کند، ما همچنان توصیه می‌کنیم پیکربندی خود را بدین شکل به ESM تبدیل کنید :

- اضافه‌کردن `"type": "module"` به نزدیک‌ترین `package.json`
- تغییر نام `vite.config.js`/`vite.config.ts` به `vite.config.mjs`/`vite.config.mts`

##### `failed to load config from '/path/to/config*/vite.config.js'`

> failed to load config from '/path/to/config\*/vite.config.js'
> error when starting dev server:
> Error: Build failed with 1 error:
> error: Must use "outdir" when there are multiple input files

خطای فوق ممکن است درصورتی رخ دهد که مسیر پوشه پروژه شما شامل `*` باشد، که esbuild به‌عنوان یک گلوب در نظر می‌گیرد. شما نیاز خواهید داشت تا پوشه خود را تغییر نام دهید تا `*` حذف شود.

#### سرور توسعه

### Requests are stalled forever

اگر از لینوکس استفاده می‌کنید، ممکن است محدودیت‌های فایل دیسکریپتر و محدودیت‌های inotify باعث این مشکل شوند. ازآنجاکه Vite بیشتر فایل‌ها را دسته‌بندی نمی‌کند، مرورگرها ممکن است درخواست‌های زیادی ارسال کنند که نیاز به دیسکریپترهای فایل زیادی دارند، و این باعث افزایش محدودیت می‌شود.

برای حل این مشکل:

- افزایش محدودیت دیسکریپتر فایل با `ulimit`

  ```shell
  # بررسی محدودیت فعلی
  $ ulimit -Sn
  # تغییر محدودیت (موقتی)
  $ ulimit -Sn 10000 # ممکن است نیاز به تغییر محدودیت سخت نیز داشته باشید
  # راه‌اندازی مجدد مرورگر خود
  ```

- افزایش محدودیت‌های مرتبط با inotify با `sysctl`

  ```shell
  # بررسی محدودیت‌های فعلی
  $ sysctl fs.inotify
  # تغییر محدودیت‌ها (موقتی)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

اگر مراحل بالا کار نکرد، می‌توانید `DefaultLimitNOFILE=65536` را به‌عنوان یک پیکربندی بدون نظر به فایل‌های زیر اضافه کنید:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

برای لینوکس Ubuntu، ممکن است نیاز به اضافه‌کردن خط `* - nofile 65536` به فایل `/etc/security/limits.conf` به‌جای به‌روزرسانی فایل‌های پیکربندی systemd داشته باشید.

توجه داشته باشید که این تنظیمات پایدار هستند اما **نیاز به راه‌اندازی مجدد دارند**.

### Network requests stop loading

هنگام استفاده از یک گواهی SSL خودامضا، Chrome تمام دستورات کش را نادیده می‌گیرد و محتوا را دوباره بارگذاری می‌کند. Vite به این دستورات کش متکی است.

برای حل این مشکل از یک گواهی SSL معتبر استفاده کنید.

یا میتوانید به این لینک ها مراجعه کنید: [مشکلات کش](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html)، [مشکل Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

##### macOS

می‌توانید یک گواهی معتبر را از طریق CLI با این فرمان نصب کنید:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

یا، با واردکردن آن به اپلیکیشن Keychain Access و به‌روزرسانی اعتماد گواهی خود به "Always Trust."

### 431 Request Header Fields Too Large

هنگامی که سرور / سرور WebSocket یک هدر HTTP بزرگ دریافت می‌کند، درخواست رد شده و هشدار زیر نمایش داده می‌شود.

> سرور با کد وضعیت 431 پاسخ داد. به https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large مراجعه کنید.

این به این دلیل است که Node.js اندازه هدر درخواست را برای کاهش [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) محدود می‌کند.

برای اجتناب از این مشکل، سعی کنید اندازه هدر درخواست خود را کاهش دهید. به عنوان مثال، اگر کوکی طولانی است، آن را حذف کنید. یا می‌توانید از [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) برای تغییر حداکثر اندازه هدر استفاده کنید.

### Dev Containers / انتقال پورت VS Code

اگر از Dev Container یا قابلیت انتقال پورت در VS Code استفاده می‌کنید، ممکن است نیاز به تنظیم گزینه [`server.host`](/config/server-options.md#server-host) به `127.0.0.1` در تنظیمات داشته باشید تا آن را کار کند.

این به این دلیل است که [قابلیت انتقال پورت در VS Code از IPv6 پشتیبانی نمی‌کند](https://github.com/microsoft/vscode-remote-release/issues/7029).

برای جزئیات بیشتر، به [#16522](https://github.com/vitejs/vite/issues/16522) مراجعه کنید.

### HMR

#### Vite تغییر فایل را تشخیص می‌دهد اما HMR کار نمی‌کند

ممکن است فایلی را با یک حالت متفاوت وارد کنید. به عنوان مثال، `src/foo.js` وجود دارد و `src/bar.js` شامل:

```js
import './Foo.js' // باید './foo.js' باشد
```

لینک ارور: [#964](https://github.com/vitejs/vite/issues/964)

#### Vite تغییر فایل را تشخیص نمی‌دهد

اگر Vite را با WSL2 اجرا می‌کنید، ممکن است Vite نتواند تغییرات فایل را در برخی شرایط مشاهده کند. به [`server.watch` option](/config/server-options.md#server-watch) مراجعه کنید.

#### به‌جای HMR، بارگذاری کامل انجام می‌شود

اگر HMR توسط Vite یا پلاگینی مدیریت نشود، بارگذاری کامل انجام خواهد شد زیرا این تنها راه برای تازه‌سازی حالت است.

اگر HMR مدیریت شده باشد اما در یک وابستگی دایره‌ای قرار داشته باشد، یک بارگذاری کامل نیز انجام خواهد شد تا ترتیب اجرای را بازیابی کند. برای حل این مشکل، سعی کنید حلقه را قطع کنید. می‌توانید `vite --debug hmr` را اجرا کنید تا مسیر وابستگی دایره‌ای را در صورت تغییر فایل لاگ کند.

### بیلد

#### فایل بیلد شده به دلیل خطای CORS کار نمی‌کند

اگر فایل HTML خروجی با پروتکل `file` باز شود، اسکریپت‌ها با خطای زیر مواجه شده و اجرا نخواهند شد.

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).


برای اطلاعات بیشتر در مورد اینکه چرا این اتفاق می‌افتد، به [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) مراجعه کنید.

شما باید به فایل با پروتکل `http` دسترسی پیدا کنید. آسان‌ترین راه برای انجام این کار اجرای `npx vite preview` است.

### وابستگی‌های بهینه‌سازی‌شده

#### لینک شدن پکیج های قدیمی به پکیج های لوکال

کلید هش استفاده‌شده برای باطل کردن وابستگی‌های بهینه‌شده بستگی به محتوای قفل پکیج، وصله‌های اعمال‌شده به وابستگی‌ها و گزینه‌های موجود در فایل پیکربندی Vite که بر روی دسته‌بندی ماژول‌های نود تأثیر می‌گذارد، دارد. این به این معنی است که Vite تشخیص خواهد داد که یک وابستگی با استفاده از ویژگی‌ای مانند [overrides npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) لغو شده است و وابستگی‌های شما را در شروع بعدی سرور دوباره دسته‌بندی می‌کند. Vite وابستگی‌ها را باطل نمی‌کند وقتی که از ویژگی‌ای مانند [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) استفاده می‌کنید. در صورت لینک یا unlink یک وابستگی، باید بهینه‌سازی مجدد را در شروع بعدی سرور با استفاده از `vite --force` انجام دهید. ما توصیه می‌کنیم از overrides استفاده کنید که اکنون توسط همه پکیج منیجرها پشتیبانی می‌شود (همچنین به [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) و [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions) مراجعه کنید).

### گلوگاه‌های عملکرد

اگر به‌دلیل گلوگاه‌های عملکرد اپلیکیشن با زمان بارگذاری کند مواجه شدید، می‌توانید با سرور توسعه Vite یا هنگام ساخت اپلیکیشن، بازرسی کننده Node.js را فعال کنید تا پروفایل CPU ایجاد کنید:

::: code-group

```bash [سرور توسعه]
vite --profile --open
```

```bash [ساخت]
vite build --profile
```

:::

::: tip سرور توسعه Vite
پس از باز شدن اپلیکیشن در مرورگر، فقط صبر کنید تا بارگذاری کامل شود و سپس به ترمینال برگردید و کلید `p` را فشار دهید (بازرسی کننده Node.js را متوقف می‌کند) سپس کلید `q` را فشار دهید تا سرور توسعه متوقف شود.
:::

بازرسی کننده Node.js فایل `vite-profile-0.cpuprofile` را در پوشه اصلی ایجاد می‌کند، به https://www.speedscope.app/ بروید و پروفایل CPU را با استفاده از دکمه `BROWSE` بارگذاری کنید تا نتیجه را بررسی کنید.

می‌توانید [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) را نصب کنید که به شما اجازه می‌دهد وضعیت میانی پلاگین‌های Vite را بازرسی کنید و همچنین به شما کمک می‌کند تا مشخص کنید کدام پلاگین‌ها یا میان‌افزارها در اپلیکیشن‌های شما گلوگاه هستند. این پلاگین می‌تواند در حالت‌های توسعه و ساخت استفاده شود. فایل readme را برای جزئیات بیشتر بررسی کنید.

### سایر موارد

#### ماژول خارجی برای سازگاری با مرورگر

هنگامی که از یک ماژول Node.js در مرورگر استفاده می‌کنید، Vite هشدار زیر را خروجی می‌دهد.

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.

این به این دلیل است که Vite به‌صورت خودکار ماژول‌های Node.js را پلی‌فیل نمی‌کند.

ما توصیه می‌کنیم از ماژول‌های Node.js برای کد مرورگر اجتناب کنید تا اندازه بسته کاهش یابد، اگرچه می‌توانید پلی‌فیل‌ها را به‌صورت دستی اضافه کنید. اگر ماژول از یک کتابخانه شخص ثالث وارد شده است (که قرار است در مرورگر استفاده شود)، توصیه می‌شود که مشکل را به پشتیبانی کتابخانه مربوطه گزارش دهید.

#### خطای سینتکس / Type Error  رخ می‌دهد

Vite نمی‌تواند کدی را که فقط در non-strict mode اجرا می‌شود (حالت شلخته) را مدیریت کند و از آن پشتیبانی نمی‌کند. این به این دلیل است که Vite از ESM استفاده می‌کند و همیشه [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) درون ESM است.

برای مثال، ممکن است این خطاها را ببینید.

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

اگر این کدها درون وابستگی‌ها استفاده می‌شوند، می‌توانید از [`patch-package`](https://github.com/ds300/patch-package) (یا [`yarn patch`](https://yarnpkg.com/cli/patch) یا [`pnpm patch`](https://pnpm.io/cli/patch)) برای یک راه‌فرار استفاده کنید.

#### افزونه‌های مرورگر

برخی افزونه‌های مرورگر (مانند مسدودکننده‌های تبلیغات) ممکن است مانع از ارسال درخواست‌های کلاینت Vite به سرور توسعه Vite شوند. در این حالت ممکن است یک صفحه سفید بدون خطاهای گزارش‌شده ببینید. اگر این مشکل را دارید، سعی کنید افزونه‌ها

### لینک‌های cross drive در ویندوز

اگر در پروژه شما لینک‌های cross drive وجود داشته باشد، Vite ممکن است کار نکند.

یک مثال از لینک‌های cross drive:

- یک درایو مجازی که با دستور `subst` به یک پوشه لینک شده است
- یک symlink/junction به یک درایو متفاوت با دستور `mklink` (مثال: کش global Yarn)

لینک ارور: [#10802](https://github.com/vitejs/vite/issues/10802)
