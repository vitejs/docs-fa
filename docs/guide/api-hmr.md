# API HMR

:::tip نکته
این API مربوط به سمت کلاینت برای HMR است. برای مدیریت به‌روزرسانی‌های HMR در پلاگین‌ها، [handleHotUpdate](./api-plugin#handlehotupdate) را ببینید.

API دستی HMR عمدتاً برای توسعه‌دهندگان فریمورک‌ها و ابزارها طراحی شده است. به عنوان کاربر نهایی، احتمالاً HMR از قبل در قالب‌های اولیه خاص فریمورک‌ها برای شما مدیریت شده است.
:::

Vite سپس API دستی HMR خود را از طریق آبجکت ویژه `import.meta.hot` در دسترس قرار می‌دهد:

```ts
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type {
  CustomEventName,
  InferCustomEventPayload,
} from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void
}
```

## شرط لازم برای حفاظت (Conditional Guard)

اول از همه، مطمئن شوید تمام استفاده‌های API HMR را درون یک بلوک شرطی قرار داده‌اید تا کد در محیط تولید (production) حذف شود (tree-shaken):

```js
if (import.meta.hot) {
  // کد مربوط به HMR
}
```

## پشتیبانی از IntelliSense برای TypeScript

Vite تعاریف نوع (type definitions) را برای `import.meta.hot` در [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) ارائه می‌دهد. می‌توانید یک فایل `vite-env.d.ts` در دایرکتوری `src` ایجاد کنید تا TypeScript این تعاریف نوع را تشخیص دهد:

```ts [vite-env.d.ts]
/// <reference types="vite/client" />
```

## `hot.accept(cb)`

برای اینکه یک ماژول به صورت خودکار تغییرات را بپذیرد (self-accept)، از `import.meta.hot.accept` با یک تابع بازگشتی (callback) استفاده کنید که ماژول به‌روزشده را دریافت می‌کند:

```js twoslash
import 'vite/client'
// ---cut---
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // وقتی خطای نحوی رخ دهد newModule undefined خواهد بود
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

یک ماژول که تغییرات داغ را می‌پذیرد به عنوان **مرز HMR** (HMR boundary) در نظر گرفته می‌شود.

HMR در Vite در واقع ماژول واردشده اصلی را جایگزین نمی‌کند: اگر یک ماژول مرز HMR، واردات (imports) را از یک وابستگی (dependency) مجدداً صادر (re-export) کند، مسئول به‌روزرسانی آن صادرات مجدد است (و این صادرات باید با استفاده از `let` تعریف شوند). علاوه بر این، واردکننده‌های (importers) بالادست در زنجیره از ماژول مرز، از تغییر مطلع نخواهند شد. این پیاده‌سازی ساده‌شده HMR برای بیشتر موارد استفاده در محیط توسعه کافی است، در حالی که از کار پرهزینه تولید ماژول‌های پراکسی (proxy) اجتناب می‌کند.

Vite نیاز دارد که فراخوانی این تابع به صورت `import.meta.hot.accept(` (با حساسیت به فاصله‌ها) در کد منبع ظاهر شود تا ماژول بتواند به‌روزرسانی را بپذیرد. این یک نیاز برای تحلیل استاتیکی است که Vite برای فعال کردن پشتیبانی HMR برای یک ماژول انجام می‌دهد.

## `hot.accept(deps, cb)`

یک ماژول همچنین می‌تواند به‌روزرسانی‌ها از وابستگی‌های مستقیم را بدون بارگذاری مجدد خود بپذیرد:

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // تابع بازگشتی ماژول به‌روزشده './foo.js' را دریافت می‌کند
    newFoo?.foo()
  })

  // همچنین می‌تواند آرایه‌ای از ماژول‌های وابستگی را بپذیرد:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // تابع بازگشتی آرایه‌ای دریافت می‌کند که فقط ماژول به‌روزشده
      // غیر null است. اگر به‌روزرسانی موفقیت‌آمیز نباشد (مثلاً خطای نحوی)،
      // آرایه خالی خواهد بود
    },
  )
}
```

## `hot.dispose(cb)`

یک ماژول self-accepting یا ماژولی که انتظار دارد توسط دیگران پذیرفته شود، می‌تواند از `hot.dispose` برای پاکسازی اثرات جانبی پایدار ایجادشده توسط نسخه به‌روزشده استفاده کند:

```js twoslash
import 'vite/client'
// ---cut---
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // پاکسازی اثر جانبی
  })
}
```

## `hot.prune(cb)`

یک تابع بازگشتی ثبت کنید که وقتی ماژول دیگر در صفحه import نشود فراخوانی می‌شود. در مقایسه با `hot.dispose`، اگر کد منبع اثرات جانبی را خودش در به‌روزرسانی‌ها پاکسازی می‌کند و فقط نیاز دارید هنگام حذف از صفحه پاکسازی شود، می‌توان از این استفاده کرد. Vite در حال حاضر از این برای واردات `.css` استفاده می‌کند.

```js twoslash
import 'vite/client'
// ---cut---
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // پاکسازی اثر جانبی
  })
}
```

## `hot.data`

شیء `import.meta.hot.data` بین نمونه‌های مختلف یک ماژول به‌روزشده حفظ می‌شود. می‌توان از آن برای انتقال اطلاعات از نسخه قبلی ماژول به نسخه بعدی استفاده کرد.

توجه کنید که انتساب مجدد (re-assignment) خود `data` پشتیبانی نمی‌شود. در عوض، باید خصوصیت‌های شیء `data` را تغییر دهید تا اطلاعات اضافه‌شده از سایر هندلرها حفظ شوند.

```js twoslash
import 'vite/client'
// ---cut---
// صحیح
import.meta.hot.data.someValue = 'hello'

// پشتیبانی نمی‌شود
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

این در حال حاضر یک noop است و برای سازگاری با نسخه‌های قبلی وجود دارد. اگر در آینده استفاده جدیدی برای آن ایجاد شود، ممکن است تغییر کند. برای نشان دادن اینکه ماژول قابلیت به‌روزرسانی داغ را ندارد، از `hot.invalidate()` استفاده کنید.

## `hot.invalidate(message?: string)`

یک ماژول self-accepting ممکن است در زمان اجرا متوجه شود که نمی‌تواند یک به‌روزرسانی HMR را مدیریت کند، بنابراین باید به‌روزرسانی به صورت اجباری به واردکننده‌ها (importers) منتقل شود. با فراخوانی `import.meta.hot.invalidate()`، سرور HMR واردکننده‌های فراخواننده را باطل می‌کند، گویی فراخواننده self-accepting نبوده است. این یک پیام هم در کنسول مرورگر و هم در ترمینال ثبت می‌کند. می‌توانید یک پیام برای ارائه زمینه درباره دلیل باطل‌سازی ارسال کنید.

توجه کنید که همیشه باید `import.meta.hot.accept` را فراخوانی کنید حتی اگر قصد دارید بلافاصله `invalidate` را فراخوانی کنید، در غیر این صورت کلاینت HMR به تغییرات آینده ماژول self-accepting گوش نخواهد داد. برای انتقال واضح هدف خود، توصیه می‌کنیم `invalidate` را درون تابع بازگشتی `accept` مانند زیر فراخوانی کنید:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // می‌توانید از نمونه جدید ماژول برای تصمیم‌گیری درباره باطل‌سازی استفاده کنید.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

به یک رویداد HMR گوش دهد.

رویدادهای HMR زیر به صورت خودکار توسط Vite ارسال می‌شوند:

- `'vite:beforeUpdate'` وقتی یک به‌روزرسانی در حال اعمال است (مثلاً یک ماژول جایگزین می‌شود)
- `'vite:afterUpdate'` وقتی یک به‌روزرسانی اعمال شده است (مثلاً یک ماژول جایگزین شده است)
- `'vite:beforeFullReload'` وقتی یک بارگذاری کامل در حال رخ دادن است
- `'vite:beforePrune'` وقتی ماژول‌هایی که دیگر نیاز نیستند در حال حذف هستند
- `'vite:invalidate'` وقتی یک ماژول با `import.meta.hot.invalidate()` باطل می‌شود
- `'vite:error'` وقتی خطایی رخ می‌دهد (مثلاً خطای نحوی)
- `'vite:ws:disconnect'` وقتی اتصال WebSocket قطع می‌شود
- `'vite:ws:connect'` وقتی اتصال WebSocket (دوباره) برقرار می‌شود

رویدادهای سفارشی HMR نیز می‌توانند از طریق پلاگین‌ها ارسال شوند. برای جزئیات بیشتر [handleHotUpdate](./api-plugin#handlehotupdate) را ببینید.

## `hot.off(event, cb)`

حذف تابع بازگشتی از شنودگرهای رویداد.

## `hot.send(event, data)`

ارسال رویدادهای سفارشی به سرور توسعه Vite.

اگر قبل از اتصال فراخوانی شود، داده‌ها بافر شده و پس از برقراری اتصال ارسال می‌شوند.

برای اطلاعات بیشتر، [ارتباط کلاینت-سرور](/guide/api-plugin.html#client-server-communication) را ببینید، شامل بخشی درباره [تایپ رویدادهای سفارشی](/guide/api-plugin.html#typescript-for-custom-events).

## مطالعه بیشتر

اگر می‌خواهید بیشتر درباره نحوه استفاده از API HMR و نحوه کار آن در عمق یاد بگیرید، این منابع را بررسی کنید:

- [Hot Module Replacement is Easy](https://bjornlu.com/blog/hot-module-replacement-is-easy)
