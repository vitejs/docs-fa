# ‌رابط برنامه‌نویسی اپلیکیشن (API) جاوا اسکریپت

رابط‌های برنامه‌نویسی اپلیکیشن جاوا اسکریپت در Vite به طور کامل نوشته شده اند. همچنین توصیه می شود از TypeScript استفاده کنید. (و یا بررسی نوع JS را در VS Code فعال و از هوش و اعتبارسنجی استفاده کنید).

## تابع `createServer`

**نشان گذاری تایپ:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**مثال از استفاده:**

```ts twoslash
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

:::tip 
هنگام استفاده از `createServer` و `ساختن` در یک فرآیند Node.js، هر دو عملکرد برای عملکرد صحیح به `process.env.NODE_ENV` متکی هستند، که به گزینه پیکربندی `حالت` نیز بستگی دارد. برای جلوگیری از رفتار متناقض، `process.env.NODE_ENV` یا `حالت` دو API را روی `توسعه (development)` تنظیم کنید. در غیر این صورت، می توانید یک فرآیند فرزند (child) برای اجرای API ها به طور جداگانه ایجاد کنید.
:::

:::tip نکته
زمانی که از [حالت میدلور (middleware mode)](/config/server-options.html#server-middlewaremode) به همراه [پیکربندی پراکسی برای WebSocket](/config/server-options.html#server-proxy) استفاده می‌کنید، باید **سرور HTTP والد** (parent http server) را در گزینه‌ی `middlewareMode` مشخص کنید تا پروکسی به‌درستی به سرور متصل شود.
<details>
<summary>مثال</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // or express, koa, etc.

const vite = await createServer({
  server: {
    // Enable middleware mode
    middlewareMode: {
      // Provide the parent http server for proxy WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Proxying WebSocket
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
:::


## `کانفیگ درون خطی (InlineConfig)`

رابط `InlineConfig` نسخه‌ای توسعه‌یافته از `UserConfig` است که چند ویژگی اضافی دارد:

- `کانفیگ‌فایل (configFile)`: مشخص می‌کند از کدام فایل پیکربندی استفاده شود. اگر تنظیم نشود، Vite به‌صورت خودکار به‌دنبال فایل پیکربندی در ریشه پروژه می‌گردد. برای غیرفعال کردن این رفتار، مقدار آن را `false` قرار دهید.

- و `envFile`: برای غیرفعال کردن بارگذاری فایل‌های `.env`، مقدار این گزینه را `false` قرار دهید.



## `پیکربندی درست شده (ResolvedConfig)`

رابط `ResolvedConfig` شامل تمام ویژگی‌های `UserConfig` است، با این تفاوت که بیشتر این ویژگی‌ها **به‌طور کامل resolve شده و مقداردهی شده‌اند** (undefined نیستند). همچنین شامل ابزارهایی (utilities) مانند موارد زیر نیز می‌شود:



- `تابع config.assetsInclude`: تابعی برای بررسی اینکه آیا یک `id` به‌عنوان یک asset (دارایی) در نظر گرفته می‌شود یا نه..
- `تابع config.logger`: شی (object) لاگر داخلی Vite (برای ثبت و نمایش پیام‌ها و گزارش‌ها در طول اجرا).

## `اینتر فیس ViteDevServer `

```ts
interface ViteDevServer {
  /**
   * The resolved Vite config object.
   */
  config: ResolvedConfig
  /**
   * A connect app instance
   * - Can be used to attach custom middlewares to the dev server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Native Node http server instance.
   * Will be null in middleware mode.
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher instance. If `config.server.watch` is set to `null`,
   * it will not watch any files and calling `add` or `unwatch` will have no effect.
   * https://github.com/paulmillr/chokidar/tree/3.6.0#api
   */
  watcher: FSWatcher
  /**
   * Web socket server with `send(payload)` method.
   */
  ws: WebSocketServer
  /**
   * Rollup plugin container that can run plugin hooks on a given file.
   */
  pluginContainer: PluginContainer
  /**
   * Module graph that tracks the import relationships, url to file mapping
   * and hmr state.
   */
  moduleGraph: ModuleGraph
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * in middleware mode or if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Programmatically resolve, load and transform a URL and get the result
   * without going through the http request pipeline.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Apply Vite built-in HTML transforms and any plugin HTML transforms.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Load a given URL as an instantiated module for SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Fix ssr error stacktrace.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Triggers HMR for a module in the module graph. You can use the `server.moduleGraph`
   * API to retrieve the module to be reloaded. If `hmr` is false, this is a no-op.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Start the server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Restart the server.
   *
   * @param forceOptimize - force the optimizer to re-bundle, same as --force cli flag
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Stop the server.
   */
  close(): Promise<void>
  /**
   * Bind CLI shortcuts
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports
   * are processed. If called from a load or transform plugin hook, the id needs to be
   * passed as a parameter to avoid deadlocks. Calling this function after the first
   * static imports section of the module graph has been processed will resolve immediately.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::اطلاعات
تابع `waitForRequestsIdle` به‌عنوان یک راه‌حل اضطراری طراحی شده است تا تجربه توسعه (DX) را برای ویژگی‌هایی که نمی‌توانند با طبیعت درخواستی سرور توسعه Vite پیاده‌سازی شوند، بهبود بخشد. این تابع می‌تواند در زمان راه‌اندازی توسط ابزارهایی مانند Tailwind استفاده شود تا تولید کلاس‌های CSS اپلیکیشن تا زمانی که کد اپلیکیشن دیده نشده است به تعویق بیفتد و از تغییرات ناگهانی استایل جلوگیری کند. زمانی که این تابع در یک هوک بارگذاری یا تبدیل استفاده می‌شود و از سرور پیش‌فرض HTTP1 استفاده می‌شود، یکی از شش کانال HTTP مسدود خواهد شد تا زمانی که سرور تمام واردات استاتیک را پردازش کند. بهینه‌ساز وابستگی‌های Vite هم‌اکنون از این تابع برای جلوگیری از بارگذاری مجدد کامل صفحه در صورت کمبود وابستگی‌ها استفاده می‌کند و بارگذاری وابستگی‌های پیش‌بسته را تا زمانی که تمام وابستگی‌های وارداتی از منابع واردات استاتیک جمع‌آوری شوند، به تأخیر می‌اندازد. ممکن است Vite در نسخه‌های اصلی آینده استراتژی متفاوتی اتخاذ کند و به‌طور پیش‌فرض مقدار `optimizeDeps.crawlUntilStaticImports: false` را تنظیم کند تا از تاثیر منفی عملکرد در برنامه‌های بزرگ در هنگام راه‌اندازی سرد (cold start) جلوگیری کند.
:::

## `ساخت`

**نشان‌ذاری تایپ:**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**مثال از استفاده:**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `پیش‌نمایش`

**نشان‌گذاری تایپ:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**مثال از استفاده:**

```ts twoslash
import { preview } from 'vite'

const previewServer = await preview({
  // any valid user config options, plus `mode` and `configFile`
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `اینترفیس PreviewServer`

```ts
interface PreviewServer {
  /**
   * The resolved vite config object
   */
  config: ResolvedConfig
  /**
   * A connect app instance.
   * - Can be used to attach custom middlewares to the preview server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node http server instance
   */
  httpServer: http.Server
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Print server urls
   */
  printUrls(): void
  /**
   * Bind CLI shortcuts
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `تابع resolveConfig`

**نشان‌گذاری تایپ:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

The `command` value is `serve` in dev and preview, and `build` in build.

## `تابع mergeConfig`

**نشان‌گذاری تایپ:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

دو پیکربندی Vite را به‌طور عمیق با هم ترکیب می‌کند. مقدار `isRoot` نمایانگر سطحی است که در پیکربندی Vite در حال ترکیب آن هستید. به‌عنوان مثال، اگر در حال ترکیب دو گزینه `build` هستید، مقدار آن را `false` قرار دهید.

:::tip

تابع `mergeConfig` تنها پیکربندی‌هایی که به‌صورت شیء (object) هستند را می‌پذیرد. اگر پیکربندی شما به‌صورت تابع callback است، باید آن را قبل از ارسال به `mergeConfig` فراخوانی کنید.

شما می‌توانید از کمک‌تابع `defineConfig` برای ترکیب یک پیکربندی به‌صورت callback با یک پیکربندی دیگر استفاده کنید:

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `تابع searchForWorkspaceRoot`

**نشان‌گذاری تایپ:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**مرتبط:** [server.fs.allow](/config/server-options.md#server-fs-allow)

جستجوی ریشه‌ی پتانسیل workspace، اگر شرایط زیر برقرار باشد انجام می‌شود، در غیر این صورت به `root` برمی‌گردد:

- وجود فیلد `workspaces` در فایل `package.json`
- وجود یکی از فایل‌های زیر:
  - `فایل lerna.json`
  - `و یا فایل pnpm-workspace.yaml`

## `تابع loadEnv`

**نشان‌گذاری تایپ:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**مرتبط:** [`.env` Files](./env-and-mode.md#env-files)

فایل‌های `.env` را درون دایرکتوری `envDir` بارگذاری کنید؛ به‌طور پیش‌فرض، فقط متغیرهای محیطی با پیشوند `VITE_` بارگذاری می‌شوند، مگر اینکه پیشوندها (`prefixes`) تغییر داده شوند.

## `تابع normalizePath`

**نشان‌گذاری تایپ:**

```ts
function normalizePath(id: string): string
```

**مرتبط:** [Path Normalization](./api-plugin.md#path-normalization)

مسیری را برای همکاری بین افزونه‌های Vite (plugins) عادی می کند. 


## `transformWithEsbuild`

**نشان‌گذاری تایپ:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```
تبدیل JavaScript یا TypeScript با استفاده از esbuild. این کار برای افزونه‌هایی مفید است که ترجیح می‌دهند با فرآیند تبدیل داخلی Vite هماهنگ باشند.


## `تابع loadConfigFromFile`

**نشان‌گذاری تایپ:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```
بارگذاری دستی فایل تنظیمات Vite با استفاده از esbuild.

## `تابع preprocessCSS`

- **تجربی:** [Give Feedback](https://github.com/vitejs/vite/discussions/13815)

**نشان‌گذاری تایپ:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>

interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

پیش‌پردازش فایل‌های `.css`، `.scss`، `.sass`، `.less`، `.styl` و `.stylus` به CSS ساده، به‌طوری‌که بتوان آن را در مرورگرها استفاده کرد یا توسط ابزارهای دیگر پردازش کرد. مشابه [پشتیبانی داخلی از پیش‌پردازش CSS](/guide/features#css-pre-processors)، پیش‌پردازش‌گر مربوطه باید به‌صورت جداگانه نصب شده باشد تا قابل استفاده باشد.

پیش‌پردازش‌گر مورد استفاده از روی پسوند `filename` تشخیص داده می‌شود. اگر نام فایل با `.module.{ext}` به پایان برسد، به‌عنوان یک [CSS module](https://github.com/css-modules/css-modules) در نظر گرفته می‌شود و نتیجه‌ی بازگشتی شامل یک شیء `modules` خواهد بود که نام کلاس‌های اصلی را به نام‌های تبدیل‌شده نگاشت می‌کند.

توجه داشته باشید که پیش‌پردازش، آدرس‌های موجود در `url()` یا `image-set()` را resolve نخواهد کرد.
