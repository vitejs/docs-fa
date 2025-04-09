# ویژگی‌ها

در ابتدایی‌ترین سطح، توسعه با Vite تفاوت زیادی با استفاده از یک سرور فایل استاتیک ندارد. اما Vite امکانات بیشتری فراتر از ایمپورت ESM بومی ارائه می‌دهد تا از ویژگی‌های مختلفی که معمولاً در راه‌اندازی مبتنی بر باندلر دیده می‌شوند، پشتیبانی کند.

## حل وابستگی‌های npm و پیش‌باندل کردن

ایمپورت ES بومی از ایمپورت ماژول‌های بدون مسیر مشخص مانند نمونه زیر پشتیبانی نمی‌کند:

```js
import { someMethod } from 'my-dep'
```

کد بالا در مرورگر خطا ایجاد می‌کند. Vite ایمپورت ماژول‌های بدون مسیر مانند این را در تمامی فایل‌های منبع شناسایی کرده و اقدامات زیر را انجام می‌دهد:

1. **[پیش‌باندل](./dep-pre-bundling):** این فرآیند سرعت بارگذاری صفحه را بهبود می‌بخشد و ماژول‌های CommonJS/UMD را به ESM تبدیل می‌کند. مرحله پیش‌باندل (پیش بسته‌بندی) با استفاده از ابزار [esbuild](http://esbuild.github.io/) انجام می‌شود که زمان  زمان راه‌اندازی اولیه (cold start) ابزار Vite را به طور قابل توجهی سریع‌تر از هر باندلر جاوااسکریپتی دیگر می‌کند.

2. بازنویسی ایمپورت‌ها به آدرس‌های معتبر مانند `‎/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` تا مرورگر بتواند آنها را به درستی ایمپورت کند.

**وابستگی‌ها به‌شدت در کش ذخیره می‌شوند**

Vite درخواست‌های مربوط به وابستگی‌ها را از طریق هدرهای HTTP کش می‌کند، بنابراین اگر بخواهید یک وابستگی را به‌صورت محلی ویرایش یا دیباگ کنید، مراحل ذکر شده [اینجا](./dep-pre-bundling#browser-cache) را دنبال کنید.

## جایگزینی سریع ماژول (Hot Module Replacement)

Vite یک **[API جایگزینی سریع ماژول (HMR)](./api-hmr)** بر پایه ESM بومی ارائه می‌دهد. فریمورک‌هایی که از قابلیت HMR پشتیبانی می‌کنند، می‌توانند از این API استفاده کنند تا به‌روزرسانی‌های فوری و دقیق را بدون نیاز به بارگذاری مجدد صفحه یا از دست رفتن وضعیت برنامه ارائه دهند. Vite یکپارچه‌سازی‌های HMR اختصاصی برای **[کامپوننت‌های تک‌فایلی Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)** و **[React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)** فراهم می‌کند. همچنین یکپارچه‌سازی‌های رسمی برای **Preact** از طریق **[‎@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite)** وجود دارد.

توجه داشته باشید که نیازی به تنظیم دستی این موارد ندارید. زمانی که یک برنامه را از طریق **[`create-vite`](./)** ایجاد می‌کنید، قالب‌های انتخابی این تنظیمات را از پیش برای شما پیکربندی کرده‌اند.

## تایپ‌اسکریپت

Vite به‌طور پیش‌فرض از ایمپورت کردن فایل‌های `‎.ts` پشتیبانی می‌کند.

### فقط تبدیل (Transpile Only)

توجه داشته باشید که Vite تنها عملیات **تبدیل (transpilation)** را روی فایل‌های `‎.ts` انجام می‌دهد و **هیچ‌گونه بررسی تایپ (type checking)** انجام نمی‌دهد. این ابزار فرض می‌کند که بررسی تایپ توسط IDE یا فرآیند ساخت شما مدیریت می‌شود.

دلیل اینکه Vite بررسی تایپ را به‌عنوان بخشی از فرآیند تبدیل انجام نمی‌دهد این است که این دو وظیفه به‌صورت بنیادی متفاوت عمل می‌کنند. تبدیل (Transpilation) می‌تواند به‌صورت مستقل برای هر فایل انجام شود و کاملاً با مدل کامپایل در لحظه Vite هماهنگ است. در مقایسه، بررسی تایپ به اطلاعات کامل از کل گراف ماژول نیاز دارد. گنجاندن بررسی تایپ در مراحل تبدیل Vite به‌ناچار مزایای سرعتی آن را کاهش می‌دهد.

وظیفه Vite این است که ماژول‌های منبع شما را به شکلی درآورد که بتوانند در سریع‌ترین زمان ممکن در مرورگر اجرا شوند. به همین منظور، پیشنهاد می‌شود که بررسی‌های تحلیلی استاتیک را از مراحل تبدیل Vite جدا کنید. این اصل برای سایر بررسی‌های تحلیلی استاتیک مانند ESLint نیز صادق است.

- برای بیلد‌های پروداکش، می‌توانید دستور `tsc --noEmit` را علاوه بر دستور بیلد Vite اجرا کنید.

- در طول توسعه، اگر به اطلاعات بیشتری فراتر از پیشنهادات IDE نیاز دارید، پیشنهاد می‌شود که دستور `tsc --noEmit --watch` را در یک فرآیند جداگانه اجرا کنید، یا اگر ترجیح می‌دهید که خطاهای تایپ مستقیماً در مرورگر گزارش شوند، از [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) استفاده کنید.

Vite از [esbuild](https://github.com/evanw/esbuild) برای تبدیل تایپ‌اسکریپت به جاوااسکریپت استفاده می‌کند که حدود ۲۰ تا ۳۰ برابر سریع‌تر از `tsc` معمولی است و به‌روزرسانی‌های HMR می‌توانند در کمتر از ۵۰ میلی‌ثانیه در مرورگر منعکس شوند.

برای جلوگیری از مشکلات احتمالی مانند باندل نادرست ایمپورت فقط تایپ (type-only imports)، از سینتکس [Type-Only Imports and Export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) استفاده کنید. به‌عنوان مثال:

```ts
import type { T } from 'only/types'
export type { T }
```

### گزینه‌های کامپایلر TypeScript

برخی از فیلدهای پیکربندی در `compilerOptions` در فایل `tsconfig.json` نیاز به توجه ویژه دارند.

#### `isolatedModules`

- [مستندات TypeScript](https://www.typescriptlang.org/tsconfig#isolatedModules)

باید به `true` تنظیم شود.

این به این دلیل است که `esbuild` فقط ترنسپایل را بدون اطلاع از تایپ‌ها انجام می‌دهد و از ویژگی‌هایی مانند const enum و ایمپورت تایپ ضمنی پشتیبانی نمی‌کند.

باید `‎"isolatedModules": true` را در `tsconfig.json` زیر `compilerOptions` تنظیم کنید تا TypeScript به شما در مورد ویژگی‌هایی که با ترنسپایل ایزوله کار نمی‌کنند، هشدار دهد.

اگر یک وابستگی با `‎"isolatedModules": true` به خوبی کار نمی‌کند، می‌توانید از `‎"skipLibCheck": true` استفاده کنید تا به طور موقت خطاها را تا زمانی که در بالادست رفع شوند، نادیده بگیرید.

#### `useDefineForClassFields`

- [مستندات TypeScript](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

مقدار پیش‌فرض `true` خواهد بود اگر target در تایپ‌اسکریپت `ES2022` یا جدیدتر باشد مانند `ESNext`. این با [تایپ‌اسکریپت نسخه 4.3.2 و بعد از آن](https://github.com/microsoft/TypeScript/pull/42663).
سایر target ها در تایپ‌اسکریپت به طور پیش‌فرض `false` خواهند بود.

`true` مطابق با استاندارد رانتایم ECMAScript است.

اگر از کتابخانه‌ای استفاده می‌کنید که به شدت به فیلدهای کلاس وابسته است، لطفاً مطمئن شوید که کتابخانه با تنظیمات شما سازگار است.
در حالی که بیشتر کتابخانه‌ها انتظار دارند که `‎"useDefineForClassFields": true` باشد، اگر کتابخانه شما از این ویژگی پشتیبانی نمی‌کند، می‌توانید به صراحت `useDefineForClassFields` را به `false` تنظیم کنید.

#### `target`

- [مستندات TypeScript](https://www.typescriptlang.org/tsconfig#target)

Vite مقدار `target` در `tsconfig.json` را نادیده می‌گیرد و از همان تنظیمات `esbuild` پیروی می‌کند.

برای مشخص کردن target در حالت توسعه، می‌توانید از گزینه [`esbuild.target`](/config/shared-options.html#esbuild) استفاده کنید که به طور پیش‌فرض `esnext` برای کمترین ترنسپایل تنظیم شده است. در بیلد، گزینه [`build.target`](/config/build-options.html#build-target) اولویت بالاتری نسبت به `esbuild.target` دارد و در صورت نیاز می‌توانید آن را تنظیم کنید.

::: warning `useDefineForClassFields`

اگر `target` در `tsconfig.json` برابر با `ESNext` یا `ES2022` یا جدیدتر نباشد، یا اگر فایل `tsconfig.json` وجود نداشته باشد، مقدار پیش‌فرض `useDefineForClassFields` برابر با `false` خواهد بود که ممکن است با مقدار پیش‌فرض `esbuild.target` یعنی `esnext` مشکل‌ساز شود. این ممکن است به [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) ترنسپایل شود که ممکن است مرورگر شما از آن‌ها پشتیبانی نکند.

بنابراین، توصیه می‌شود که `target` را به `ESNext` یا `ES2022` یا جدیدتر تنظیم کنید، یا `useDefineForClassFields` را به صراحت در `tsconfig.json` به `true` تنظیم کنید.
:::

#### سایر گزینه‌های کامپایلر که بر نتیجه بیلد تأثیر می‌گذارند

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
قالب‌های شروع Vite به طور پیش‌فرض `"skipLibCheck": "true"` دارند تا از بررسی تایپ وابستگی‌ها جلوگیری کنند، زیرا ممکن است فقط از نسخه‌ها و تنظیمات خاصی از TypeScript پشتیبانی کنند. می‌توانید اطلاعات بیشتری را در [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688) بیابید.
:::

### تایپ‌های کلاینت

تایپ‌های پیش‌فرض Vite برای API مورد استفاده در Node.js آن هستند. برای شبیه‌سازی محیط کد سمت کلاینت در یک برنامه Vite، یک فایل تعریف `d.ts` اضافه کنید:

```typescript
/// <reference types="vite/client" />
```

::: details استفاده از `compilerOptions.types`

به طور جایگزین، می‌توانید `vite/client` را به `compilerOptions.types` در `tsconfig.json` اضافه کنید:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client", "some-other-global-lib"]
  }
}
```

توجه داشته باشید که اگر [`compilerOptions.types`](https://www.typescriptlang.org/tsconfig#types) مشخص شده باشد، تنها این پکیج‌ها در محدوده سراسری گنجانده خواهند شد (به جای همه پکیج‌های قابل مشاهده `‎@types`).

:::

`vite/client`کار تایپ‌های زیر را فراهم می‌کند:

- ایمپورت asset ها (مثلاً ایمپورت یک فایل `‎.svg`)
- تایپ‌ها برای [ثابت‌ها](./env-and-mode#env-variables) تزریق شده توسط Vite در `import.meta.env`
- تایپ‌ها برای [HMR API](./api-hmr) در `import.meta.hot`

::: tip نکته
برای بازنویسی تایپ‌های پیش‌فرض، یک فایل تعریف تایپ اضافه کنید که تایپ‌های شما را شامل شود. سپس، مرجع تایپ را قبل از `vite/client` اضافه کنید.

برای مثال، برای تبدیل ایمپورت پیش‌فرض `‎*.svg` به یک کامپوننت React:

- `vite-env-override.d.ts` (فایلی که تایپ‌های شما را شامل می‌شود):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- فایلی که مرجع به `vite/client` را شامل می‌شود:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## HTML

فایل‌های HTML در پروژه Vite به عنوان نقاط ورودی برای برنامه شما عمل می‌کنند و ساخت برنامه‌های تک‌صفحه‌ای و [چندصفحه‌ای](/guide/build.html#multi-page-app) را ساده می‌کنند.

می‌توان به هر فایل HTML که در ریشه پروژه شماست، مستقیماً از طریق مسیر دایرکتوری آن دسترسی پیدا کرد:

- `‎<root>/index.html` -> `http://localhost:5173/‎`
- `‎<root>/about.html` -> `http://localhost:5173/about.html`
- `‎<root>/blog/index.html` -> `http://localhost:5173/blog/index.html`

asset هایی که توسط عناصر HTML مانند `<script type="module" src>` و `<link href>` ارجاع داده می‌شوند، به عنوان بخشی از برنامه پردازش و بسته‌بندی می‌شوند. لیست کامل عناصر پشتیبانی شده به شرح زیر است:

- `<audio src>`
- `<embed src>`
- `<img src>` و `<img srcset>`
- `<image src>`
- `<input src>`
- `<link href>` و `<link imagesrcset>`
- `<object data>`
- `<script type="module" src>`
- `<source src>` و `<source srcset>`
- `<track src>`
- `<use href>` و `<use xlink:href>`
- `<video src>` و `<video poster>`
- `<meta content>`
  - فقط اگر ویژگی `name` با `msapplication-tileimage` ، `msapplication-square70x70logo` ، `msapplication-square150x150logo` ، `msapplication-wide310x150logo` ، `msapplication-square310x310logo` ، `msapplication-config` ، `twitter:image` مطابقت داشته باشد.
  - یا فقط اگر ویژگی `property` با `og:image` ، `og:image:url` ، `og:image:secure_url` ، `og:audio` ، `og:audio:secure_url` ، `og:video` ، `og:video:secure_url` مطابقت داشته باشد.

```html {4-5,8-9}
<!doctype html>
<html>
  <head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <img src="/src/images/logo.svg" alt="logo" />
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

برای غیرفعال کردن پردازش HTML در برخی المنت‌ها، می‌توانید ویژگی `vite-ignore` را به عنصر اضافه کنید که می‌تواند در هنگام ارجاع به دارایی‌های خارجی یا CDN مفید باشد.

## فریمورک‌ها

تمام فریم‌ورک‌های مدرن با Vite یکپارچه‌سازی شده‌اند. بیشتر پلاگین‌های فریم‌ورک توسط تیم‌های هر فریم‌ورک نگهداری می‌شوند، به جز پلاگین‌های رسمی Vue و React Vite که توسط سازمان Vite نگهداری می‌شوند:

- پشتیبانی از Vue از طریق [‎@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- پشتیبانی از Vue JSX از طریق [‎@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- پشتیبانی از React از طریق [‎@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)
- پشتیبانی از React با استفاده از SWC از طریق [‎@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

برای اطلاعات بیشتر، به [راهنمای پلاگین‌ها](https://vite.dev/plugins) مراجعه کنید.

## JSX

فایل‌های `‎.jsx` و `‎.tsx` نیز به صورت پیش‌فرض پشتیبانی می‌شوند. ترنسپایل JSX نیز از طریق [esbuild](https://esbuild.github.io) انجام می‌شود.

فریم‌ورک انتخابی شما به طور پیش‌فرض JSX را پیکربندی خواهد کرد (برای مثال، کاربران Vue باید از پلاگین رسمی [‎@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) استفاده کنند که ویژگی‌های خاص Vue 3 از جمله HMR، حل و فصل سراسری کامپوننت‌ها، دایرکتیوها و اسلات‌ها را فراهم می‌کند).

اگر از JSX با فریم‌ورک خودتان استفاده می‌کنید، می‌توانید `jsxFactory` و `jsxFragment` سفارشی را با استفاده از گزینه [`esbuild`](/config/shared-options.md#esbuild) تنظیم کنید. به عنوان مثال، پلاگین Preact از این تنظیمات استفاده می‌کند:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

جزئیات بیشتر در [مستندات esbuild](https://esbuild.github.io/content-types/#jsx).

می‌توانید از `jsxInject` (که یک گزینه مخصوص Vite است) برای تزریق کمک‌کننده‌های JSX استفاده کنید تا از ایمپورت دستی جلوگیری کنید:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

ایمپورت فایل‌های `‎.css` محتوای آن‌ها را از طریق یک تگ `<style>` به صفحه اضافه می‌کند و از HMR پشتیبانی می‌کند.

### درون‌خطی کردن و بازنویسی `‎@import`

Vite به صورت پیش‌فرض برای پشتیبانی از درون‌خطی کردن `‎@import` در CSS با `postcss-import` پیکربندی شده است. همچنین، نام‌های مستعار Vite برای `‎@import` در CSS نیز رعایت می‌شوند. علاوه بر این، تمام ارجاعات `url()‎` در CSS، حتی اگر فایل‌های ایمپورت شده در دایرکتوری‌های مختلف باشند، به طور خودکار بازنویسی می‌شوند تا از صحت آن‌ها اطمینان حاصل شود.

نام‌های مستعار `‎@import` و بازنشانی URL برای فایل‌های Sass و Less نیز پشتیبانی می‌شوند (به [پیش‌پردازنده‌های CSS](#پیشپردازندههای-css) مراجعه کنید).

### PostCSS

اگر پروژه شامل پیکربندی معتبر PostCSS باشد (هر فرمتی که توسط [postcss-load-config](https://github.com/postcss/postcss-load-config) پشتیبانی می‌شود، مانند `postcss.config.js`)، به طور خودکار به تمام CSS ایمپورت شده اعمال می‌شود.

توجه داشته باشید که کوچک‌سازی CSS پس از PostCSS اجرا می‌شود و از گزینه [`build.cssTarget`](/config/build-options.md#build-csstarget) استفاده خواهد کرد.

### ماژول‌های CSS

هر فایل CSS که با `‎.module.css` ختم شود، به عنوان یک [فایل ماژول‌های CSS](https://github.com/css-modules/css-modules) در نظر گرفته می‌شود. ایمپورت چنین فایلی آبجکت ماژول مربوطه را برمی‌گرداند:

```css [example.module.css]
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

تنظیمات ماژول‌های CSS را می‌توان از طریق گزینه [`css.modules`](/config/shared-options.md#css-modules) پیکربندی کرد.

اگر `css.modules.localsConvention` تنظیم شده باشد تا نام‌های محلی به صورت camelCase فعال شوند (مثلاً `localsConvention: 'camelCaseOnly'‎`)، می‌توانید از ایمپورت‌های نام‌گذاری شده نیز استفاده کنید:

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### پیش‌پردازنده‌های CSS

از آنجا که Vite فقط مرورگرهای مدرن را هدف قرار می‌دهد، توصیه می‌شود از متغیرهای بومی CSS با پلاگین‌های PostCSS که پیش‌نویس‌های CSSWG را پیاده‌سازی می‌کنند (مثلاً [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) استفاده کنید و CSS ساده و مطابق با استانداردهای آینده بنویسید.

با این حال، Vite پشتیبانی داخلی از فایل‌های `‎.scss` ، `‎.sass` ، `‎.less` ، `‎.styl` و `‎.stylus` را فراهم می‌کند. نیازی به نصب پلاگین‌های مخصوص Vite برای آن‌ها نیست، اما باید پیش‌پردازنده مربوطه نصب شده باشد:

```bash
# .scss and .sass
npm add -D sass-embedded # or sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

اگر از کامپوننت‌های تک‌فایلی Vue استفاده می‌کنید، این به طور خودکار `<style lang="sass"‎>` و موارد مشابه را فعال می‌کند.

Vite بهبودهایی در حل `‎@import` برای Sass و Less ارائه می‌دهد تا نام‌های مستعار Vite نیز رعایت شوند. علاوه بر این، ارجاعات نسبی `url()‎` در فایل‌های Sass/Less ایمپورت شده که در دایرکتوری‌های مختلف از فایل ریشه قرار دارند، به طور خودکار بازنویسی می‌شوند تا از صحت آن‌ها اطمینان حاصل شود.

نام مستعار `‎@import` و بازنویسی URL برای Stylus به دلیل محدودیت‌های API آن پشتیبانی نمی‌شوند.

همچنین می‌توانید از ماژول‌های CSS همراه با پیش‌پردازنده‌ها استفاده کنید، با اضافه کردن `‎.module` به پسوند فایل، به عنوان مثال `style.module.scss`.

### غیرفعال کردن تزریق CSS به صفحه

تزریق خودکار محتوای CSS را می‌توان از طریق پارامتر `‎?inline` غیرفعال کرد. در این حالت، رشته CSS پردازش شده به عنوان خروجی پیش‌فرض ماژول برگردانده می‌شود، اما استایل‌ها به صفحه تزریق نمی‌شوند.

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // به صفحه تزریق خواهد شد
import otherStyles from './bar.css?inline' // تزریق نخواهد شد
```

::: tip نکته
ایمپورت‌های پیش‌فرض و نام‌گذاری شده از فایل‌های CSS (مثلاً `import style from './foo.css'‎`) از Vite 5 حذف شده‌اند. به جای آن از کوئری `‎?inline` استفاده کنید.
:::

### Lightning CSS

از Vite 4.4، پشتیبانی آزمایشی برای [Lightning CSS](https://lightningcss.dev/) وجود دارد. می‌توانید با اضافه کردن [`css.transformer: 'lightningcss'‎`](../config/shared-options.md#css-transformer) به فایل پیکربندی خود و نصب وابستگی اختیاری [`lightningcss`](https://www.npmjs.com/package/lightningcss) از آن استفاده کنید:

```bash
npm add -D lightningcss
```

اگر فعال شود، فایل‌های CSS توسط Lightning CSS به جای PostCSS پردازش خواهند شد. برای پیکربندی آن، می‌توانید گزینه‌های Lightning CSS را به گزینه پیکربندی [`css.lightningcss`](../config/shared-options.md#css-lightningcss) پاس دهید.

برای پیکربندی ماژول‌های CSS، باید از [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) به جای [`css.modules`](../config/shared-options.md#css-modules) استفاده کنید (که نحوه پردازش ماژول‌های CSS توسط PostCSS را پیکربندی می‌کند).

به طور پیش‌فرض، Vite از esbuild برای کوچک‌سازی CSS استفاده می‌کند. Lightning CSS نیز می‌تواند به عنوان کوچک‌ساز CSS با گزینه [`build.cssMinify: 'lightningcss'‎`](../config/build-options.md#build-cssminify) استفاده شود.

## assets های استاتیک

ایمپورت یک assets استاتیک، URL عمومی ساخته شده آن را برمی‌گرداند:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

کوئری‌های خاص می‌توانند نحوه بارگذاری assets ها را تغییر دهند:

```js twoslash
import 'vite/client'
// ---cut---
// URL به عنوان assets بارگذاری صریح
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// به عنوان رشته assets بارگذاری
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// Web Workers بارگذاری
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// در زمان بیلد درون‌خطی می‌شوند base64 به صورت رشته‌های Web Workers
import InlineWorker from './worker.js?worker&inline'
```

جزئیات بیشتر در [مدیریت assets های استاتیک](./assets).

## JSON

فایل‌های JSON می‌توانند به طور مستقیم ایمپورت شوند - ایمپورت‌های نام‌گذاری شده نیز پشتیبانی می‌شوند:

```js twoslash
import 'vite/client'
// ---cut---
// import the entire object
import json from './example.json'
// import a root field as named exports - helps with tree-shaking!
import { field } from './example.json'
```

## ایمپورت Glob

Vite از ایمپورت چندین ماژول از فایل-سیستم با استفاده از تابع خاص `import.meta.glob` پشتیبانی می‌کند:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

کد بالا به شکل زیر تبدیل خواهد شد:

```js
// Vite کد تولید شده توسط
const modules = {
  './dir/bar.js': () => import('./dir/bar.js'),
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

سپس می‌توانید بر روی کلیدهای آبجکت `modules` حلقه بزنید تا به ماژول‌های مربوطه دسترسی پیدا کنید:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

فایل‌های پیدا شده به طور پیش‌فرض از طریق ایمپورت داینامیک به صورت lazy-loaded بارگذاری می‌شوند و در زمان بیلد به چندین chunk (بخش) جداگانه تقسیم می‌شوند. اگر ترجیح می‌دهید همه ماژول‌ها را مستقیماً ایمپورت کنید (مثلاً برای اعمال اثرات جانبی این ماژول‌ها در ابتدا)، می‌توانید `{ eager: true }` را به عنوان آرگومان دوم پاس دهید:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

کد بالا به شکل زیر تبدیل خواهد شد:

```js
// Vite کد تولید شده توسط
import * as __vite_glob_0_0 from './dir/bar.js'
import * as __vite_glob_0_1 from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

### الگوهای متعدد

آرگومان اول می‌تواند یک آرایه از glob ها باشد، برای مثال:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### الگوهای منفی

الگوهای glob منفی نیز پشتیبانی می‌شوند (با پیشوند `!`). برای نادیده گرفتن برخی فایل‌ها از نتیجه، می‌توانید الگوهای exclude را به آرگومان اول اضافه کنید:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// Vite کد تولید شده توسط
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### ایمپورت‌های نام‌گذاری شده

امکان ایمپورت بخش‌هایی از ماژول‌ها با استفاده از گزینه `import` وجود دارد.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// Vite کد تولید شده توسط
const modules = {
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
}
```

هنگامی که با `eager` ترکیب شود، حتی می‌توان tree-shaking را برای این ماژول‌ها فعال کرد.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// Vite کد تولید شده توسط
import { setup as __vite_glob_0_0 } from './dir/bar.js'
import { setup as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

برای ایمپورت خروجی پیش‌فرض، `import` را به `default` تنظیم کنید.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// Vite کد تولید شده توسط
import { default as __vite_glob_0_0 } from './dir/bar.js'
import { default as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

#### کوئری‌های سفارشی

همچنین می‌توانید از گزینه `query` برای ارائه کوئری‌ها به ایمپورت‌ها استفاده کنید، به عنوان مثال، برای ایمپورت asset ها [به عنوان رشته](https://vite.dev/guide/assets.html#importing-asset-as-string) یا [به عنوان URL](https://vite.dev/guide/assets.html#importing-asset-as-url):

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// Vite کد تولید شده توسط
const moduleStrings = {
  './dir/bar.svg': () => import('./dir/bar.svg?raw').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/bar.svg': () => import('./dir/bar.svg?url').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?url').then((m) => m['default']),
}
```

همچنین می‌توانید کوئری‌های سفارشی برای استفاده سایر پلاگین‌ها ارائه دهید:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

### نکات مهم درباره Glob Import

توجه داشته باشید که:

- این یک ویژگی مخصوص Vite است و یک استاندارد وب یا ES نیست.
- الگوهای glob مانند مشخص‌کننده‌های ایمپورت در نظر گرفته می‌شوند: آن‌ها باید یا نسبی باشند (با `‎./` شروع شوند) یا مطلق (با `/` شروع شوند و نسبت به ریشه پروژه حل شوند) یا یک مسیر مستعار باشند (به گزینه [`resolve.alias`](/config/shared-options.md#resolve-alias) مراجعه کنید).
- تطبیق glob از طریق [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) انجام می‌شود.
- همچنین باید توجه داشته باشید که تمام آرگومان‌ها در `import.meta.glob` باید **به صورت ثابت** پاس داده شوند. نمی‌توانید از متغیرها یا عبارات در آن‌ها استفاده کنید.

## ایمپورت داینامیک

مشابه [glob import](#ایمپورت-glob)، ابزار Vite همچنین از ایمپورت داینامیک با متغیرها پشتیبانی می‌کند.

```ts
const module = await import(`./dir/${file}.js`)
```

توجه داشته باشید که متغیرها فقط نام فایل‌ها را در یک عمق نشان می‌دهند. اگر `file` برابر با `'foo/bar'` باشد، ایمپورت شکست خواهد خورد. برای استفاده پیشرفته‌تر، می‌توانید از ویژگی [glob import](#ایمپورت-glob) استفاده کنید.

## WebAssembly

فایل‌های `‎.wasm` پیش‌کامپایل شده را می‌توان با `‎?init` ایمپورت کرد.
خروجی پیش‌فرض یک تابع راه‌اندازی خواهد بود که یک Promise از [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance) را برمی‌گرداند:

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

تابع init همچنین می‌تواند یک importObject بگیرد که به عنوان آرگومان دوم به [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) پاس داده می‌شود:

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

در بیلد پروداکش، فایل‌های `‎.wasm` که کوچکتر از `assetInlineLimit` هستند به صورت رشته‌های base64 درون‌خطی خواهند شد. در غیر این صورت، به عنوان یک [asset استاتیک](./assets) در نظر گرفته می‌شوند و در صورت درخواست بارگذاری خواهند شد.

::: tip نکته
[پیشنهاد یکپارچه‌سازی ماژول ES برای WebAssembly](https://github.com/WebAssembly/esm-integration) در حال حاضر پشتیبانی نمی‌شود.
از [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) یا سایر پلاگین‌های جامعه برای مدیریت این موضوع استفاده کنید.
:::

### دسترسی به ماژول WebAssembly

اگر نیاز به دسترسی به آبجکت `Module` دارید، مثلاً برای نمونه‌سازی چندباره آن، از یک [ایمپورت URL صریح](./assets#explicit-url-imports) برای حل و فصل asset استفاده کنید و سپس نمونه‌سازی را انجام دهید:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

### دریافت ماژول در Node.js

در SSR، در `fetch()‎` که به عنوان بخشی از ایمپورت `‎?init` انجام می‌شود، ممکن است با خطای `TypeError: Invalid URL` مواجه شود.
به مشکل [پشتیبانی از wasm در SSR](https://github.com/vitejs/vite/issues/8882) مراجعه کنید.

در اینجا یک روش جایگزین آورده شده است، با فرض اینکه پایه پروژه دایرکتوری فعلی است:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Web Workers

### ایمپورت با سازنده‌ها (Constructors)

یک اسکریپت web worker می‌تواند با استفاده از [`new Worker()‎`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) و [`new SharedWorker()‎`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker) ایمپورت شود. در مقایسه با پسوندهای worker، این سینتکس به استانداردها نزدیک‌تر است و روش **توصیه‌شده** برای ایجاد workers است.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

سازنده Worker همچنین گزینه‌هایی را می‌پذیرد که می‌توان از آن‌ها برای ایجاد «ماژول Worker» استفاده کرد:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

شناسایی Worker تنها در صورتی کار می‌کند که سازنده `new URL()‎` به‌طور مستقیم در دستور `new Worker()‎` استفاده شده باشد. علاوه بر این، تمامی پارامترها باید مقادیر ثابتی مانند رشته‌های ثابت باشند.

### ایمپورت با پسوندهای دارای کوئری

یک اسکریپت web worker می‌تواند با اضافه کردن `‎?worker` یا `‎?sharedworker` به درخواست ایمپورت، مستقیماً ایمپورت شود. خروجی پیش‌فرض یک سازنده worker سفارشی خواهد بود:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

اسکریپت worker می‌تواند از دستور ESM `import` به جای `importScripts()‎` استفاده کند. **توجه**: در زمان توسعه، این موضوع به [پشتیبانی بومی مرورگر](https://caniuse.com/?search=module%20worker) متکی است، اما در زمان بیلد پروداکشن، کد ماژول‌ها کامپایل و از بین می‌رود.

به طور پیش‌فرض، اسکریپت worker در بیلد پروداکشن به صورت یک chunk جداگانه خروجی گرفته می‌شود. اگر می‌خواهید worker را به صورت رشته‌های base64 درون‌خطی کنید، کوئری `inline` را اضافه کنید:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

اگر مایلید worker را به صورت یک URL دریافت کنید، کوئری `url` را اضافه کنید:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

برای مشاهده جزییات درباره نحوه باندل شدن همه‌ی worker ها، به [گزینه‌های Worker](/config/worker-options.md) مراجعه کنید.

## سیاست امنیت محتوایی (CSP)

به دلیل ساختار داخلی Vite، برای استفاده از CSP باید بعضی دستورالعمل‌ها یا تنظیمات خاص اعمال شوند.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

وقتی [`html.cspNonce`](/config/shared-options#html-cspnonce) تنظیم شود، Vite یک اتریبیوت nonce با مقدار تعیین‌شده به تمام تگ‌های `<script>` و `<style>` اضافه می‌کند و همچنین تگ‌های `<link>` برای استایل‌ها و ماژول‌های preload. علاوه بر این، وقتی این گزینه تنظیم شود، Vite یک تگ متا نیز تزریق می‌کند. <br> (`‎<meta property="csp-nonce" nonce="PLACEHOLDER"‎ />‎`).

مقدار nonce در یک تگ متا با `property="csp-nonce"‎` هنگام توسعه و پس از بیلد، در صورت نیاز توسط Vite استفاده می‌شود.

:::warning هشدار
اطمینان حاصل کنید که این placeholder را برای هر درخواست با مقدار یکتایی جایگزین کنید. این کار برای جلوگیری از دور زدن سیاست امنیتی محتوا ضروری است.
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

Vite به طور پیش‌فرض، در زمان بیلد، asset ‌های کوچک را به صورت data URIs درون‌خطی می‌کند. برای استفاده از آن در بخش‌های مرتبط (مثلاً [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src) و [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)) باید `data:‎` مجاز باشد، یا با تنظیم [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit) می‌توانید آن را غیرفعال کنید.

:::warning هشدار
هرگز `data:‎` را برای [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) مجاز نکنید. این کار امکان تزریق اسکریپت‌های دلخواه را فراهم می‌کند.
:::

## بهینه‌سازی بیلد

> امکانات زیر به صورت خودکار در فرآیند بیلد اعمال می‌شوند و نیازی به پیکربندی صریح ندارند، مگر در صورتی که بخواهید آن‌ها را غیرفعال کنید.

### تقسیم کد CSS

Vite به صورت خودکار CSS استفاده‌شده توسط ماژول‌های موجود در یک chunk ناهمگام (chunk ناهمگام 'async chunk'، منظور بخشی از کد است که به صورت مجزا و در زمان نیاز بارگذاری می‌شود) را استخراج کرده و یک فایل جداگانه برای آن ایجاد می‌کند. این فایل CSS به صورت خودکار از طریق یک تگ `<link>` هنگام بارگیری chunk ناهمگام لود می‌شود و اطمینان حاصل می‌شود که ارزیابی chunk بعد از بارگیری کامل CSS انجام شود تا از [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.) جلوگیری شود.

اگر ترجیح می‌دهید تمام CSS در یک فایل گردآوری شود، می‌توانید با تنظیم [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) روی `false` تقسیم کد CSS را غیرفعال کنید.

### تولید دستورالعمل‌های پیش‌بارگیری

Vite به طور خودکار دستورالعمل‌های `<link rel="modulepreload"‎>` را برای بخش‌های ورودی و ایمپورت‌های مستقیم آن‌ها در HTML نهایی تولید می‌کند.

### بهینه‌سازی بارگیری بخش‌های async

در برنامه‌های دنیای واقعی، Rollup اغلب "بخش‌های مشترک" را تولید می‌کند - کدهایی که بین دو یا چند بخش دیگر به اشتراک گذاشته می‌شوند. همراه با ایمپورت‌های پویا، چنین سناریویی بسیار رایج است:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" dir="ltr" />

در سناریوهای بهینه‌نشده، وقتی بخش `A` که async هست ایمپورت می‌شود، مرورگر باید ابتدا `A` را درخواست و پردازش کند تا متوجه شود که به بخش مشترک `C` نیز نیاز دارد. این باعث یک رفت و برگشت اضافی در شبکه می‌شود:

```
Entry ---> A ---> C
```

Vite به طور خودکار فراخوانی‌های ایمپورت پویای تقسیم‌شده کد را با یک مرحله پیش‌بارگیری بازنویسی می‌کند، به طوری که وقتی `A` درخواست می‌شود، `C` به صورت **موازی** دریافت می‌شود:

```
Entry ---> (A + C)
```

ممکن است `C` نیز ایمپورت‌های دیگری داشته باشد که در حالت بهینه‌نشده منجر به رفت و برگشت‌های بیشتری می‌شود. بهینه‌سازی Vite تمام ایمپورت‌های مستقیم را ردیابی می‌کند تا صرف نظر از عمق ایمپورت، رفت و برگشت‌ها را به طور کامل حذف کند.
