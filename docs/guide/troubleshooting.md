# عیب‌یابی

برای اطلاعات بیشتر می‌توانید به [راهنمای عیب‌یابی Rollup](https://rollupjs.org/troubleshooting/) نیز مراجعه کنید.

اگر پیشنهادات ارائه‌شده در این صفحه کار نمی‌کنند، لطفاً سؤالات خود را در [GitHub Discussions](https://github.com/vitejs/vite/discussions) یا در کانال ‎`#help` در [Vite Land Discord](https://chat.vite.dev) ارسال کنید.

## CLI

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'‎`

مسیر پوشه پروژه شما ممکن است شامل `&` باشد، که با `npm` در ویندوز کار نمی‌کند ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

شما نیاز خواهید داشت به:

- تغییر به یک پکیج منیجر دیگر (مانند `pnpm`, `yarn`)
- حذف `&` از مسیر پروژه شما

## پیکربندی

### این پکیج ESM Only است

هنگام ایمپورت کردن یک پکیج ESM Only با `require`، خطای زیر رخ می‌دهد.

> <div dir="ltr">Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.</div>

> <div dir="ltr">Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/dependency.js from /path/to/vite.config.js not supported.</div>
> <div dir="ltr">Instead change the require of index.js in /path/to/vite.config.js to a dynamic import() which is available in all CommonJS modules.</div>

در Node.js نسخه‌های 22 و پایین‌تر، به‌طور پیش‌فرض فایل‌های ESM نمی‌توانند با استفاده از [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require) بارگذاری شوند.

اگرچه ممکن است با استفاده از گزینه [`‎--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require)، یا در نسخه‌های بالای 22 در Node.js یا در رانتایم‌های دیگر این کار امکان‌پذیر باشد، اما همچنان توصیه می‌کنیم که پیکربندی خود را به ESM تبدیل کنید به یکی از روش‌های زیر:

- اضافه‌کردن `"type": "module"` به `package.json`
- تغییر نام `vite.config.js`/`vite.config.ts` به `vite.config.mjs`/`vite.config.mts`

## سرور توسعه

### Requests are stalled forever

اگر از لینوکس استفاده می‌کنید، ممکن است محدودیت‌های توصیف‌گر فایل (file descriptor) و محدودیت‌های inotify باعث این مشکل شوند. ازآنجاکه Vite بیشتر فایل‌ها را باندل نمی‌کند، مرورگرها ممکن است درخواست‌های زیادی ارسال کنند که نیاز به توصیف‌گر فایل زیادی دارند، و این باعث افزایش محدودیت می‌شود.

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

اگر مراحل بالا کار نکرد، می‌توانید `DefaultLimitNOFILE=65536` را به‌عنوان یک پیکربندی غیرکامنت به فایل‌های زیر اضافه کنید:

- ‎/etc/systemd/system.conf
- ‎/etc/systemd/user.conf

برای لینوکس Ubuntu، ممکن است نیاز به اضافه‌کردن خط `‎* - nofile 65536` به فایل `‎/etc/security/limits.conf` به‌جای به‌روزرسانی فایل‌های پیکربندی systemd داشته باشید.

توجه داشته باشید که این تنظیمات پایدار هستند اما **نیاز به راه‌اندازی مجدد دارند**.

به‌طور جایگزین، اگر سرور داخل یک devcontainer در VS Code در حال اجرا است، ممکن است به‌نظر برسد که درخواست‌ها متوقف شده‌اند.
برای رفع این مشکل، به بخش [Dev Containers / VS Code Port Forwarding](#dev-containers--انتقال-پورت-vs-code) مراجعه کنید.

### Network requests stop loading

هنگام استفاده از یک گواهی SSL خودامضا، Chrome تمام دستورات کش را نادیده می‌گیرد و محتوا را دوباره بارگذاری می‌کند. Vite به این دستورات کش متکی است.

برای حل این مشکل از یک گواهی SSL معتبر استفاده کنید.

یا میتوانید به این لینک ها مراجعه کنید: [مشکلات کش](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html)، [مشکل Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

می‌توانید یک گواهی معتبر را از طریق CLI با این فرمان نصب کنید:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

یا با واردکردن آن به اپلیکیشن Keychain Access و به‌روزرسانی اعتماد گواهی خود به "Always Trust"

### 431 Request Header Fields Too Large

هنگامی که سرور / سرور WebSocket یک هدر HTTP بزرگ دریافت می‌کند، درخواست رد شده و هشدار زیر نمایش داده می‌شود.

> <div dir="ltr">Server responded with status code 431. See https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.</div>

این به این دلیل است که Node.js اندازه هدر درخواست را برای کاهش [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) محدود می‌کند.

برای اجتناب از این مشکل، سعی کنید اندازه هدر درخواست خود را کاهش دهید. به عنوان مثال، اگر کوکی طولانی است، آن را حذف کنید. یا می‌توانید از [`‎--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) برای تغییر حداکثر اندازه هدر استفاده کنید.

### Dev Containers / انتقال پورت VS Code

اگر از Dev Container یا قابلیت انتقال پورت در VS Code استفاده می‌کنید، ممکن است نیاز به تنظیم گزینه [`server.host`](/config/server-options.md#server-host) به `127.0.0.1` در تنظیمات داشته باشید تا کار کند.

این به این دلیل است که [قابلیت انتقال پورت در VS Code از IPv6 پشتیبانی نمی‌کند](https://github.com/microsoft/vscode-remote-release/issues/7029).

برای جزئیات بیشتر، به [‎#16522](https://github.com/vitejs/vite/issues/16522) مراجعه کنید.

## HMR

### Vite تغییر فایل را تشخیص می‌دهد اما HMR کار نمی‌کند

ممکن است فایلی را با یک حالت متفاوت ایمپورت کنید. به عنوان مثال، `src/foo.js` وجود دارد و `src/bar.js` شامل:

```js
import './Foo.js' // باشد './foo.js' باید
```

لینک ارور: [‎#964](https://github.com/vitejs/vite/issues/964)

### Vite تغییر فایل را تشخیص نمی‌دهد

اگر از Vite در محیط WSL2 استفاده می‌کنید، در برخی شرایط Vite قادر به نظارت بر تغییرات فایل‌ها نخواهد بود. برای اطلاعات بیشتر به گزینه [`server.watch`]( /config/server-options.md#server-watch) مراجعه کنید.

### به‌جای HMR، بارگذاری کامل انجام می‌شود

اگر HMR توسط Vite یا پلاگینی مدیریت نشود، بارگذاری کامل انجام خواهد شد زیرا این تنها راه برای تازه‌سازی برنامه است.

اگر HMR مدیریت شود، اما در داخل یک وابستگی حلقه‌ای قرار داشته باشد، یک بارگذاری کامل نیز برای بازیابی ترتیب اجرای برنامه رخ خواهد داد. برای حل این مشکل، سعی کنید حلقه وابستگی را بشکنید. اگر تغییر فایلی باعث این مشکل شده است، می‌توانید دستور `vite --debug hmr` را اجرا کنید تا مسیر وابستگی حلقه‌ای ثبت شود.

## بیلد

### فایل بیلد شده به دلیل خطای CORS کار نمی‌کند

اگر فایل HTML خروجی با پروتکل `file` باز شود، اسکریپت‌ها با خطای زیر مواجه شده و اجرا نخواهند شد.

> <div dir="ltr">Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.</div>

> <div dir="ltr">Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).</div>

برای اطلاعات بیشتر در مورد اینکه چرا این اتفاق می‌افتد، به [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) مراجعه کنید.

شما باید به فایل با پروتکل `http` دسترسی پیدا کنید. آسان‌ترین راه برای انجام این کار اجرای `npx vite preview` است.

## وابستگی‌های بهینه‌سازی‌شده

### لینک شدن پکیج های قدیمی به پکیج های لوکال

کلید هش استفاده‌شده برای باطل کردن وابستگی‌های بهینه‌شده بستگی به محتوای package lock، وصله‌های اعمال‌شده به وابستگی‌ها و گزینه‌های موجود در فایل پیکربندی Vite که بر روی باندل ماژول‌های نود تأثیر می‌گذارد، دارد. این به این معنی است که Vite وقتی یک وابستگی با استفاده از ویژگی‌ای مانند [overrides npm](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) بازنویسی می‌شود، آن را شناسایی خواهد کرد و وابستگی‌های شما را در شروع بعدی سرور دوباره باندل می‌کند. Vite وقتی که از ویژگی‌ای مانند [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) استفاده می‌کنید، وابستگی‌ها را باطل نمی‌کند. در صورت لینک یا unlink یک وابستگی، باید بهینه‌سازی مجدد را در شروع بعدی سرور با استفاده از `vite --force` انجام دهید. ما توصیه می‌کنیم از overrides استفاده کنید که اکنون توسط همه پکیج منیجرها پشتیبانی می‌شود (همچنین به [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) و [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions) مراجعه کنید).

## گلوگاه‌های عملکرد

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

بازرسی کننده Node.js فایل `vite-profile-0.cpuprofile` را در پوشه اصلی ایجاد می‌کند، به <https://www.speedscope.app> بروید و پروفایل CPU را با استفاده از دکمه `BROWSE` بارگذاری کنید تا نتیجه را بررسی کنید.

می‌توانید [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) را نصب کنید که به شما اجازه می‌دهد وضعیت میانی پلاگین‌های Vite را بازرسی کنید و همچنین به شما کمک می‌کند تا مشخص کنید کدام پلاگین‌ها یا میان‌افزارها در اپلیکیشن‌های شما گلوگاه هستند. این پلاگین می‌تواند در حالت‌های توسعه و ساخت استفاده شود. فایل readme را برای جزئیات بیشتر بررسی کنید.

## سایر موارد

### ماژول خارجی برای سازگاری با مرورگر

هنگامی که از یک ماژول Node.js در مرورگر استفاده می‌کنید، Vite هشدار زیر را خروجی می‌دهد.

> <div dir="ltr">Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.</div>

این به این دلیل است که Vite به‌صورت خودکار ماژول‌های Node.js را پلی‌فیل نمی‌کند.

ما توصیه می‌کنیم از ماژول‌های Node.js برای کد مرورگر اجتناب کنید تا اندازه بسته کاهش یابد، اگرچه می‌توانید پلی‌فیل‌ها را به‌صورت دستی اضافه کنید. اگر ماژول از یک کتابخانه شخص ثالث وارد شده است (که قرار است در مرورگر استفاده شود)، توصیه می‌شود که مشکل را به پشتیبانی کتابخانه مربوطه گزارش دهید.

### خطای سینتکس / Type Error رخ می‌دهد

Vite نمی‌تواند کدی را که فقط در non-strict mode اجرا می‌شود (حالت غیر-سخت‌گیر) را مدیریت کند و از آن پشتیبانی نمی‌کند. این به این دلیل است که Vite از ESM استفاده می‌کند و همیشه [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) درون ESM فعال است.

برای مثال، ممکن است این خطاها را ببینید.

> <div dir="ltr">[ERROR] With statements cannot be used with the "esm" output format due to strict mode</div>

> <div dir="ltr">TypeError: Cannot create property 'foo' on boolean 'false'</div>

اگر این کدها درون وابستگی‌ها استفاده می‌شوند، می‌توانید از [`patch-package`](https://github.com/ds300/patch-package) (یا [`yarn patch`](https://yarnpkg.com/cli/patch) یا [`pnpm patch`](https://pnpm.io/cli/patch)) برای یک راه‌فرار استفاده کنید.

### افزونه‌های مرورگر

برخی از افزونه‌های مرورگر (مانند مسدودکننده‌های تبلیغات) ممکن است از ارسال درخواست‌ها از کلاینت Vite به سرور توسعه Vite جلوگیری کنند. در این صورت، ممکن است صفحه سفید بدون خطاهای ثبت‌شده مشاهده کنید. اگر با این مشکل روبه‌رو هستید، امتحان کنید که افزونه‌ها را غیرفعال کنید.

### لینک‌های cross drive در ویندوز

اگر در پروژه شما لینک‌های cross drive وجود داشته باشد، Vite ممکن است کار نکند.

یک مثال از لینک‌های cross drive:

- یک درایو مجازی که با دستور `subst` به یک پوشه لینک شده است
- یک symlink/junction به یک درایو متفاوت با دستور `mklink` (مثال: کش global Yarn)

لینک ارور: [‎#10802](https://github.com/vitejs/vite/issues/10802)

<script setup lang="ts">
// redirect old links with hash to old version docs
if (typeof window !== "undefined") {
  const hashForOldVersion = {
    'vite-cjs-node-api-deprecated': 6
  }

  const version = hashForOldVersion[location.hash.slice(1)]
  if (version) {
    // update the scheme and the port as well so that it works in local preview (it is http and 4173 locally)
    location.href = `https://v${version}.vite.dev` + location.pathname + location.search + location.hash
  }
}
</script>
