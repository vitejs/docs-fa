# API محیط برای پلاگین‌ها

:::warning آزمایشی
Environment API در حال حاضر آزمایشی است. ما این API ها را در طول نسخه Vite 6 ثابت نگه می‌داریم تا اکوسیستم بتواند آن را آزمایش کند و بر روی آن توسعه دهد. برنامه ما این است که این APIهای جدید را در Vite 7 با تغییرات احتمالی نهایی کنیم.

منابع:

- [بحث و گفتگو](https://github.com/vitejs/vite/discussions/16358) جایی که ما در حال جمع‌آوری نظرات درباره APIهای جدید هستیم.
- [PR مربوط به Environment API](https://github.com/vitejs/vite/pull/16471) جایی که API جدید پیاده‌سازی و بررسی شده است.

لطفاً نظرات و بازخوردهای خود را با ما به اشتراک بگذارید.
:::

## دسترسی به محیط فعلی در هوک‌ها

از آنجا که تا نسخه Vite 6 فقط دو محیط وجود داشت (`client` و `ssr`)، یک بولین `ssr` برای شناسایی محیط فعلی در APIهای Vite کافی بود. هوک‌های پلاگین یک بولین `ssr` را در آخرین پارامتر گزینه‌ها دریافت می‌کردند و API ها انتظار داشتند که یک پارامتر `ssr` اختیاری برای ارتباط صحیح ماژول‌ها با محیط مناسب ارائه شود (برای مثال `server.moduleGraph.getModuleByUrl(url, { ssr })`).

با معرفی محیط‌های قابل پیکربندی، اکنون یک روش یکنواخت برای دسترسی به گزینه‌ها و نمونه‌های محیط در پلاگین‌ها وجود دارد. هوک‌های پلاگین اکنون `this.environment` را در کانتکست خود ارائه می‌دهند و APIهایی که قبلاً به یک بولین `ssr` نیاز داشتند، اکنون به محیط مناسب محدود شده‌اند (برای مثال `environment.moduleGraph.getModuleByUrl(url)`).

سرور Vite یک مسیر پردازش پلاگین مشترک دارد، اما زمانی که یک ماژول پردازش می‌شود، همیشه در کانتکست یک محیط مشخص انجام می‌شود. نمونه `environment` در کانتکست پلاگین در دسترس است.

یک پلاگین می‌تواند از نمونه `environment` برای تغییر نحوه پردازش یک ماژول بر اساس پیکربندی محیط استفاده کند (که می‌توان از طریق `environment.config` به آن دسترسی داشت).

```ts
  transform(code, id) {
    console.log(this.environment.config.resolve.conditions)
  }
```

## ثبت محیط‌های جدید با استفاده از هوک‌ها

پلاگین‌ها می‌توانند محیط‌های جدیدی را در هوک `config` اضافه کنند (برای مثال، برای داشتن یک گراف ماژول جداگانه برای [RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)):

```ts
  config(config: UserConfig) {
    config.environments.rsc ??= {}
  }
```

یک آبجکت خالی برای ثبت محیط کافی است، زیرا مقادیر پیش‌فرض از تنظیمات محیط از ریشه گرفته می‌شوند.

## پیکربندی محیط با استفاده از هوک‌ها

در زمان اجرای هوک `config`، لیست کامل محیط‌ها هنوز مشخص نیست و محیط‌ها می‌توانند تحت تأثیر مقادیر پیش‌فرض از تنظیمات محیط در سطح ریشه یا به صورت صریح از طریق رکورد `config.environments` قرار گیرند. پلاگین‌ها باید مقادیر پیش‌فرض را با استفاده از هوک `config` تنظیم کنند.
برای پیکربندی هر محیط، می‌توانند از هوک جدید `configEnvironment` استفاده کنند. این هوک برای هر محیط با تنظیمات جزئی اضافه‌شده آن، شامل مقادیر پیش‌فرض نهایی، فراخوانی می‌شود.

```ts
  configEnvironment(name: string, options: EnvironmentOptions) {
    if (name === 'rsc') {
      options.resolve.conditions = // ...
```

## هوک `hotUpdate`

- **تایپ:** `‎(this: { environment: DevEnvironment }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>‎`
- **همچنین ببینید:** [HMR API](./api-hmr)

هوک `hotUpdate` به پلاگین‌ها اجازه می‌دهد تا مدیریت به‌روزرسانی HMR سفارشی را برای یک محیط خاص انجام دهند. زمانی که یک فایل تغییر می‌کند، الگوریتم HMR برای هر محیط به ترتیب موجود در `server.environments` به صورت سری اجرا می‌شود، بنابراین هوک `hotUpdate` چندین بار فراخوانی خواهد شد. این هوک یک آبجکت کانتکست با امضای زیر دریافت می‌کند:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- `this.environment` محیط اجرایی ماژول است که در آن به‌روزرسانی فایل در حال پردازش است.

- `modules` آرایه‌ای از ماژول‌ها در این محیط است که تحت تأثیر فایل تغییر یافته قرار گرفته‌اند. این آرایه شامل چندین ماژول است، زیرا یک فایل ممکن است به چندین ماژول سرو شده نگاشت شود (مثلاً در Vue SFCها).

- `read` یک تابع خواندن غیرهمزمان است که محتوای فایل را برمی‌گرداند. این تابع ارائه شده است زیرا در برخی سیستم‌ها، ممکن است callback تغییر فایل خیلی سریع اجرا شود، قبل از اینکه ویرایشگر فایل را به‌طور کامل به‌روزرسانی کند، و در این حالت استفاده مستقیم از `fs.readFile` محتوای خالی برمی‌گرداند. تابع `read` این رفتار را نرمال‌سازی می‌کند.

این هوک می‌تواند:

- لیست ماژول‌های تحت تأثیر را فیلتر کرده و محدود کند تا HMR دقیق‌تر انجام شود.

- یک آرایه خالی برگرداند و بارگذاری کامل را انجام دهد:

  ```js
  hotUpdate({ modules, timestamp }) {
    if (this.environment.name !== 'client')
      return

    // Invalidate modules manually
    const invalidatedModules = new Set()
    for (const mod of modules) {
      this.environment.moduleGraph.invalidateModule(
        mod,
        invalidatedModules,
        timestamp,
        true
      )
    }
    this.environment.hot.send({ type: 'full-reload' })
    return []
  }
  ```

- آرایه خالی برگردانید و مدیریت کامل HMR سفارشی را با ارسال رویدادهای سفارشی به کلاینت انجام دهید:

  ```js
  hotUpdate() {
    if (this.environment.name !== 'client')
      return

    this.environment.hot.send({
      type: 'custom',
      event: 'special-update',
      data: {}
    })
    return []
  }
  ```

  کد کلاینت باید با استفاده از [HMR API](./api-hmr) هندلر مربوطه را ثبت کند (این کار می‌تواند توسط هوک `transform` همان پلاگین انجام شود):

  ```js
  if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
      // perform custom update
    })
  }
  ```

## پلاگین‌های مخصوص هر محیط

یک پلاگین می‌تواند مشخص کند که در کدام محیط‌ها باید اعمال شود، با استفاده از تابع `applyToEnvironment`.

```js
const UnoCssPlugin = () => {
  // مشترک سراسری state
  return {
    buildStart() {
      // WeakMap<Environment, Data> مقداردهی وضعیت مخصوص هر محیط با
      // this.environment با استفاده از
    },
    configureServer() {
      // استفاده از هوک‌های سراسری به صورت معمول
    },
    applyToEnvironment(environment) {
      // برگردانید true اگر این پلاگین باید در این محیط فعال باشد، مقدار
      // یا یک پلاگین جدید برای جایگزینی آن برگردانید
      // اگر این هوک استفاده نشود، پلاگین در همه محیط‌ها فعال خواهد بود
    },
    resolveId(id, importer) {
      // فقط برای محیط‌هایی که این پلاگین در آن‌ها اعمال می‌شود، فراخوانی می‌شود
    },
  }
}
```

اگر یک پلاگین از محیط آگاه نباشد و دارای وضعیتی باشد که بر اساس محیط فعلی کلیدگذاری نشده است، هوک `applyToEnvironment` امکان تبدیل آن به یک پلاگین مخصوص هر محیط را به‌سادگی فراهم می‌کند.

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    {
      name: 'per-environment-plugin',
      applyToEnvironment(environment) {
        return nonShareablePlugin({ outputName: environment.name })
      },
    },
  ],
})
```

Vite یک تابع کمکی به نام `perEnvironmentPlugin` ارائه می‌دهد تا مواردی که نیازی به هوک‌های دیگر ندارند، ساده‌تر کند:

```js
import { nonShareablePlugin } from 'non-shareable-plugin'

export default defineConfig({
  plugins: [
    perEnvironmentPlugin('per-environment-plugin', (environment) =>
      nonShareablePlugin({ outputName: environment.name }),
    ),
  ],
})
```

## محیط در هوک‌های بیلد

مشابه حالت توسعه، هوک‌های پلاگین در زمان بیلد نیز نمونه محیط را دریافت می‌کنند و جایگزین بولین `ssr` می‌شوند. این موضوع برای هوک‌هایی مانند `renderChunk` ، `generateBundle` و سایر هوک‌های مختص بیلد نیز کار می‌کند.

## پلاگین‌های مشترک در زمان بیلد

قبل از Vite 6، مسیر اجرا پلاگین‌ها در حالت توسعه و بیلد به صورت متفاوت عمل می‌کرد:

- **در زمان توسعه:** پلاگین‌ها مشترک بودند.
- **در زمان بیلد:** پلاگین‌ها برای هر محیط جداگانه بودند (در فرآیندهای مختلف: `vite build` سپس `vite build --ssr`).

این موضوع باعث می‌شد فریم‌ورک‌ها برای به اشتراک‌گذاری وضعیت بین بیلد `client` و بیلد `ssr` از فایل‌های مانیفست نوشته‌شده در فایل سیستم استفاده کنند. در Vite 6، اکنون تمام محیط‌ها در یک فرآیند واحد بیلد می‌شوند، بنابراین مسیر اجرا پلاگین‌ها و ارتباط بین محیط‌ها می‌تواند با حالت توسعه هماهنگ شود.

در نسخه‌های اصلی آینده (7 یا 8)، هدف ما دستیابی به هماهنگی کامل است:

- **در هر دو حالت توسعه و بیلد:** پلاگین‌ها مشترک خواهند بود، با [فیلتر کردن مخصوص هر محیط](#پلاگینهای-مخصوص-هر-محیط).

همچنین یک نمونه مشترک از `ResolvedConfig` در زمان بیلد وجود خواهد داشت که امکان کش کردن در سطح کل فرآیند بیلد برنامه را فراهم می‌کند، مشابه کاری که در زمان توسعه با `WeakMap<ResolvedConfig, CachedData>‎` انجام می‌دهیم.

برای Vite 6، ما نیاز داریم یک گام کوچک‌تر برداریم تا سازگاری با نسخه‌های قبلی حفظ شود. پلاگین‌های اکوسیستم در حال حاضر از `config.build` به جای `environment.config.build` برای دسترسی به تنظیمات استفاده می‌کنند، بنابراین به صورت پیش‌فرض باید یک `ResolvedConfig` جدید برای هر محیط ایجاد کنیم. یک پروژه می‌تواند با تنظیم `builder.sharedConfigBuild` روی `true`، به اشتراک‌گذاری کامل تنظیمات و  مسیر اجرا پلاگین‌ها را فعال کند.

این گزینه در ابتدا فقط برای یک زیرمجموعه کوچک از پروژه‌ها کار خواهد کرد، بنابراین نویسندگان پلاگین می‌توانند برای یک پلاگین خاص با تنظیم فلگ `sharedDuringBuild` روی `true`، اشتراک‌گذاری آن را فعال کنند. این امکان به راحتی به اشتراک‌گذاری وضعیت برای پلاگین‌های معمولی را فراهم می‌کند:

```js
function myPlugin() {
  // بین تمام محیط‌ها در حالت توسعه و بیلد state اشتراک‌گذاری

  const sharedState = ...
  return {
    name: 'shared-plugin',
    transform(code, id) { ... },

    // فعال‌سازی یک نمونه مشترک برای تمام محیط‌ها در زمان بیلد
    sharedDuringBuild: true,
  }
}
```
