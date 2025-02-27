# مدیریت asset های استاتیک

- مرتبط: [مسیر پایه عمومی (public base path)](./build#public-base-path)
- مرتبط: [`assetsInclude` آپشن کانفیگ](/config/shared-options.md#assetsinclude)

## ایمپورت کردن asset ها به عنوان URL

ایمپورت کردن assetها یک URL عمومی را بعد از سرو شدن برمی‌گرداند:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

برای مثال `imgUrl` هنگام توسعه ‎`/src/img.png` و بعد از بیلد پروداکشن تبدیل به‎`/assets/img.2d8efhg.png` می‌شود.

این رفتار مشابه `file-loader` در وب‌پک است. تفاوت اینجاست که فایل ایمپورت شده می‌تواند از آدرس‌های عمومی مطلق(absolute public paths) (بر اساس روت پروژه در هنگام توسعه) یا آدرس با مسیرهای نسبی (relative paths) باشد.

- رفرنس‌های `url()`‎ در CSS هم به همین روش کار می‌کنند.

- اگر از پلاگین Vue استفاده شود، رفرنس‌های فایل‌ها در تمپلیت‌های کامپوننت‌های تک فایلی ویو (Vue SFC) خودبخود تبدیل به ایمپورت می‌شوند.

- فرمت‌های رایج فایل‌های تصویری، مدیاها و فونت‌ها به صورت خودکار به عنوان asset شناسایی می‌شوند. شما میتوانید این لیست داخلی را با [گزینه `assetsInclude`](/config/shared-options.md#assetsinclude) گسترش دهید.

- asset های رفرنس داده شده به عنوان بخشی از گراف asset های بیلد گنجانده می‌شوند، نام فایل‌های هش شده را می‌گیرند و می‌توانند برای بهینه‌سازی توسط پلاگین‌ها مورد استفاده قرار گیرند.

- asset هایی که اندازه‌شان کمتر از مقدار تعیین شده‌ی [گزینه`assetsInlineLimit`](/config/build-options.md#build-assetsinlinelimit) باشد به شکل URL های دیتای base64 درون‌خطی(inline) خواهند شد.

- placeholder های Git LFS به طور خودکار از درون‌خطی شدن (inlining) مستثنی می‌شوند چرا که دارای محتوای فایلی که نمایش می‌دهند نیستند. برای inline کردن آنها، مطمئن شوید که محتواهای فایل را از Git LFS قبل از بیلد کردن دانلود کرده باشید.

- تایپ‌اسکریپت، به صورت پیشفرض، ایمپورت‌های asset های استاتیک را به عنوان یک ماژول معتبر تشخیص نمی‌دهد. برای برطرف کردن این موضوع، [`vite/client`](./features#client-types) را اضافه کنید.

::: tip Inline کردن SVGها از طریق `url()`‎
زمانی که URL یک فایل SVG را به متد `url()`‎ که به صورت دستی ساخته شده(manually constructed) با JS پاس می‌دهیم، متغیر باید داخل دبل کوت قرار گیرد.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.svg'
document.getElementById('hero-img').style.background = `url("${imgUrl}")`
```

:::

### ایمپورت URL های مشخص

asset هایی که در لیست داخلی یا `assetsInclude` قرار ندارند، می‌توانند با پسوند ‎`?url` به صراحت(explicitly) به عنوان URL ایمپورت شوند.این مورد کاربردی است، مثلا برای ایمپورت کردن [Houdini Paint Worklets](https://houdini.how/usage).

```js twoslash
import 'vite/client'
// ---cut---
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### مدیریت inline مشخص (Explicit Inline)

asset ها می‌توانند به شکل مشخص(explicit) با inline کردن یا بدون آن ایمپورت شوند این کار به ترتیب با پسوند ‎`?inline` یا ‎`?no-inline` انجام می‌شود.

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

### ایمپورت‌ کردن asset ها به شکل رشته (string)

asset ها می‌توانند به شکل رشته با استفاده از پسوند ‎`?raw` ایمپورت شوند.

```js twoslash
import 'vite/client'
// ---cut---
import shaderString from './shader.glsl?raw'
```

### ایمپورت کردن Script به عنوان یک Worker

اسکریپت‌ها می‌توانند به عنوان یک web worker با پسوند ‎`?worker` یا ‎`?sharedworker` ایمپورت شوند.

```js twoslash
import 'vite/client'
// ---cut---
// جداگانه در بیلد chunk
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js twoslash
import 'vite/client'
// ---cut---
// ورکر اشتراکی
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js twoslash
import 'vite/client'
// ---cut---
// inline کردن به شکل رشته‌های ‎base64
import InlineWorker from './shader.js?worker&inline'
```

برای جزییات بیشتر به [بخش Web Worker](./features.md#web-workers) سر بزنید.

## دایرکتوری `public`

اگر asset هایی دارید که:

- هرگز در سورس کد به آنها رفرنس داده نشده است. (مانند `robots.txt`)
- باید نام فایل آنها دست نخورده باقی بماند (بدون هش کردن)
- یا نمی‌خواهید که حتما مجبور باشید برای دریافت URL یک asset، ابتدا آنرا ایمپورت کنید

پس می‌توانید آن asset را در دایرکتوری مخصوص `public` درون فایل روت پروژه قرار دهید. asset های داخل این دایرکتوری در حالت dev در آدرس(path) اصلی `/` سرو می‌شوند و به همان شکلی که هستند در دایرکتوری روت در dist کپی می‌شوند.

 دایرکتوری به شکل پیش‌فرض ‎`<root>/public` است، اما از طریق [گزینه `publicDir`](/config/shared-options.md#publicdir) می‌تواند کانفیگ شود.

به یاد داشته باشید که شما همیشه می‌توانید asset های `public` را با آدرس‌دهی مطلق(absolute path) رفرنس دهید، برای مثال فایل `public/icon.png` باید به شکل ‎ `/icon.png` در سورس کد رفرنس داده شود.

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) یک قابلیت نیتیو ESM است که URL ماژول فعلی را به ما می‌دهد. ترکیب آن با [URL constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL) آدرس کامل یک asset ثابت را با استفاده از آدرس‌دهی نسبی از یک ماژول JS می‌دهد:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

این کد به صورت نیتیو در مرورگرهای مدرن کار می‌کند؛ در واقع اصلا نیازی نیست که Vite پردازشی روی این کد در حالت توسعه انجام دهد!

همچنین این پترن URLهای داینامیک را نیز از طریق template literalها ساپورت می‌کند:

```js
function getImageUrl(name) {
  // توجه داشته باشید که این، ساب‌دایرکتوری‌ها را شامل نمی‌شود
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

در زمان بیلد، Vite تغییرات لازم را اعمال خواهد که URLها همچنان حتی بعد از باندل‌کردن و هش‌کردن assetها به مکان درستی اشاره کنند. گرچه ‌رشته‌ی URL باید ثابت باشد تا بتواند آنالیز شود و در غیر این صورت کد به همان شکلی که بود باقی می‌ماند که این موضوع می‌تواند باعث ارورهای runtime شود اگر `build.target` عبارت `import.meta.url` را ساپورت نکند.

```js
// این کد را تغییر نمی‌دهد vite
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: details چگونه کار می‌کند

Vite متد `getImageUrl` را تغییر می‌دهد به:

```js
import __img0png from './dir/img0.png'
import __img1png from './dir/img1.png'

function getImageUrl(name) {
  const modules = {
    './dir/img0.png': __img0png,
    './dir/img1.png': __img1png,
  }
  return new URL(modules[`./dir/${name}.png`], import.meta.url).href
}
```

:::

::: warning با SSR کار نمی‌کند
این پترن اگر که شما Vite را برای رندر سمت سرور(server-side rendering) استفاده می‌کنید کار نمی‌کند چرا که `import.meta.url` معانی متفاوتی در مرورگرها در مقابل Node.js دارد. سرور باندل(server bundle) نیز نمی‌تواند URL میزبان کلاینت(client host URL) را در لحظه تشخیص دهد.
:::
