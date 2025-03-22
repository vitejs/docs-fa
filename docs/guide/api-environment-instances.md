# استفاده از نمونه‌های `Environment`

:::warning آزمایشی
Environment API در حال حاضر آزمایشی است. ما این APIها را در طول نسخه Vite 6 ثابت نگه می‌داریم تا اکوسیستم بتواند آن را آزمایش کند و بر روی آن توسعه دهد. برنامه ما این است که این APIهای جدید را در Vite 7 با تغییرات احتمالی نهایی کنیم.

منابع:

- [بحث و گفتگو](https://github.com/vitejs/vite/discussions/16358) جایی که ما در حال جمع‌آوری نظرات درباره APIهای جدید هستیم.
- [PR مربوط به Environment API](https://github.com/vitejs/vite/pull/16471) جایی که API جدید پیاده‌سازی و بررسی شده است.

لطفاً نظرات و بازخوردهای خود را با ما به اشتراک بگذارید.
:::

## دسترسی به محیط‌ها

در حالت توسعه (dev)، می‌توان با استفاده از `server.environments` به محیط‌های موجود در یک سرور توسعه دسترسی داشت:

```js
// دریافت کنید configureServer سرور را ایجاد کنید یا آن را از هوک
const server = await createServer(/* options */)

const environment = server.environments.client
environment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

همچنین می‌توانید از طریق پلاگین‌ها به محیط فعلی دسترسی داشته باشید. برای جزئیات بیشتر، به [API محیط برای پلاگین‌ها](./api-environment-plugins.md#accessing-the-current-environment-in-hooks) مراجعه کنید.

## کلاس `DevEnvironment`

در حالت توسعه (dev)، هر محیط یک نمونه از کلاس `DevEnvironment` است:

```ts
class DevEnvironment {
  /**
   * Vite شناسه‌ی منحصربه‌فرد برای محیط در یک سرور
   * را در دسترس قرار می‌دهد 'ssr' و 'client' محیط‌های Vite ، به‌طور پیش‌فرض
   */
  name: string
  /**
   * کانال ارتباطی برای ارسال و دریافت پیام‌ها از
   * اجراکننده ماژول مرتبط در رانتام هدف
   */
  hot: NormalizedHotChannel
  /**
   * گراف نودهای ماژول، با روابط وارد شده بین
   * ماژول‌های پردازش شده و نتیجه کش شده کد پردازش شده
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * پلاگین‌های اضافه شده برای این محیط، از جمله پلاگین‌هایی که
   * مخصوص هر محیط ایجاد شده‌اند `create` با استفاده از هوک
   */
  plugins: Plugin[]
  /**
   * امکان حل و فصل، بارگذاری و تبدیل کد را از طریق
   * مسیر پردازش پلاگین های محیط فراهم می‌کند
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * گزینه های تنظیمات اضافه شده برای این محیط. گزینه‌های موجود در
   * دامنه‌ی کلی سرور به‌عنوان پیش‌فرض برای تمام محیط‌ها درنظر گرفته می‌شوند
   * optimizedDeps و external ، resolve conditions می‌توانند بازنویسی شوند. مانند
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(
    name: string,
    config: ResolvedConfig,
    context: DevEnvironmentContext,
  )

  /**
   * را به یک شناسه تبدیل می‌کند، آن را بارگذاری کرده و URL آدرس
   * کد را از طریق مسیر پردازش پلاگین‌ها پردازش می‌کند
   * گراف ماژول نیز به‌روزرسانی می‌شود
   */
  async transformRequest(url: string): Promise<TransformResult | null>

  /**
   * یک درخواست را برای پردازش با اولویت پایین ثبت می‌کند. این کار
   * اطلاعاتی Vite برای جلوگیری از وابستگی‌های زنجیره‌ای مفید است. سرور
   * درباره‌ی ماژول‌های ایمپورت شده توسط درخواست‌های دیگر دارد، بنابراین می‌تواند
   * گراف ماژول را از پیش آماده کند تا ماژول‌ها هنگام درخواست، پردازش‌ شده باشند
   */
  async warmupRequest(url: string): Promise<void>
}
```

با `DevEnvironmentContext` به صورت زیر است:

```ts
interface DevEnvironmentContext {
  hot: boolean
  transport?: HotChannel | WebSocketServer
  options?: EnvironmentOptions
  remoteRunner?: {
    inlineSourceMap?: boolean
  }
  depsOptimizer?: DepsOptimizer
}
```

و با `TransformResult` به صورت زیر است:

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

یک نمونه از محیط در سرور Vite به شما امکان می‌دهد که یک URL را با استفاده از متد `environment.transformRequest(url)` پردازش کنید. این تابع از خط پردازش پلاگین‌ها برای تبدیل `url` به یک شناسه‌ی ماژول (`id`) استفاده می‌کند، آن را بارگذاری می‌کند (با خواندن فایل از فایل سیستم یا از طریق پلاگینی که یک ماژول مجازی را پیاده‌سازی کرده است) و سپس کد را تبدیل می‌کند. در حین تبدیل ماژول،ایمپورت‌های آن و دیگر اطلاعات متادیتا در گراف ماژول محیط ثبت می‌شوند، با ایجاد یا به‌روزرسانی نود ماژول مربوطه. پس از اتمام پردازش، نتیجه‌ی تبدیل نیز در ماژول ذخیره می‌شود.

:::info نام‌گذاری transformRequest
در نسخه‌ی کنونی این پیشنهاد، از `transformRequest(url)` و `warmupRequest(url)` استفاده می‌کنیم تا درک و بحث درباره‌ی آن برای کاربرانی که به API فعلی Vite عادت دارند، آسان‌تر باشد. پیش از انتشار، می‌توانیم فرصت را برای بازبینی این نام‌ها نیز غنیمت بشماریم. برای مثال، ممکن است نام آن را به `environment.processModule(url)` یا `environment.loadModule(url)` تغییر دهیم، مشابه `context.load(id)` در پلاگین‌های Rollup. در حال حاضر، حفظ نام‌های فعلی و به تعویق انداختن این بحث را بهتر می‌دانیم.
:::

## گراف‌های ماژول مجزا

هر محیط یک گراف ماژول ایزوله دارد. همه گراف‌های ماژول امضای یکسانی دارند، بنابراین می‌توان الگوریتم‌های کلی برای پیمایش یا پیمایش گراف بدون وابستگی به محیط پیاده‌سازی کرد. مثال خوب آن `hotUpdate` است. وقتی یک فایل تغییر می‌کند، گراف ماژول هر محیط بررسی می‌شود تا ماژول‌های تحت تأثیر را پیدا کند و HMR را به صورت مستقل برای هر محیط انجام دهد.

::: info نکته
Vite نسخه ۵ یک گراف ماژول مشترک بین کلاینت و SSR داشت. اگر یک نود هنوز پردازش نشده یا باطل شده باشد، نمی‌توان تشخیص داد که مربوط به محیط کلاینت، SSR، یا هر دو است. نودهای ماژول دارای برخی ویژگی‌های پیشونددار هستند، مانند `clientImportedModules` و `ssrImportedModules` (به‌علاوه `importedModules` که اجتماع هر دو را برمی‌گرداند). فیلد `importers` همه ایمپورترهای مربوط به هر دو محیط کلاینت و SSR را برای هر نود ماژول شامل می‌شود. هر نود ماژول همچنین دارای `transformResult` و `ssrTransformResult` است. لایه‌ای برای حفظ سازگاری به اکوسیستم اجازه می‌دهد تا از `server.moduleGraph` منسوخ شده به این مدل جدید مهاجرت کند.
:::

هر ماژول توسط یک نمونه از `EnvironmentModuleNode` نشان داده می‌شود. ممکن است ماژول‌ها در گراف بدون پردازش اولیه ثبت شوند (در این حالت، مقدار `transformResult` برابر `null` خواهد بود). فیلدهای `importers` و `importedModules` نیز پس از پردازش ماژول به‌روزرسانی می‌شوند.

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` is an instance of `EnvironmentModuleGraph`:

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModuleById(id: string): EnvironmentModuleNode | undefined

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  onFileDelete(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
