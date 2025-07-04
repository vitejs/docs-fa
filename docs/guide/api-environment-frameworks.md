# API محیط برای فریم‌ورک‌ها

:::warning آزمایشی
رابط Environment API هنوز در مرحله‌ی آزمایشی (experimental) هست. با این حال، ما تلاش می‌کنیم بین نسخه‌های اصلی (major) پایداری این APIها را حفظ کنیم تا جامعه‌ی توسعه‌دهندگان بتوانند با آن‌ها کار کرده و تجربیات خود را بر اساس آن‌ها توسعه دهند. ما قصد داریم این APIهای جدید را در یکی از نسخه‌های اصلی آینده به حالت پایدار (stable) برسانیم. البته ممکن است در این فرآیند تغییرات شکننده (breaking changes) نیز اعمال شود، اما این کار زمانی انجام خواهد شد که پروژه‌ها و کتابخانه‌های وابسته فرصت کافی برای آزمایش و ارزیابی این قابلیت‌های جدید را داشته باشند.

منابع:

- [بحث و گفتگو](https://github.com/vitejs/vite/discussions/16358) جایی که ما در حال جمع‌آوری نظرات درباره APIهای جدید هستیم.
- [PR مربوط به Environment API](https://github.com/vitejs/vite/pull/16471) جایی که API جدید پیاده‌سازی و بررسی شده است.

لطفاً نظرات و بازخوردهای خود را با ما به اشتراک بگذارید.
:::

## محیط‌ها و فریم‌ورک‌ها

محیط `ssr` و سایر محیط‌های غیرکلاینت به طور پیش‌فرض در زمان توسعه از یک `RunnableDevEnvironment` استفاده می‌کنند. در حالی که این نیاز دارد که رانتایم مشابه با سرور Vite باشد، این روش مشابه با `ssrLoadModule` عمل می‌کند و به فریم‌ورک‌ها اجازه می‌دهد تا مهاجرت کرده و HMR را برای توسعه SSR خود فعال کنند. شما می‌توانید هر محیط اجرایی را با استفاده از تابع `isRunnableDevEnvironment` بررسی کنید.

```ts
export class RunnableDevEnvironment extends DevEnvironment {
  public readonly runner: ModuleRunner
}

class ModuleRunner {
  /**
   * برای اجرا URL
   * می‌تواند مسیر فایل، مسیر سرور، یا شناسه‌ای نسبی به ریشه را بپذیرد
   * ssrLoadModule یک ماژول نمونه‌سازی‌شده را برمی‌گرداند مشابه
   */
  public async import(url: string): Promise<Record<string, any>>
  /**
   * ModuleRunner سایر متدهای
   */
}

if (isRunnableDevEnvironment(server.environments.ssr)) {
  await server.environments.ssr.runner.import('/entry-point.js')
}
```

:::warning هشدار
`runner` زمانی که برای اولین بار به آن دسترسی پیدا کنید، بلافاصله مقداردهی می‌شود. توجه داشته باشید که وقتی `runner` با فراخوانی `process.setSourceMapsEnabled` ساخته می‌شود یا در صورت عدم دسترسی، با جایگزین کردن `Error.prepareStackTrace` ، Vite از پشتیبانی سورس مپ استفاده می‌کند.
:::

فریم‌ورک‌هایی که از طریق [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) با محیط اجرای خود ارتباط برقرار می‌کنند، می‌توانند از `FetchableDevEnvironment` استفاده کنند. این کلاس روشی استاندارد برای مدیریت درخواست‌ها از طریق متد `handleRequest` فراهم می‌کند.

```ts
import {
  createServer,
  createFetchableDevEnvironment,
  isFetchableDevEnvironment,
} from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    custom: {
      dev: {
        createEnvironment(name, config) {
          return createFetchableDevEnvironment(name, config, {
            handleRequest(request: Request): Promise<Response> | Response {
              // handle Request and return a Response
            },
          })
        },
      },
    },
  },
})

// Any consumer of the environment API can now call `dispatchFetch`
if (isFetchableDevEnvironment(server.environments.custom)) {
  const response: Response = await server.environments.custom.dispatchFetch(
    new Request('/request-to-handle'),
  )
}
```

:::warning هشدار
Vite ورودی و خروجی متد `dispatchFetch` را اعتبارسنجی می‌کند: درخواست (Request) باید نمونه‌ای از کلاس سراسری `Request` باشد و پاسخ (Response) نیز باید نمونه‌ای از کلاس سراسری `Response` باشد. اگر این شرایط برقرار نباشد، Vite یک خطای `TypeError` پرتاب می‌کند.

توجه داشته باشید که اگرچه `FetchableDevEnvironment` به‌صورت یک کلاس پیاده‌سازی شده است، تیم توسعه Vite آن را به‌عنوان یک جزئیات داخلی (implementation detail) در نظر می‌گیرد. به این معنی که ممکن است در آینده، بدون اعلام قبلی، تغییر کند.
:::

## محیط پیش‌فرض `RunnableDevEnvironment`

با توجه به سرور Vite که مطابق [راهنمای راه‌اندازی SSR](/guide/ssr#setting-up-the-dev-server) در حالت میان‌افزار (middleware) پیکربندی شده، بیایید با استفاده از API محیط، میان‌افزار SSR را پیاده‌سازی کنیم. به یاد داشته باشید که الزاماً نباید نام آن `ssr` باشد، بنابراین در این مثال آن را `server` می‌نامیم. (جزئیات مربوط به مدیریت خطا در این مثال نادیده گرفته شده است)

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const viteServer = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  environments: {
    server: {
// اجرا شده است Vite به طور پیش‌فرض، ماژول‌ها در همان فرآیندی اجرا می‌شوند که سرور
    },
  },
})

// تبدیل کنید RunnableDevEnvironment نیاز داشته باشید آن را به TypeScript شاید در
// استفاده کنید runner برای بررسی دسترسی به isRunnableDevEnvironment یا از
const serverEnvironment = viteServer.environments.server

app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  // 1. index.html خواندن فایل
  const indexHtmlPath = path.resolve(__dirname, 'index.html')
  let template = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 2. Vite به HTML تبدیل‌های مربوط به
  //    را اعمال می‌کند Vite را تزریق می‌کند و همچنین تبدیل‌های پلاگین‌های HMR Client
  //    @vitejs/plugin-react پیش‌درآمد از
  template = await viteServer.transformIndexHtml(url, template)

  // 3. را ESM کد import(url) ماژول ورودی سرور را بارگیری می‌کند. متد
  //    به صورت خودکار تبدیل می‌کند و نیاز به باندل ندارد Node.js برای استفاده در
  //    را فراهم می‌کند HMR همچنین پشتیبانی کامل از
  const { render } = await serverEnvironment.runner.import(
    '/src/entry-server.js',
  )

  // 4. از render برنامه را رندر می‌کند. فرض بر این است که تابع HTML محتوای
  //    فریم‌ورک استفاده می‌کند SSR های مربوط به API از entry-server.js
  //    ReactDOMServer.renderToString() مانند
  const appHtml = await render(url)

  // 5. محتوای رندر شده را وارد قالب می‌کند
  const html = template.replace(`<!--ssr-outlet-->`, appHtml)

  // 6. نهایی را برمی‌گرداند HTML محتوای
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
})
```

## SSR بدون وابستگی به Runtime مشخص

از آنجا که `RunnableDevEnvironment` فقط در همان رانتایم سرور Vite کد را اجرا می‌کند، این رانتایم باید قادر به اجرای سرور Vite باشد (رانتایمی سازگار با Node.js). به این معناست که برای حذف وابستگی به رانتایم مشخص، باید از `DevEnvironment` به صورت خام استفاده کنید.

:::info پیشنهاد `FetchableDevEnvironment`

در طرح اولیه، متدی به نام `run` در کلاس `DevEnvironment` پیشنهاد شد که با استفاده از گزینه `transport`، امکان ایمپورت در بخش اجراکننده (runner) را فراهم می‌کرد. در آزمایش‌ها مشخص شد که این API به اندازه کافی فراگیر نیست تا توصیه شود. هم‌اکنون منتظر بازخورد در مورد [پیشنهاد `FetchableDevEnvironment`](https://github.com/vitejs/vite/discussions/18191) هستیم.

:::

در `RunnableDevEnvironment` متد `runner.import` وجود دارد که مقدار ماژول را برمی‌گرداند، اما در `DevEnvironment` خام در دسترس نیست و نیاز دارد کد استفاده‌کننده از APIهای Vite و ماژول‌های کاربر از یکدیگر جدا باشند.

مثال زیر، کد از ماژول کاربر در همان جایی استفاده می‌کند که از APIهای Vite نیز استفاده می‌شود:

```ts
// code using the Vite's APIs
import { createServer } from 'vite'

const server = createServer()
const ssrEnvironment = server.environment.ssr
const input = {}

const { createHandler } = await ssrEnvironment.runner.import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

اگر کد شما می‌تواند در همان محیط اجرایی ماژول‌های کاربر اجرا شود (یعنی به APIهای مخصوص Node.js وابسته نیست)، می‌توانید از یک ماژول مجازی استفاده کنید. این روش نیاز به دسترسی به مقدار از طریق APIهای Vite را از بین می‌برد.

```ts
// Vite های API کد با استفاده از
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // `virtual:entrypoint` پلاگین برای رسیدگی به مسیر مجازی
    {
      name: 'virtual-module',
      /* پیاده‌سازی پلاگین */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// از توابعی که توسط فکتوری‌های هر محیط فراهم می‌شوند استفاده می‌کند
// بررسی می‌کند هر فکتوری محیط چه امکاناتی ارائه می‌دهد
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)
const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

برای مثال، برای فراخوانی `transformIndexHtml` روی ماژول کاربر، می‌توان از پلاگین زیر استفاده کرد:

```ts {13-21}
function vitePluginVirtualIndexHtml(): Plugin {
  let server: ViteDevServer | undefined
  return {
    name: vitePluginVirtualIndexHtml.name,
    configureServer(server_) {
      server = server_
    },
    resolveId(source) {
      return source === 'virtual:index-html' ? '\0' + source : undefined
    },
    async load(id) {
      if (id === '\0' + 'virtual:index-html') {
        let html: string
        if (server) {
          this.addWatchFile('index.html')
          html = fs.readFileSync('index.html', 'utf-8')
          html = await server.transformIndexHtml('/', html)
        } else {
          html = fs.readFileSync('dist/client/index.html', 'utf-8')
        }
        return `export default ${JSON.stringify(html)}`
      }
      return
    },
  }
}
```

اگر کد شما به APIهای Node.js نیاز دارد، می‌توانید برای ارتباط با کدی که از APIهای Vite در ماژول‌های کاربر استفاده می‌کند، از `hot.send` استفاده کنید. با این حال، دقت داشته باشید که پس از مرحله بیلد، این روش ممکن است همانند قبل کار نکند.

```ts
// Vite های API کد با استفاده از
import { createServer } from 'vite'

const server = createServer({
  plugins: [
    // `virtual:entrypoint` پلاگین برای رسیدگی به مسیر مجازی
    {
      name: 'virtual-module',
      /* پیاده‌سازی پلاگین */
    },
  ],
})
const ssrEnvironment = server.environment.ssr
const input = {}

// از توابعی که توسط فکتوری‌های هر محیط فراهم می‌شوند استفاده می‌کند
// بررسی می‌کند هر فکتوری محیط چه امکاناتی ارائه می‌دهد
if (ssrEnvironment instanceof RunnableDevEnvironment) {
  ssrEnvironment.runner.import('virtual:entrypoint')
} else if (ssrEnvironment instanceof CustomDevEnvironment) {
  ssrEnvironment.runEntrypoint('virtual:entrypoint')
} else {
  throw new Error(`Unsupported runtime for ${ssrEnvironment.name}`)
}

const req = new Request('/')

const uniqueId = 'a-unique-id'
ssrEnvironment.send('request', serialize({ req, uniqueId }))
const response = await new Promise((resolve) => {
  ssrEnvironment.on('response', (data) => {
    data = deserialize(data)
    if (data.uniqueId === uniqueId) {
      resolve(data.res)
    }
  })
})

// -------------------------------------
// virtual:entrypoint
const { createHandler } = await import('./entrypoint.js')
const handler = createHandler(input)

import.meta.hot.on('request', (data) => {
  const { req, uniqueId } = deserialize(data)
  const res = handler(req)
  import.meta.hot.send('response', serialize({ res: res, uniqueId }))
})

const response = handler(new Request('/'))

// -------------------------------------
// ./entrypoint.js
export function createHandler(input) {
  return function handler(req) {
    return new Response('hello')
  }
}
```

## محیط‌ها در زمان بیلد

در خط فرمان (CLI)، فراخوانی `vite build` و `vite build --ssr` همچنان به‌خاطر سازگاری با نسخه‌های قبلی فقط محیط کلاینت و محیط SSR را بیلد می‌کند.

زمانی که `builder` تعریف شده باشد (یا وقتی از `vite build --app` استفاده می‌کنید)، `vite build` برای بیلد کل اپلیکیشن فعال می‌شود. این کار در نسخه مهم بعدی به صورت پیش‌فرض خواهد بود. یک نمونه از `ViteBuilder` (معادل بیلدی `ViteDevServer`) ایجاد می‌شود تا تمام محیط‌های پیکربندی‌شده را برای پروداکشن بیلد کند. به صورت پیش‌فرض، بیلد محیط‌ها به صورت سری و بر اساس ترتیب رکورد `environments` اجرا می‌شود. یک فریم‌ورک یا کاربر می‌تواند با استفاده از تنظیمات زیر مشخص کند چگونه محیط‌ها بیلد شوند:

```js
export default {
  builder: {
    buildApp: async (builder) => {
      const environments = Object.values(builder.environments)
      return Promise.all(
        environments.map((environment) => builder.build(environment)),
      )
    },
  },
}
```

پلاگین‌ها همچنین می‌توانند یک هوک به نام `buildApp` تعریف کنند. هوک‌هایی با ترتیب `'pre'` و `null` قبل از اجرای `builder.buildApp` پیکربندی‌شده اجرا می‌شوند و هوک‌های با ترتیب `'post'` پس از آن اجرا خواهند شد. از ویژگی `environment.isBuilt` می‌توان برای بررسی اینکه آیا یک محیط از قبل ساخته شده است یا خیر، استفاده کرد.

## کد بدون وابستگی مستقیم به محیط

اغلب اوقات، نمونه محیط فعلی به عنوان بخشی از کانتکست کدی که اجرا می‌شود در دسترس است، بنابراین نیاز به دسترسی مستقیم از طریق `server.environments` معمولاً کم است. به عنوان مثال، در هوک‌های پلاگین، محیط به عنوان بخشی از `PluginContext` در دسترس قرار می‌گیرد و می‌توانید با `this.environment` به آن دسترسی داشته باشید. برای آشنایی با نحوه ساخت پلاگین‌های آگاه به محیط، به [Environment API for Plugins](./api-environment-plugins.md) مراجعه کنید.
