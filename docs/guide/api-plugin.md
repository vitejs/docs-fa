#  پلاگین API

پلاگین‌های Vite بر پایه‌ی رابط پلاگین‌های Rollup ساخته شده‌اند و چند گزینه‌ی اضافی مخصوص Vite را ارائه می‌کنند. به همین دلیل، می‌توانید یک پلاگین Vite بنویسید که هم در محیط توسعه و هم در زمان  Build قابل استفاده باشد.

 **پیشنهاد می‌شود قبل از مطالعه این بخش به مستندات [RollUp's plugin](https://rollupjs.org/plugin-development/) مراجعه کنید.**

## ساخت یک پلاگین

Vite الگوهای از پیش تعریف‌ شده‌ای  را ارائه می‌دهد، پس قبل از ساخت یک پلاگین جدید، حتماً [راهنمای ویژگی‌ها](https://vite.dev/guide/features) را بررسی کنید تا ببینید آیا نیاز شما قبلاً پوشش داده شده است یا خیر. همچنین، پلاگین‌هایی موجود در   جامعه‌ی توسعه‌دهندگان را بررسی کنید؛[پلاگین‌های سازگار با Rollup](https://github.com/rollup/awesome) و [ پلاگین‌های مخصوص  Vite](https://github.com/vitejs/awesome-vite#plugins).

هنگام ایجاد یک پلاگین، می‌توانید آن را مستقیماً در فایل `vite.config.js` خود تعریف کنید. نیازی به ایجاد یک پکیج جداگانه نیست. اما اگر می‌خواهید  که از پلاگین خود در پروژه‌های مختلف استفاده شود، می‌توانید آن را به اشتراک بگذارید تا به [دیگر توسعه‌دهندگان](https://chat.vite.dev) کمک کنید.

::: tip
هنگام یادگیری، دیباگ کردن یا ساخت پلاگین‌ها، توصیه می‌کنیم از [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) در پروژه‌ی خود استفاده کنید. این پلاگین به شما امکان مشاهده وضعیت  پلاگین‌های Vite را می‌دهد. پس از نصب، می‌توانید با مراجعه به `localhost:5173/__inspect/` ماژول‌ها و فرآیند تغییرات پروژه‌ی خود را بررسی کنید. برای اطلاعات بیشتر، به [مستندات vite-plugin-inspect/](https://github.com/antfu/vite-plugin-inspect) مراجعه کنید.
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## قراردادها

اگر پلاگین شما از هوک‌های اختصاصی Vite استفاده نمی‌کند  می‌تواند به‌عنوان یک [ پلاگین سازگار با Rollup](#rollup-plugin-compatibility)  پیاده‌ سازی شود، توصیه می‌شود از [قراردادهای نام‌گذاری پلاگین‌های Rollup](https://rollupjs.org/plugin-development/#conventions)  پیروی کنید.

- نام پلاگین باید واضح باشد و با پیشوند `-rollup-plugin` شروع شود.
- در فایل `package.json`، کلمات کلیدی `rollup-plugin` و `vite-plugin` را اضافه کنید.

این کار باعث می‌شود پلاگین شما نه‌تنها در Vite، بلکه در Rollup خالص یا پروژه‌های 
مبتنی بر WMR نیز قابل استفاده باشد.


برای پلاگین‌های اختصاصی Vite:

- نام پلاگین باید واضح باشد و با پیشوند `-vite-plugin` شروع شود.
- در فایل package.json، کلیدواژه‌ی `vite-plugin` را اضافه کنید.
- در مستندات پلاگین توضیح دهید که چرا این پلاگین فقط مخصوص Vite است (مثلاً اگر از هوک‌های مخصوص Vite استفاده می‌کند).

اگر پلاگین شما فقط برای یک فریمورک خاص طراحی شده است، نام آن باید شامل نام فریمورک باشد:

- `-vite-plugin-vue` برای پلاگین‌های Vue
- `-vite-plugin-react` برای پلاگین‌های React
- `-vite-plugin-svelte` برای پلاگین‌های Svelte

برای اطلاعات بیشتر، به بخش [قراردادهای ماژول‌های مجازی](#virtual-modules-convention) مراجعه کنید.

## تنظیمات پلاگین‌ها

 پلاگین‌ها به `devDependencies` پروژه اضافه می‌شود و از طریق آرایه‌ی `plugins` پیکربندی می‌شود.

```js [vite.config.js]
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()],
})
```

پلاگین‌های Falsy نادیده گرفته می‌شوند، بنابراین می‌توان از این ویژگی برای فعال یا غیرفعال کردن پلاگین‌ها استفاده کرد.

آرایه‌ی `plugins`  از پیش‌تنظیم‌ها پشتیبانی می‌کند که شامل چندین پلاگین در یک عنصر واحد هستند. این ویژگی برای قابلیت‌های پیچیده (مانند یکپارچه‌سازی با فریمورک‌ها) که از چند پلاگین تشکیل شده‌اند، مفید است. این آرایه به‌صورت داخلی تبدیل به یک لیست مسطح (Flattened) خواهد شد.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()],
})
```

## مثال های ساده

:::tip
طبق یک قرارداد رایج، پلاگین‌های Vite/Rollup به‌صورت تابع کارخانه‌ای (Factory Function) نوشته می‌شوند که  پلاگین را به صورت یک شئ بازمی‌گرداند. این تابع می‌تواند گزینه‌هایی (Options) را بپذیرد که به کاربران اجازه می‌دهد پلاگین را سفارشی‌سازی کنند.
:::

### تبدیل انواع فایل‌های سفارشی

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null, // provide source map if available
        }
      }
    },
  }
}
```

### استفاده از یک فایل مجازی

مثال‌ها را در [بخش بعدی](#virtual-modules-convention) ببینید.

## قرارداد ماژول‌های مجازی

ماژول‌های مجازی یک طرح مفید هستند که به شما این امکان را می‌دهند تا اطلاعات زمان ساخت را به فایل‌های منبع با استفاده از  ESM ارسال کنید.

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    },
  }
}
```

که این امکان را فراهم می‌کند تا از ماژول  در جاوااسکریپت استفاده کنید:

```js
import { msg } from 'virtual:my-module'

console.log(msg)
```

ماژول‌های مجازی در Vite (و Rollup) به‌طور قراردادی با پیشوند `virtual` شروع می‌شوند: برای مسیرهای قابل مشاهده توسط کاربر آغاز می‌شوند. اگر ممکن باشد، باید از نام پلاگین به‌عنوان یک فضای نام  برای جلوگیری از تداخل با پلاگین‌های دیگر در اکوسیستم استفاده کرد. به‌عنوان مثال، یک `vite-plugin-posts` ممکن است از کاربران بخواهد که `virtual:posts` یا `virtual:posts/helpers` را به‌عنوان ماژول‌های مجازی وارد کنند تا اطلاعات زمان ساخت را دریافت کنند.

از نظر داخلی، پلاگین‌هایی که از ماژول‌های مجازی استفاده می‌کنند باید شناسه ماژول را هنگام حل کردن، با پیشوند `\0` علامت‌گذاری کنند. این یک قرارداد از اکوسیستم Rollup است که از پردازش شناسه توسط سایر پلاگین‌ها (مانند Node resolution) جلوگیری می‌کند. همچنین ویژگی‌های اصلی مانند sourcemaps می‌توانند از این اطلاعات برای تمایز میان ماژول‌های مجازی و فایل‌های معمولی استفاده کنند. `\0`به‌عنوان یک کاراکتر مجاز در آدرس‌های واردات شناخته نمی‌شود، بنابراین هنگام تجزیه و تحلیل واردات باید آن را جایگزین کنیم. شناسه ماژول مجازی با `\0{id}` در نهایت در توسعه در مرورگر به صورت `/@id/__x00__{id}` کدگذاری می‌شود. این شناسه قبل از وارد شدن به پایپ‌لاین پلاگین‌ها مجدداً رمزگشایی می‌شود، بنابراین این مورد توسط کدهای هوک پلاگین‌ها دیده نمی‌شود.

توجه داشته باشید که ماژول‌هایی که به‌طور مستقیم از یک فایل واقعی مشتق شده‌اند، مانند ماژول اسکریپت در یک کامپوننت تک‌ فایلی (مانند فایل‌های .vue یا .svelte)، نیازی به پیروی از این قرارداد ندارند. کامپوننت‌های تک‌فایلی معمولاً مجموعه‌ای از زیرماژول‌ها را هنگام پردازش تولید می‌کنند، اما کد در این ماژول‌ها می‌تواند به سیستم فایل بازگردانده شود. استفاده از `\0` برای این زیرماژول‌ها باعث می‌شود که sourcemaps به‌درستی کار نکند.

## هوک‌های عمومی

در زمان توسعه، سرور توسعه Vite یک کانتینر پلاگین ایجاد می‌کند که [هوک‌های ساخت Rollup](https://rollupjs.org/plugin-development/#build-hooks) را به همان شیوه‌ای که Rollup انجام می‌دهد، فراخوانی می‌کند.

هوک‌های زیر یک‌بار در زمان شروع سرور فراخوانی می‌شوند:

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

هوک‌های زیر برای هر درخواست ماژول فراخوانی می‌شوند:

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

این هوک‌ها همچنین دارای پارامتر `options` گسترش‌یافته‌ای هستند که شامل ویژگی‌های خاص Vite می‌شود. برای اطلاعات بیشتر می‌توانید به[ مستندات SSR](/guide/ssr#ssr-specific-plugin-logic) مراجعه کنید.

برخی از فراخوانی‌های `resolveId` ممکن است مقدار `importer` به‌صورت مسیر مطلق برای یک `index.html` عمومی در ریشه باشند، زیرا همیشه ممکن نیست importer واقعی را به‌دلیل الگوی سرور توسعه بدون بسته‌بندی Vite استخراج کرد. برای واردات‌هایی که در داخل پایپ‌لاین  Vite پردازش می‌شوند، importer می‌تواند در طول مرحله تحلیل واردات پیگیری شود و مقدار صحیح `importer` را فراهم کند.

هوک‌های زیر هنگامی که سرور بسته می‌شود، فراخوانی می‌شوند:

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

توجه داشته باشید که هوک [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) در زمان توسعه **فراخوانی نمی‌شود**، زیرا Vite برای بهبود عملکرد از تجزیه کامل AST اجتناب می‌کند.

هوک‌های تولید خروجی [Output Generation Hooks](https://rollupjs.org/plugin-development/#output-generation-hooks) (به‌جز `closeBundle`) در زمان توسعه **فراخوانی نمی‌شوند**. شما می‌توانید سرور توسعه Vite را به‌عنوان فراخوانی فقط `rollup.rollup()` بدون فراخوانی `bundle.generate()` در نظر بگیرید.

## هوک های مخصوص Vite

پلاگین‌های Vite می‌توانند هوک‌هایی ارائه دهند که مخصوص Vite هستند. این هوک‌ها توسط Rollup نادیده گرفته می‌شوند.

### `config`

- **نوع:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **نوع اجرا:** `async`, `sequential`

این هوک به شما امکان می‌دهد قبل از اینکه پیکربندی Vite نهایی شود، آن را تغییر دهید. این هوک پیکربندی اولیه کاربر (ترکیب گزینه‌های خط فرمان و فایل پیکربندی) و همچنین محیط جاری پیکربندی را دریافت می‌کند که شامل `mode` و `command` است. می‌تواند یک شیء پیکربندی جزئی را بازگرداند که در پیکربندی موجود ادغام می‌شود، یا می‌تواند مستقیماً پیکربندی را تغییر دهد (اگر ادغام پیش‌فرض نتیجه مطلوب را ارائه ندهد).

  **مثال:**

  ```js
  // return partial config (recommended)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      resolve: {
        alias: {
          foo: 'bar',
        },
      },
    }),
  })

  // mutate the config directly (use only when merging doesn't work)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    },
  })
  ```

  ::: warning Note
  پلاگین‌های کاربر قبل از اجرای این هوک پردازش می‌شوند، بنابراین اضافه کردن پلاگین‌های دیگر داخل هوک `config` تأثیری نخواهد داشت.
  :::

### `configResolved`

- **نوع:** `(config: ResolvedConfig) => void | Promise<void>`
- **نوع اجرا:** `async`, `parallel`

این هوک بعد از نهایی شدن تنظیمات Vite اجرا می‌شود. از این هوک برای خواندن و ذخیره تنظیمات نهایی استفاده کنید. همچنین زمانی مفید است که پلاگین نیاز دارد بر اساس دستوری که اجرا شده رفتار متفاوتی داشته باشد.

  **مثال:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // store the resolved config
        config = resolvedConfig
      },

      // use stored config in other hooks
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: plugin invoked by dev server
        } else {
          // build: plugin invoked by Rollup
        }
      },
    }
  }
  ```

  در نظر داشته باشید که مقدار `command` در حالت توسعه (dev) معادل `serve` است (در cli، دستورات `vite`، `vite dev` و `vite serve` معادل هم هستند).

### `configureServer`

- **نوع:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **نوع اجرا:** `async`, `sequential`
- **همچنین ببینید:** [ViteDevServer](./api-javascript#vitedevserver)

این هوک برای پیکربندی سرور توسعه استفاده می‌شود. رایج‌ترین کاربرد آن افزودن میان‌افزارهای (middlewares) سفارشی به برنامه داخلی [connect](https://github.com/senchalabs/connect) است:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // custom handle request...
      })
    },
  })
  ```

  **افزودن میان‌افزار***

هوک `configureServer` قبل از نصب میان‌افزارهای داخلی اجرا می‌شود، بنابراین میان‌افزارهای سفارشی به‌صورت پیش‌فرض قبل از میان‌افزارهای داخلی اجرا خواهند شد. اگر بخواهید یک میان‌افزار را **بعد از** میان‌افزارهای داخلی اضافه کنید، می‌توانید یک تابع از `configureServer` بازگردانید. این تابع پس از نصب میان‌افزارهای داخلی فراخوانی خواهد شد:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // return a post hook that is called after internal middlewares are
      // installed
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        })
      }
    },
  })
  ```

  **ذخیره دسترسی به سرور***

  در برخی موارد، سایر هوک‌های پلاگین ممکن است به نمونه سرور توسعه دسترسی داشته باشند (مثلاً برای دسترسی به سرور web socket، پایشگر سیستم فایل، یا گراف ماژول‌ها). این هوک می‌تواند برای ذخیره نمونه سرور و استفاده از آن در سایر هوک‌ها نیز استفاده شود:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // use server...
        }
      },
    }
  }
  ```

  توجه داشته باشید که `configureServer`هنگام اجرای نسخه نهایی فراخوانی نمی‌شود، بنابراین سایر هوک‌های شما باید مراقب نبود آن باشند.

### `configurePreviewServer`

- **نوع:** `(server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>`
- **نوع اجرا:** `async`, `sequential`
- **همچنین ببینید:** [PreviewServer](./api-javascript#previewserver)

این هوک مشابه [`configureServer`](/guide/api-plugin.html#configureserver) است اما برای سرور پیش‌نمایش (preview server) استفاده می‌شود. درست مانند `configureServer،` این هوک قبل از نصب سایر میان‌افزارها اجرا می‌شود.
اگر می‌خواهید یک میان‌افزار را بعد از سایر میان‌افزارها اضافه کنید، می‌توانید یک تابع از `configurePreviewServer` برگردانید که بعد از نصب میان‌افزارهای داخلی فراخوانی خواهد شد:

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // return a post hook that is called after other middlewares are
      // installed
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        })
      }
    },
  })
  ```

### `transformIndexHtml`

- **نوع:** `IndexHtmlTransformHook | { order?: 'pre' | 'post', handler: IndexHtmlTransformHook }`
- **نوع اجرا:** `async`, `sequential`

این هوک برای تغییر و پردازش فایل‌های HTML مانند `index.html` در نظر گرفته شده است. این هوک مقدار HTML فعلی و یک context transform را دریافت می‌کند.
Context transform در حالت dev شامل نمونه‌ای از [`ViteDevServer`](./api-javascript#vitedevserver) است و در حالت build شامل بسته خروجی Rollup می‌شود.

این هوک می‌تواند async باشد و یکی از موارد زیر را برگرداند:
- رشته HTML تغییر یافته
- یک آرایه از اشیای توصیف‌کننده (`{tag, attr, children}`) که به HTML موجود اضافه شوند. (هر تگ می‌تواند مشخص کند که در کجای صفحه قرار بگیرد، پیش‌فرض: ابتدای `<head>` قرار می‌گیرد.)
- یک شیء شامل هر دو مورد فوق به صورت `{ html, tags }`

به‌طور پیش‌فرض مقدار `order` روی `undefined` تنظیم شده است، به این معنا که این هوک بعد از پردازش HTML اجرا می‌شود.اگر بخواهید یک اسکریپت را به HTML اضافه کنید و این اسکریپت از پردازش پلاگین‌های Vite عبور کند، باید `order: 'pre'` را تنظیم کنید.
و اگر بخواهید هوک شما بعد از همه‌ی هوک‌هایی که مقدار `order` آن‌ها undefined است اجرا شود، `order: 'post'` را تنظیم کنید.

  **مثال:**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`,
        )
      },
    }
  }
  ```

  **امضاء کامل هوک:**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    },
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string | boolean>
    children?: string | HtmlTagDescriptor[]
    /**
     * default: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

  ::: warning Note
   این هوک در صورتی فراخوانی نخواهد شد که از فریم‌ورکی استفاده کنید که مدیریت سفارشی فایل‌های ورودی را انجام می‌دهد (برای مثال [SvelteKit](https://github.com/sveltejs/kit/discussions/8269#discussioncomment-4509145)).
  :::

### `handleHotUpdate`

- **نوع:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`
- **همچنین ببینید:** [HMR API](./api-hmr)

 این هوک برای انجام مدیریت سفارشی بروزرسانی HMR (Hot Module Replacement) استفاده می‌شود. این هوک یک شیء کانتکست دریافت می‌کند که دارای امضای زیر است:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

- `modules`:  آرایه‌ای از ماژول‌ها است که تحت تأثیر فایل تغییر یافته قرار گرفته‌اند. آرایه است زیرا یک فایل ممکن است به چندین ماژول سرو شده مربوط باشد (مثل SFC‌های Vue).

- `read`:  یک تابع خواندن غیرهمزمان است که محتوای فایل را باز می‌گرداند. این تابع فراهم شده است زیرا در برخی سیستم‌ها، callback تغییر فایل ممکن است خیلی سریع اجرا شود پیش از اینکه ویرایشگر فایل را به‌طور کامل به‌روزرسانی کند و فراخوانی مستقیم `fs.readFile` ممکن است محتوای خالی برگرداند. تابع read این رفتار را نرمال می‌کند.

هوک می‌تواند تصمیم بگیرد که:
- لیست ماژول‌های تحت تأثیر را فیلتر کرده و دقیق‌تر کند تا HMR (Hot Module Replacement) دقیق‌تر باشد.
- یک آرایه خالی برگرداند و یک بار بارگذاری کامل انجام دهد:

    ```js
    handleHotUpdate({ server, modules, timestamp }) {
      // Invalidate modules manually
      const invalidatedModules = new Set()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(
          mod,
          invalidatedModules,
          timestamp,
          true
        )
      }
      server.ws.send({ type: 'full-reload' })
      return []
    }
    ```

 - یک آرایه خالی برگرداند و انجام مدیریت کامل HMR سفارشی را با ارسال رویدادهای سفارشی به کلاینت انجام دهد: 

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

 کد کلاینت باید هندلر مربوطه را با استفاده از [API HMR](./api-hmr) ثبت کند (این می‌تواند از طریق هوک transform همان پلاگین اضافه شود):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // perform custom update
      })
    }
    ```

## ترتیب اجرای پلاگین‌ها در Vite

یک پلاگین در Vite می‌تواند ویژگی `enforce` را مشخص کند (مشابه لودرهای Webpack) تا ترتیب اجرای آن را تنظیم کند. مقدار `enforce` می‌تواند `"pre"` یا `"post"`باشد. ترتیب اجرای پلاگین‌ها پس از پردازش به شکل زیر خواهد بود:

- Alias
- پلاگین‌های کاربر با `enforce: 'pre'`
- پلاگین‌های هسته‌ای Vite
- پلاگین‌های کاربر بدون مقدار `enforce`
- پلاگین‌های مربوط به ساخت (build) در Vite
- پلاگین‌های کاربر با `enforce: 'post'`
- پلاگین‌های پس از ساخت Vite (مانند minify، manifest، گزارش‌گیری)

توجه داشته باشید که این ترتیب جدا از ترتیب اجرای هوک‌ها است، زیرا هوک‌ها همچنان مطابق با مقدار `order` خود در [Rollup](https://rollupjs.org/plugin-development/#build-hooks) پردازش می‌شوند.

## برنامه های شرطی

به‌طور پیش‌فرض، پلاگین‌ها هم در حالت توسعه (serve) و هم در حالت بیلد (build) اجرا می‌شوند. اما اگر پلاگین‌ای فقط در یکی از این دو حالت موردنیاز باشد، می‌توان از ویژگی `apply` برای مشخص کردن اینکه پلاگین فقط در `'build'` یا `'serve'` اجرا شود:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build', // or 'serve'
  }
}
```

همچنین می‌توان از یک تابع برای کنترل دقیق‌تر استفاده کرد:

```js
apply(config, { command }) {
  // apply only on build but not for SSR
  return command === 'build' && !config.build.ssr
}
```

## سازگاری با پلاگین‌های Rollup

تعداد قابل توجهی از پلاگین‌های Rollup مستقیماً به عنوان پلاگین Vite کار می‌کنند (مثلاً `@rollup/plugin-alias` یا `@rollup/plugin-json`) اما نه همه آن‌ها، زیرا برخی از هوک‌های پلاگین در یک سرور توسعه بدون باندل معنایی ندارند.
به طور کلی، اگر یک پلاگین Rollup دارای شرایط زیر باشد، باید بدون مشکل به عنوان پلاگین Vite کار کند:

- از هوک [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) استفاده نمی‌کند.
- وابستگی زیاد بین هوک‌های مربوط به فاز باندل و فاز خروجی ندارد.

اگر یک پلاگین Rollup فقط برای مرحله ساخت (build) مناسب باشد، می‌توان آن را در `build.rollupOptions.plugins` مشخص کرد. این کار همان عملکردی را خواهد داشت که یک پلاگین Vite با `enforce: 'post'` و `apply: 'build'` دارد.

همچنین می‌توان یک پلاگین Rollup موجود را با ویژگی‌های مخصوص Vite تقویت کرد:

```js [vite.config.js]
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build',
    },
  ],
})
```

## نرمال‌سازی مسیرها

Vite در هنگام حل شناسه‌ها  مسیرها را نرمال‌سازی می‌کند تا از جداکننده‌های POSIX (`/`) استفاده کند، در حالی که در ویندوز، حجم درایو را حفظ می‌کند. از طرف دیگر، Rollup به‌طور پیش‌فرض مسیرهای حل‌شده را دست‌نخورده نگه می‌دارد، بنابراین شناسه‌های حل‌شده در ویندوز از جداکننده‌های (`\`) win32 استفاده می‌کنند.
با این حال، پلاگین‌های Rollup به‌صورت داخلی از [تابع کمکی `normalizePath`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) از `@rollup/pluginutils` استفاده می‌کنند، که جداکننده‌ها را قبل از انجام مقایسه‌ها به فرمت POSIX تبدیل می‌کند. این بدان معناست که هنگام استفاده از این پلاگین‌ها در Vite، مقادیر `include` و `exclude` در الگوهای پیکربندی و سایر مسیرهای مشابه در مقایسه با شناسه‌های حل‌شده به‌درستی کار می‌کنند.

بنابراین، برای پلاگین‌های Vite، هنگام مقایسه مسیرها با شناسه‌های حل‌شده، مهم است که ابتدا مسیرها را نرمال‌سازی کرده و از جداکننده‌های POSIX (`/`) استفاده کنید. یک تابع کمکی معادل normalizePath نیز از ماژول vite صادر شده است.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## فیلتر کردن، الگوی include/exclude

Vite تابع [`createFilter` از بسته `@rollup/pluginutils`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) را در دسترس قرار می‌دهد تا پلاگین‌ها و یکپارچه‌سازی‌های مخصوص Vite از الگوی استاندارد فیلتر کردن include/exclude استفاده کنند. این الگو در خود هسته Vite نیز به کار می‌رود.

## ارتباط کلاینت-سرور

از نسخه 2.9، Vite ابزارهایی را برای پلاگین‌ها فراهم می‌کند تا به ارتباط با کلاینت‌ها کمک کنند.

### سرور به کلاینت

در سمت پلاگین، می‌توان از `server.ws.send` برای ارسال رویدادها به کلاینت استفاده کرد:

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('connection', () => {
          server.ws.send('my:greetings', { msg: 'hello' })
        })
      },
    },
  ],
})
```

::: tip NOTE
توصیه می‌کنیم **همیشه یک پیشوند** به نام رویدادهای خود اضافه کنید تا از تداخل با سایر پلاگین‌ها جلوگیری شود.
:::

در سمت کلاینت، از [`hot.on`](/guide/api-hmr.html#hot-on-event-cb) برای گوش دادن به رویدادها استفاده کنید:

```ts twoslash
import 'vite/client'
// ---cut---
// client side
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
  })
}
```

### کلاینت به سرور

برای ارسال رویدادها از کلاینت به سرور، می‌توان از [`hot.send`](/guide/api-hmr.html#hot-send-event-payload) استفاده کرد:

```ts
// client side
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

سپس از `server.ws.on` استفاده کنید و به رویدادها در سمت سرور گوش دهید.

```js [vite.config.js]
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          // reply only to the client (if needed)
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      },
    },
  ],
})
```

### TypeScript برای رویدادهای سفارشی

به‌صورت داخلی، Vite نوع payload را از رابط `CustomEventMap` استنتاج می‌کند. می‌توان رویدادهای سفارشی را با گسترش این ساختار  گسترش داد:

:::tip Note
باید هنگام مشخص کردن فایل‌های تعریف ساختار تایپ‌اسکریپت، حتماً پسوند `d.ts.` را اضافه کنید. در غیر این صورت، تایپ‌اسکریپت ممکن است نتواند تشخیص دهد که ساختار فایل چیست.
:::

```ts [events.d.ts]
import 'vite/types/customEvent.d.ts'

declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'event-key': payload
  }
}
```

این تعریف ساختار توسط `<InferCustomEventPayload<T` برای استنتاج نوع داده payload برای رویداد `T` استفاده می‌شود. برای کسب اطلاعات بیشتر در مورد نحوه استفاده از این ساختار، به [مستندات API HMR](./api-hmr#hmr-api) مراجعه کنید.

```ts twoslash
import 'vite/client'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'
declare module 'vite/types/customEvent.d.ts' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
  }
}
// ---cut---
type CustomFooPayload = InferCustomEventPayload<'custom:foo'>
import.meta.hot?.on('custom:foo', (payload) => {
  // The type of payload will be { msg: string }
})
import.meta.hot?.on('unknown:event', (payload) => {
  // The type of payload will be any
})
```
