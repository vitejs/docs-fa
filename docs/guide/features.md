# ویژگی‌ها

در ابتدایی‌ترین سطح، توسعه با Vite تفاوت زیادی با استفاده از یک سرور فایل استاتیک ندارد. اما Vite امکانات متعددی فراتر از ایمپورت ESM بومی ارائه می‌دهد تا از ویژگی‌های مختلفی که معمولاً در راه‌اندازی مبتنی بر باندلر دیده می‌شوند، پشتیبانی کند.

## حل وابستگی‌های npm و پیش‌باندل کردن

ایمپورت ES بومی از ایمپورت ماژول‌های بدون مسیر مشخص مانند نمونه زیر پشتیبانی نمی‌کند:

```js
import { someMethod } from 'my-dep'
```

کد بالا در مرورگر خطا ایجاد می‌کند. Vite ایمپورت ماژول‌های بدون مسیر مانند این را در تمامی فایل‌های منبع شناسایی کرده و اقدامات زیر را انجام می‌دهد:

1. **[پیش‌باندل](./dep-pre-bundling):** این فرآیند سرعت بارگذاری صفحه را بهبود می‌بخشد و ماژول‌های CommonJS/UMD را به ESM تبدیل می‌کند. مرحله پیش‌باندل با استفاده از ابزار [esbuild](http://esbuild.github.io/) انجام می‌شود که زمان  زمان راه‌اندازی اولیه (cold start) ابزار Vite را به طور قابل توجهی سریع‌تر از هر باندلر جاوااسکریپتی دیگر می‌کند.

2. بازنویسی ایمپورت‌های به آدرس‌های معتبر مانند `‎/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` تا مرورگر بتواند آنها را به درستی ایمپورت کند.

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

برای جلوگیری از مشکلات احتمالی مانند ایمپورت کردن تایپ به تنهایی (type-only imports) که به‌طور نادرست در بسته نهایی گنجانده می‌شوند، از سینتکس [Type-Only Imports and Export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) استفاده کنید. به‌عنوان مثال:

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


It is because `esbuild` only performs transpilation without type information, it doesn't support certain features like const enum and implicit type-only imports.

You must set `"isolatedModules": true` in your `tsconfig.json` under `compilerOptions`, so that TS will warn you against the features that do not work with isolated transpilation.

If a dependency doesn't work well with `"isolatedModules": true`. You can use `"skipLibCheck": true` to temporarily suppress the errors until it is fixed upstream.

#### `useDefineForClassFields`

- [TypeScript documentation](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

Starting from Vite 2.5.0, the default value will be `true` if the TypeScript target is `ESNext` or `ES2022` or newer. It is consistent with the [behavior of `tsc` 4.3.2 and later](https://github.com/microsoft/TypeScript/pull/42663). It is also the standard ECMAScript runtime behavior.

Other TypeScript targets will default to `false`.

But it may be counter-intuitive for those coming from other programming languages or older versions of TypeScript.
You can read more about the transition in the [TypeScript 3.7 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

If you are using a library that heavily relies on class fields, please be careful about the library's intended usage of it.

Most libraries expect `"useDefineForClassFields": true`, such as [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties).

But a few libraries haven't transitioned to this new default yet, including [`lit-element`](https://github.com/lit/lit-element/issues/1030). Please explicitly set `useDefineForClassFields` to `false` in these cases.

#### `target`

- [TypeScript documentation](https://www.typescriptlang.org/tsconfig#target)

Vite ignores the `target` value in the `tsconfig.json`, following the same behavior as `esbuild`.

To specify the target in dev, the [`esbuild.target`](/config/shared-options.html#esbuild) option can be used, which defaults to `esnext` for minimal transpilation. In builds, the [`build.target`](/config/build-options.html#build-target) option takes higher priority over `esbuild.target` and can also be set if needed.

::: warning `useDefineForClassFields`

If `target` in `tsconfig.json` is not `ESNext` or `ES2022` or newer, or if there's no `tsconfig.json` file, `useDefineForClassFields` will default to `false` which can be problematic with the default `esbuild.target` value of `esnext`. It may transpile to [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) which may not be supported in your browser.

As such, it is recommended to set `target` to `ESNext` or `ES2022` or newer, or set `useDefineForClassFields` to `true` explicitly when configuring `tsconfig.json`.
:::

#### Other Compiler Options Affecting the Build Result

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
Vite starter templates have `"skipLibCheck": "true"` by default to avoid typechecking dependencies, as they may choose to only support specific versions and configurations of TypeScript. You can learn more at [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Client Types

Vite's default types are for its Node.js API. To shim the environment of client side code in a Vite application, add a `d.ts` declaration file:

```typescript
/// <reference types="vite/client" />
```

Alternatively, you can add `vite/client` to `compilerOptions.types` inside `tsconfig.json`:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

This will provide the following type shims:

- Asset imports (e.g. importing an `.svg` file)
- Types for the Vite-injected [constant variables](./env-and-mode#env-variables) on `import.meta.env`
- Types for the [HMR API](./api-hmr) on `import.meta.hot`

::: tip
To override the default typing, add a type definition file that contains your typings. Then, add the type reference before `vite/client`.

For example, to make the default import of `*.svg` a React component:

- `vite-env-override.d.ts` (the file that contains your typings):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- The file containing the reference to `vite/client`:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## HTML

HTML files stand [front-and-center](/guide/#index-html-and-project-root) of a Vite project, serving as the entry points for your application, making it simple to build single-page and [multi-page applications](/guide/build.html#multi-page-app).

Any HTML files in your project root can be directly accessed by its respective directory path:

- `<root>/index.html` -> `http://localhost:5173/`
- `<root>/about.html` -> `http://localhost:5173/about.html`
- `<root>/blog/index.html` -> `http://localhost:5173/blog/index.html`

Assets referenced by HTML elements such as `<script type="module" src>` and `<link href>` are processed and bundled as part of the app. The full list of supported elements are as below:

- `<audio src>`
- `<embed src>`
- `<img src>` and `<img srcset>`
- `<image src>`
- `<input src>`
- `<link href>` and `<link imagesrcset>`
- `<object data>`
- `<script type="module" src>`
- `<source src>` and `<source srcset>`
- `<track src>`
- `<use href>` and `<use xlink:href>`
- `<video src>` and `<video poster>`
- `<meta content>`
  - Only if `name` attribute matches `msapplication-tileimage`, `msapplication-square70x70logo`, `msapplication-square150x150logo`, `msapplication-wide310x150logo`, `msapplication-square310x310logo`, `msapplication-config`, or `twitter:image`
  - Or only if `property` attribute matches `og:image`, `og:image:url`, `og:image:secure_url`, `og:audio`, `og:audio:secure_url`, `og:video`, or `og:video:secure_url`

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

To opt-out of HTML processing on certain elements, you can add the `vite-ignore` attribute on the element, which can be useful when referencing external assets or CDN.

## Vue

Vite provides first-class Vue support:

- Vue 3 SFC support via [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Vue 3 JSX support via [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Vue 2.7 SFC support via [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Vue 2.7 JSX support via [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

## JSX

`.jsx` and `.tsx` files are also supported out of the box. JSX transpilation is also handled via [esbuild](https://esbuild.github.io).

Vue users should use the official [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) plugin, which provides Vue 3 specific features including HMR, global component resolving, directives and slots.

If using JSX without React or Vue, custom `jsxFactory` and `jsxFragment` can be configured using the [`esbuild` option](/config/shared-options.md#esbuild). For example for Preact:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

More details in [esbuild docs](https://esbuild.github.io/content-types/#jsx).

You can inject the JSX helpers using `jsxInject` (which is a Vite-only option) to avoid manual imports:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

Importing `.css` files will inject its content to the page via a `<style>` tag with HMR support.

### `@import` Inlining and Rebasing

Vite is pre-configured to support CSS `@import` inlining via `postcss-import`. Vite aliases are also respected for CSS `@import`. In addition, all CSS `url()` references, even if the imported files are in different directories, are always automatically rebased to ensure correctness.

`@import` aliases and URL rebasing are also supported for Sass and Less files (see [CSS Pre-processors](#css-pre-processors)).

### PostCSS

If the project contains valid PostCSS config (any format supported by [postcss-load-config](https://github.com/postcss/postcss-load-config), e.g. `postcss.config.js`), it will be automatically applied to all imported CSS.

Note that CSS minification will run after PostCSS and will use [`build.cssTarget`](/config/build-options.md#build-csstarget) option.

### CSS Modules

Any CSS file ending with `.module.css` is considered a [CSS modules file](https://github.com/css-modules/css-modules). Importing such a file will return the corresponding module object:

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

CSS modules behavior can be configured via the [`css.modules` option](/config/shared-options.md#css-modules).

If `css.modules.localsConvention` is set to enable camelCase locals (e.g. `localsConvention: 'camelCaseOnly'`), you can also use named imports:

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS Pre-processors

Because Vite targets modern browsers only, it is recommended to use native CSS variables with PostCSS plugins that implement CSSWG drafts (e.g. [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) and author plain, future-standards-compliant CSS.

That said, Vite does provide built-in support for `.scss`, `.sass`, `.less`, `.styl` and `.stylus` files. There is no need to install Vite-specific plugins for them, but the corresponding pre-processor itself must be installed:

```bash
# .scss and .sass
npm add -D sass-embedded # or sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

If using Vue single file components, this also automatically enables `<style lang="sass">` et al.

Vite improves `@import` resolving for Sass and Less so that Vite aliases are also respected. In addition, relative `url()` references inside imported Sass/Less files that are in different directories from the root file are also automatically rebased to ensure correctness.

`@import` alias and url rebasing are not supported for Stylus due to its API constraints.

You can also use CSS modules combined with pre-processors by prepending `.module` to the file extension, for example `style.module.scss`.

### Disabling CSS injection into the page

The automatic injection of CSS contents can be turned off via the `?inline` query parameter. In this case, the processed CSS string is returned as the module's default export as usual, but the styles aren't injected to the page.

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // will be injected into the page
import otherStyles from './bar.css?inline' // will not be injected
```

::: tip NOTE
Default and named imports from CSS files (e.g `import style from './foo.css'`) are removed since Vite 5. Use the `?inline` query instead.
:::

### Lightning CSS

Starting from Vite 4.4, there is experimental support for [Lightning CSS](https://lightningcss.dev/). You can opt into it by adding [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) to your config file and install the optional [`lightningcss`](https://www.npmjs.com/package/lightningcss) dependency:

```bash
npm add -D lightningcss
```

If enabled, CSS files will be processed by Lightning CSS instead of PostCSS. To configure it, you can pass Lightning CSS options to the [`css.lightningcss`](../config/shared-options.md#css-lightningcss) config option.

To configure CSS Modules, you'll use [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) instead of [`css.modules`](../config/shared-options.md#css-modules) (which configures the way PostCSS handles CSS modules).

By default, Vite uses esbuild to minify CSS. Lightning CSS can also be used as the CSS minifier with [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify).

::: tip NOTE
[CSS Pre-processors](#css-pre-processors) aren't supported when using Lightning CSS.
:::

## Static Assets

Importing a static asset will return the resolved public URL when it is served:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Special queries can modify how assets are loaded:

```js twoslash
import 'vite/client'
// ---cut---
// Explicitly load assets as URL
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// Load assets as strings
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// Load Web Workers
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// Web Workers inlined as base64 strings at build time
import InlineWorker from './worker.js?worker&inline'
```

More details in [Static Asset Handling](./assets).

## JSON

JSON files can be directly imported - named imports are also supported:

```js twoslash
import 'vite/client'
// ---cut---
// import the entire object
import json from './example.json'
// import a root field as named exports - helps with tree-shaking!
import { field } from './example.json'
```

## Glob Import

Vite supports importing multiple modules from the file system via the special `import.meta.glob` function:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

The above will be transformed into the following:

```js
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

You can then iterate over the keys of the `modules` object to access the corresponding modules:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Matched files are by default lazy-loaded via dynamic import and will be split into separate chunks during build. If you'd rather import all the modules directly (e.g. relying on side-effects in these modules to be applied first), you can pass `{ eager: true }` as the second argument:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

The above will be transformed into the following:

```js
// code produced by vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

### Multiple Patterns

The first argument can be an array of globs, for example

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Negative Patterns

Negative glob patterns are also supported (prefixed with `!`). To ignore some files from the result, you can add exclude glob patterns to the first argument:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### Named Imports

It's possible to only import parts of the modules with the `import` options.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}
```

When combined with `eager` it's even possible to have tree-shaking enabled for those modules.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// code produced by vite:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

Set `import` to `default` to import the default export.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// code produced by vite:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

#### Custom Queries

You can also use the `query` option to provide queries to imports, for example, to import assets [as a string](https://vite.dev/guide/assets.html#importing-asset-as-string) or [as a url](https://vite.dev/guide/assets.html#importing-asset-as-url):

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
// code produced by vite:
const moduleStrings = {
  './dir/foo.svg': () => import('./dir/foo.js?raw').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/foo.svg': () => import('./dir/foo.js?url').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?url').then((m) => m['default']),
}
```

You can also provide custom queries for other plugins to consume:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

### Glob Import Caveats

Note that:

- This is a Vite-only feature and is not a web or ES standard.
- The glob patterns are treated like import specifiers: they must be either relative (start with `./`) or absolute (start with `/`, resolved relative to project root) or an alias path (see [`resolve.alias` option](/config/shared-options.md#resolve-alias)).
- The glob matching is done via [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby).
- You should also be aware that all the arguments in the `import.meta.glob` must be **passed as literals**. You can NOT use variables or expressions in them.

## Dynamic Import

Similar to [glob import](#glob-import), Vite also supports dynamic import with variables.

```ts
const module = await import(`./dir/${file}.js`)
```

Note that variables only represent file names one level deep. If `file` is `'foo/bar'`, the import would fail. For more advanced usage, you can use the [glob import](#glob-import) feature.

## WebAssembly

Pre-compiled `.wasm` files can be imported with `?init`.
The default export will be an initialization function that returns a Promise of the [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

The init function can also take an importObject which is passed along to [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) as its second argument:

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

In the production build, `.wasm` files smaller than `assetInlineLimit` will be inlined as base64 strings. Otherwise, they will be treated as a [static asset](./assets) and fetched on-demand.

::: tip NOTE
[ES Module Integration Proposal for WebAssembly](https://github.com/WebAssembly/esm-integration) is not currently supported.
Use [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) or other community plugins to handle this.
:::

### Accessing the WebAssembly Module

If you need access to the `Module` object, e.g. to instantiate it multiple times, use an [explicit URL import](./assets#explicit-url-imports) to resolve the asset, and then perform the instantiation:

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

### Fetching the module in Node.js

In SSR, the `fetch()` happening as part of the `?init` import, may fail with `TypeError: Invalid URL`.
See the issue [Support wasm in SSR](https://github.com/vitejs/vite/issues/8882).

Here is an alternative, assuming the project base is the current directory:

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

### Import with Constructors

A web worker script can be imported using [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). Compared to the worker suffixes, this syntax leans closer to the standards and is the **recommended** way to create workers.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

The worker constructor also accepts options, which can be used to create "module" workers:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

The worker detection will only work if the `new URL()` constructor is used directly inside the `new Worker()` declaration. Additionally, all options parameters must be static values (i.e. string literals).

### Import with Query Suffixes

A web worker script can be directly imported by appending `?worker` or `?sharedworker` to the import request. The default export will be a custom worker constructor:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

The worker script can also use ESM `import` statements instead of `importScripts()`. **Note**: During development this relies on [browser native support](https://caniuse.com/?search=module%20worker), but for the production build it is compiled away.

By default, the worker script will be emitted as a separate chunk in the production build. If you wish to inline the worker as base64 strings, add the `inline` query:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

If you wish to retrieve the worker as a URL, add the `url` query:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

See [Worker Options](/config/worker-options.md) for details on configuring the bundling of all workers.

## Content Security Policy (CSP)

To deploy CSP, certain directives or configs must be set due to Vite's internals.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

When [`html.cspNonce`](/config/shared-options#html-cspnonce) is set, Vite adds a nonce attribute with the specified value to any `<script>` and `<style>` tags, as well as `<link>` tags for stylesheets and module preloading. Additionally, when this option is set, Vite will inject a meta tag (`<meta property="csp-nonce" nonce="PLACEHOLDER" />`).

The nonce value of a meta tag with `property="csp-nonce"` will be used by Vite whenever necessary during both dev and after build.

:::warning
Ensure that you replace the placeholder with a unique value for each request. This is important to prevent bypassing a resource's policy, which can otherwise be easily done.
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

By default, during build, Vite inlines small assets as data URIs. Allowing `data:` for related directives (e.g. [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src), [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)), or, disabling it by setting [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit) is necessary.

:::warning
Do not allow `data:` for [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). It will allow injection of arbitrary scripts.
:::

## Build Optimizations

> Features listed below are automatically applied as part of the build process and there is no need for explicit configuration unless you want to disable them.

### CSS Code Splitting

Vite automatically extracts the CSS used by modules in an async chunk and generates a separate file for it. The CSS file is automatically loaded via a `<link>` tag when the associated async chunk is loaded, and the async chunk is guaranteed to only be evaluated after the CSS is loaded to avoid [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

If you'd rather have all the CSS extracted into a single file, you can disable CSS code splitting by setting [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) to `false`.

### Preload Directives Generation

Vite automatically generates `<link rel="modulepreload">` directives for entry chunks and their direct imports in the built HTML.

### Async Chunk Loading Optimization

In real world applications, Rollup often generates "common" chunks - code that is shared between two or more other chunks. Combined with dynamic imports, it is quite common to have the following scenario:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

In the non-optimized scenarios, when async chunk `A` is imported, the browser will have to request and parse `A` before it can figure out that it also needs the common chunk `C`. This results in an extra network roundtrip:

```
Entry ---> A ---> C
```

Vite automatically rewrites code-split dynamic import calls with a preload step so that when `A` is requested, `C` is fetched **in parallel**:

```
Entry ---> (A + C)
```

It is possible for `C` to have further imports, which will result in even more roundtrips in the un-optimized scenario. Vite's optimization will trace all the direct imports to completely eliminate the roundtrips regardless of import depth.
