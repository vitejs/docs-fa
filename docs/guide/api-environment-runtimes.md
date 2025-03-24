# API محیط برای رانتایم‌ها

:::warning آزمایشی
Environment API در حال حاضر آزمایشی است. ما این APIها را در طول نسخه Vite 6 ثابت نگه می‌داریم تا اکوسیستم بتواند آن را آزمایش کند و بر روی آن توسعه دهد. برنامه ما این است که این APIهای جدید را در Vite 7 با تغییرات احتمالی نهایی کنیم.

منابع:

- [بحث و گفتگو](https://github.com/vitejs/vite/discussions/16358) جایی که ما در حال جمع‌آوری نظرات درباره APIهای جدید هستیم.
- [PR مربوط به Environment API](https://github.com/vitejs/vite/pull/16471) جایی که API جدید پیاده‌سازی و بررسی شده است.

لطفاً نظرات و بازخوردهای خود را با ما به اشتراک بگذارید.
:::

## Environment Factories

سازنده‌های محیط (Environment Factories) قرار است توسط فراهم‌کنندگان رانتایم (مثل Cloudflare) پیاده‌سازی شوند، نه کاربران عادی. این سازنده‌ها در ساده‌ترین حالت، یک `EnvironmentOptions` را برمی‌گردانند که از رانتایم هدف هم برای محیط توسعه و هم بیلد استفاده می‌کند. همچنین می‌توان تنظیمات پیش‌فرض محیط را به‌گونه‌ای تعیین کرد که کاربر نیازی به انجام این کار نداشته باشد.

```ts
function createWorkerdEnvironment(
  userConfig: EnvironmentOptions,
): EnvironmentOptions {
  return mergeConfig(
    {
      resolve: {
        conditions: [
          /*...*/
        ],
      },
      dev: {
        createEnvironment(name, config) {
          return createWorkerdDevEnvironment(name, config, {
            hot: true,
            transport: customHotChannel(),
          })
        },
      },
      build: {
        createEnvironment(name, config) {
          return createWorkerdBuildEnvironment(name, config)
        },
      },
    },
    userConfig,
  )
}
```

سپس می‌توان فایل پیکربندی را به شکل زیر نوشت:

```js
import { createWorkerdEnvironment } from 'vite-environment-workerd'

export default {
  environments: {
    ssr: createWorkerdEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
    rsc: createWorkerdEnvironment({
      build: {
        outDir: '/dist/rsc',
      },
    }),
  },
}
```

و فریم‌ورک‌ها می‌توانند برای انجام SSR از یک محیط با رانتایم workerd به این شکل استفاده کنند:

```js
const ssrEnvironment = server.environments.ssr
```

## ایجاد یک Environment Factory جدید

سرور توسعه Vite به طور پیش‌فرض دو محیط را ارائه می‌دهد: محیط `client` و محیط `ssr`. محیط کلاینت به طور پیش‌فرض یک محیط مرورگر است، و اجراکننده ماژول آن با ایمپورت کردن ماژول مجازی `‎/@vite/client` در برنامه‌های کلاینت پیاده‌سازی می‌شود. محیط SSR به طور پیش‌فرض در همان رانتایم Node که سرور Vite اجرا می‌شود، اجرا می‌شود و به سرورهای برنامه اجازه می‌دهد تا درخواست‌ها را در زمان توسعه با پشتیبانی کامل از HMR رندر کنند.

سورس کد تبدیل‌شده یک ماژول نامیده می‌شود و روابط بین ماژول‌های پردازش‌شده در هر محیط در یک گراف ماژول نگهداری می‌شود. کد تبدیل‌شده برای این ماژول‌ها به رانتایم‌های مرتبط با هر محیط فرستاده می‌شود تا اجرا شود. وقتی یک ماژول در رانتایم ارزیابی می‌شود، ماژول‌های ایمپورت‌شده آن درخواست می‌شوند که باعث می‌شود بخشی مرتبطی از گراف ماژول پردازش شود.

اجرا کننده ماژول در Vite اجازه می‌دهد هر کدی را با پردازش آن توسط پلاگین‌های Vite اجرا کنید. این با `server.ssrLoadModule` متفاوت است زیرا پیاده‌سازی اجراکننده از سرور جدا شده است. این موضوع به نویسندگان کتابخانه و فریم‌ورک اجازه می‌دهد لایه ارتباطی خود را بین سرور Vite و اجراکننده پیاده‌سازی کنند. مرورگر با استفاده از Web Socket سرور و از طریق درخواست‌های HTTP با محیط مربوطه خود ارتباط برقرار می‌کند. Node Module Runner می‌تواند به طور مستقیم فراخوانی‌های تابع را برای پردازش ماژول‌ها انجام دهد زیرا در همان فرآیند اجرا می‌شود. سایر محیط‌ها می‌توانند ماژول‌ها را با اتصال به یک رانتایم JS مانند workerd، یا یک Worker Thread همانطور که Vitest انجام می‌دهد، اجرا کنند.

یکی از اهداف این قابلیت، فراهم کردن یک API قابل سفارشی‌سازی برای پردازش و اجرای کد است. کاربران می‌توانند با استفاده از ابزارهای ارائه‌شده، سازنده‌های محیط جدیدی بسازند.

```ts
import { DevEnvironment, HotChannel } from 'vite'

function createWorkerdDevEnvironment(
  name: string,
  config: ResolvedConfig,
  context: DevEnvironmentContext
) {
  const connection = /* ... */
  const transport: HotChannel = {
    on: (listener) => { connection.on('message', listener) },
    send: (data) => connection.send(data),
  }

  const workerdDevEnvironment = new DevEnvironment(name, config, {
    options: {
      resolve: { conditions: ['custom'] },
      ...context.options,
    },
    hot: true,
    transport,
  })
  return workerdDevEnvironment
}
```

## `ModuleRunner`

یک اجراکننده‌ی ماژول (Module Runner) در رانتایم هدف ساخته می‌شود. تمام APIهایی که در بخش بعدی آمده‌اند، مگر در مواردی که به‌طور دیگری ذکر شده باشد، از مسیر `vite/module-runner` ایمپورت می‌شوند. این نقطه ورود در حد ممکن سبک نگه داشته شده و تنها کمترین موارد لازم را برای ساخت اجراکننده ماژول را اکسپورت می‌کند.

**امضای تایپ:**

```ts
export class ModuleRunner {
  constructor(
    public options: ModuleRunnerOptions,
    public evaluator: ModuleEvaluator = new ESModulesEvaluator(),
    private debug?: ModuleRunnerDebugger,
  ) {}
  /**
   * URL to execute.
   * Accepts file path, server path, or id relative to the root.
   */
  public async import<T = any>(url: string): Promise<T>
  /**
   * Clear all caches including HMR listeners.
   */
  public clearCache(): void
  /**
   * Clear all caches, remove all HMR listeners, reset sourcemap support.
   * This method doesn't stop the HMR connection.
   */
  public async close(): Promise<void>
  /**
   * Returns `true` if the runner has been closed by calling `close()`.
   */
  public isClosed(): boolean
}
```

ارزیاب ماژول در `ModuleRunner` مسئول اجرای کد است. Vite به صورت پیش‌فرض `ESModulesEvaluator` را اکسپورت می‌کند که از `new AsyncFunction` برای اجرای کد استفاده می‌کند. اگر رانتایم جاوااسکریپت شما از ارزیابی ناامن پشتیبانی نمی‌کند، می‌توانید پیاده‌سازی اختصاصی خود را ارائه دهید.

اجراکننده‌ی ماژول متد `import` را ارائه می‌دهد. زمانی که سرور Vite رویداد HMR از نوع `full-reload` را اجرا می‌کند، تمام ماژول‌های تحت تأثیر دوباره اجرا خواهند شد. توجه داشته باشید که اجراکننده‌ی ماژول در این فرآیند آبجکت `exports` را به‌روزرسانی نمی‌کند، بلکه آن را بازنویسی می‌کند. بنابراین، اگر نیاز به جدیدترین مقدار `exports` دارید، باید دوباره `import` را اجرا کنید یا ماژول را از `evaluatedModules` دریافت کنید.

**مثال استفاده:**

```js
import { ModuleRunner, ESModulesEvaluator } from 'vite/module-runner'
import { transport } from './rpc-implementation.js'

const moduleRunner = new ModuleRunner(
  {
    transport,
  },
  new ESModulesEvaluator(),
)

await moduleRunner.import('/src/entry-point.js')
```

## `ModuleRunnerOptions`

```ts twoslash
import type {
  InterceptorOptions as InterceptorOptionsRaw,
  ModuleRunnerHmr as ModuleRunnerHmrRaw,
  EvaluatedModules,
} from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type InterceptorOptions = Debug<InterceptorOptionsRaw>
type ModuleRunnerHmr = Debug<ModuleRunnerHmrRaw>
/** see below */
type ModuleRunnerTransport = unknown

// ---cut---
interface ModuleRunnerOptions {
  /**
   * A set of methods to communicate with the server.
   */
  transport: ModuleRunnerTransport
  /**
   * Configure how source maps are resolved.
   * Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides
   * `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and
   * source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   *
   * @default true
   */
  hmr?: boolean | ModuleRunnerHmr
  /**
   * Custom module cache. If not provided, it creates a separate module
   * cache for each module runner instance.
   */
  evaluatedModules?: EvaluatedModules
}
```

## `ModuleEvaluator`

**امضای تایپ:**

```ts twoslash
import type { ModuleRunnerContext as ModuleRunnerContextRaw } from 'vite/module-runner'
import type { Debug } from '@type-challenges/utils'

type ModuleRunnerContext = Debug<ModuleRunnerContextRaw>

// ---cut---
export interface ModuleEvaluator {
  /**
   * Number of prefixed lines in the transformed code.
   */
  startOffset?: number
  /**
   * Evaluate code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runInlinedModule(
    context: ModuleRunnerContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * evaluate externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite به‌صورت پیش‌فرض `ESModulesEvaluator` را اکسپورت می‌کند که این اینترفیس را پیاده‌سازی می‌کند. این ماژول از `new AsyncFunction` برای اجرای کد استفاده می‌کند. بنابراین، اگر کد دارای سورس مپ داخلی (inlined source map) باشد، باید شامل یک [افست ۲ خطی](https://tc39.es/ecma262/#sec-createdynamicfunction) باشد تا فضای موردنیاز برای خطوط جدید اضافه‌شده را جبران کند. این کار به‌طور خودکار توسط `ESModulesEvaluator` انجام می‌شود. اما ارزیاب‌های سفارشی (Custom evaluators) خطوط اضافی را اضافه نخواهند کرد.

## `ModuleRunnerTransport`

**امضای تایپ:**

```ts twoslash
import type { ModuleRunnerTransportHandlers } from 'vite/module-runner'
/** an object */
type HotPayload = unknown
// ---cut---
interface ModuleRunnerTransport {
  connect?(handlers: ModuleRunnerTransportHandlers): Promise<void> | void
  disconnect?(): Promise<void> | void
  send?(data: HotPayload): Promise<void> | void
  invoke?(data: HotPayload): Promise<{ result: any } | { error: any }>
  timeout?: number
}
```

آبجکت Transport برای ارتباط با محیط از طریق RPC یا فراخوانی مستقیم توابع استفاده می‌شود. اگر متد `invoke` پیاده‌سازی نشده باشد، باید متدهای `send` و `connect` را پیاده‌سازی کنید. در این حالت، Vite خودش متد `invoke` را ایجاد می‌کند.

برای این کار، باید آن را با نمونه‌ای از `HotChannel` روی سرور ترکیب کنید، مانند مثالی که در آن ماژول رانر در یک (Worker Thread) ایجاد می‌شود:

::: code-group

```js [worker.js]
import { parentPort } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

/** @type {import('vite/module-runner').ModuleRunnerTransport} */
const transport = {
  connect({ onMessage, onDisconnection }) {
    parentPort.on('message', onMessage)
    parentPort.on('close', onDisconnection)
  },
  send(data) {
    parentPort.postMessage(data)
  },
}

const runner = new ModuleRunner(
  {
    transport,
  },
  new ESModulesEvaluator(),
)
```

```js [server.js]
import { BroadcastChannel } from 'node:worker_threads'
import { createServer, RemoteEnvironmentTransport, DevEnvironment } from 'vite'

function createWorkerEnvironment(name, config, context) {
  const worker = new Worker('./worker.js')
  const handlerToWorkerListener = new WeakMap()

  const workerHotChannel = {
    send: (data) => worker.postMessage(data),
    on: (event, handler) => {
      if (event === 'connection') return

      const listener = (value) => {
        if (value.type === 'custom' && value.event === event) {
          const client = {
            send(payload) {
              worker.postMessage(payload)
            },
          }
          handler(value.data, client)
        }
      }
      handlerToWorkerListener.set(handler, listener)
      worker.on('message', listener)
    },
    off: (event, handler) => {
      if (event === 'connection') return
      const listener = handlerToWorkerListener.get(handler)
      if (listener) {
        worker.off('message', listener)
        handlerToWorkerListener.delete(handler)
      }
    },
  }

  return new DevEnvironment(name, config, {
    transport: workerHotChannel,
  })
}

await createServer({
  environments: {
    worker: {
      dev: {
        createEnvironment: createWorkerEnvironment,
      },
    },
  },
})
```

:::

یک مثال دیگر که از یک درخواست HTTP برای ارتباط بین رانر (Runner) و سرور استفاده می‌کند:

```ts
import { ESModulesEvaluator, ModuleRunner } from 'vite/module-runner'

export const runner = new ModuleRunner(
  {
    transport: {
      async invoke(data) {
        const response = await fetch(`http://my-vite-server/invoke`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
        return response.json()
      },
    },
    hmr: false, // disable HMR as HMR requires transport.connect
  },
  new ESModulesEvaluator(),
)

await runner.import('/entry.js')
```

در این حالت، متد `handleInvoke` در `NormalizedHotChannel` قابل استفاده است.

```ts
const customEnvironment = new DevEnvironment(name, config, context)

server.onRequest((request: Request) => {
  const url = new URL(request.url)
  if (url.pathname === '/invoke') {
    const payload = (await request.json()) as HotPayload
    const result = customEnvironment.hot.handleInvoke(payload)
    return new Response(JSON.stringify(result))
  }
  return Response.error()
})
```

اما توجه داشته باشید که برای پشتیبانی از HMR، متدهای `send` و `connect` الزامی هستند. متد `send` معمولاً زمانی فراخوانی می‌شود که یک رویداد سفارشی فعال شود (مثلاً `import.meta.hot.send("my-event")`).

Vite متد `createServerHotChannel` را از نقطه ورود اصلی اکسپورت می‌کند تا از HMR در حین اجرای SSR در Vite پشتیبانی کند.
