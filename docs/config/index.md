---
title: پیکربندی Vite
---

# پیکربندی Vite

زمانی که دستور `vite` از خط فرمان اجرا می‌شود، Vite به‌صورت خودکار تلاش می‌کند فایلی با نام `vite.config.js` را در [ریشه پروژه](/guide/#index-html-and-project-root) پیدا کند (سایر پسوندهای JS و TS نیز پشتیبانی می‌شوند).

ساده‌ترین فایل پیکربندی به شکل زیر است:

```js [vite.config.js]
export default {
  // گزینه‌های پیکربندی
}
```

توجه داشته باشید که Vite از سینتکس ماژول‌های ES در فایل پیکربندی پشتیبانی می‌کند، حتی اگر پروژه از ESM بومی Node استفاده نکند، مانند `type: "module"` در فایل `package.json`. در این حالت، فایل پیکربندی پیش از بارگذاری، به‌صورت خودکار پیش‌پردازش می‌شود.

همچنین می‌توانید فایل پیکربندی مورد نظر را به‌صورت صریح با استفاده از گزینهٔ `--config` در خط فرمان مشخص کنید (نسبت به `cwd` حل می‌شود):

```bash
vite --config my-config.js
```

::: tip بارگذاری پیکربندی
به‌صورت پیش‌فرض، Vite از `esbuild` برای باندل کردن فایل پیکربندی در یک فایل موقت و بارگذاری آن استفاده می‌کند. این کار ممکن است هنگام import کردن فایل‌های TypeScript در یک monorepo مشکلاتی ایجاد کند. اگر با این روش به مشکلی برخوردید، می‌توانید از `--configLoader runner` استفاده کنید تا به‌جای آن از [module runner](/guide/api-environment-runtimes.html#modulerunner) استفاده شود. این روش فایل موقت ایجاد نمی‌کند و فایل‌ها را در لحظه ترنسفورم می‌کند. توجه داشته باشید که module runner از CJS در فایل پیکربندی پشتیبانی نمی‌کند، اما پکیج‌های خارجی CJS مانند قبل کار می‌کنند.

به‌صورت جایگزین، اگر از محیطی استفاده می‌کنید که از TypeScript پشتیبانی می‌کند (مانند `node --experimental-strip-types`) یا اگر فقط جاوااسکریپت ساده می‌نویسید، می‌توانید از `--configLoader native` استفاده کنید تا پیکربندی را با ران‌تایم بومی محیط بارگذاری کند. توجه داشته باشید که در این حالت، تغییرات در ماژول‌های import‌شده توسط فایل پیکربندی شناسایی نمی‌شوند و بنابراین سرور Vite به‌طور خودکار ری‌استارت نخواهد شد.
:::

## Intellisense برای پیکربندی

از آنجایی که Vite تایپینگ TypeScript را ارائه می‌دهد، می‌توانید از Intellisense در IDE خود با کمک type hintهای jsdoc بهره ببرید:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

همچنین می‌توانید از تابع کمکی `defineConfig` استفاده کنید که بدون نیاز به jsdoc، Intellisense را فراهم می‌کند:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite از فایل‌های پیکربندی TypeScript نیز پشتیبانی می‌کند. می‌توانید از `vite.config.ts` همراه با تابع کمکی `defineConfig` یا با عملگر `satisfies` استفاده کنید:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## پیکربندی شرطی

اگر لازم است بر اساس دستور (`serve` یا `build`)، [mode](/guide/env-and-mode#modes) جاری، یا این‌که آیا build از نوع SSR است (`isSsrBuild`) یا در حالت پیش‌نمایش است (`isPreview`)، گزینه‌ها به‌صورت شرطی تعیین شوند، می‌توانید به‌جای export کردن یک آبجکت، یک تابع export کنید:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // پیکربندی مخصوص توسعه
    }
  } else {
    // command === 'build'
    return {
      // پیکربندی مخصوص build
    }
  }
})
```

در API مربوط به Vite، مقدار `command` در زمان توسعه `serve` است (در CLI، دستورات [`vite`](/guide/cli#vite)، `vite dev` و `vite serve` معادل هستند) و در زمان build برای تولید، مقدار آن `build` خواهد بود ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` و `isPreview` دو فلگ اختیاری برای تشخیص نوع `build` و `serve` هستند. برخی ابزارهایی که فایل پیکربندی Vite را بارگذاری می‌کنند ممکن است از این فلگ‌ها پشتیبانی نکنند و مقدار `undefined` ارسال کنند. بنابراین پیشنهاد می‌شود از مقایسهٔ صریح با `true` و `false` استفاده شود.

## پیکربندی ناهمگام

اگر نیاز دارید در فایل پیکربندی توابع ناهمگام فراخوانی شوند، می‌توانید به‌جای آبجکت، یک تابع async را export کنید. این تابع async را می‌توانید برای پشتیبانی بهتر از Intellisense درون `defineConfig` نیز قرار دهید:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // پیکربندی vite
  }
})
```

## استفاده از متغیرهای محیطی در پیکربندی

متغیرهای محیطی را می‌توانید مانند همیشه از `process.env` دریافت کنید.

توجه داشته باشید که Vite به‌صورت پیش‌فرض فایل‌های `.env` را بارگذاری نمی‌کند، چرا که فقط پس از ارزیابی فایل پیکربندی مشخص می‌شود که کدام فایل‌ها باید بارگذاری شوند. برای مثال، گزینه‌های `root` و `envDir` بر رفتار بارگذاری تأثیرگذار هستند. با این حال، می‌توانید از تابع کمکی `loadEnv` که توسط Vite صادر شده استفاده کنید تا فایل `.env` مورد نظر بارگذاری شود.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // .در دایرکتوری کاری جاری بارگذاری کن `mode` را بر اساس env فایل
  // ،`VITE_` ها بدون توجه به پیشوند env برای بارگذاری همه
  // .پارامتر سوم را به '' تنظیم کن
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite پیکربندی
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```

## دیباگ کردن فایل پیکربندی در VS Code

با رفتار پیش‌فرض `--configLoader bundle`، Vite فایل پیکربندی موقت ایجادشده را در مسیر `node_modules/.vite-temp` ذخیره می‌کند و اگر در فایل پیکربندی Vite breakpoint تنظیم شده باشد، خطای یافت نشدن فایل رخ خواهد داد. برای رفع این مشکل، پیکربندی زیر را به فایل `.vscode/settings.json` اضافه کنید:

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
