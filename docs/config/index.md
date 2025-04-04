---
title: پیکربندی Vite
---

# پیکربندی Vite

هنگام اجرای `vite` از خط فرمان، Vite به‌طور خودکار تلاش می‌کند تا فایلی با نام `vite.config.js` را در [ریشه پروژه](/guide/#index-html-و-ریشه-root-پروژه) پیدا کند (پسوندهای دیگر JS و TS نیز پشتیبانی می‌شوند).

ساده‌ترین فایل پیکربندی به این شکل است:

```js [vite.config.js]
export default {
  // گزینه‌های پیکربندی
}
```

Vite از سینتکس ماژول‌های ES در فایل پیکربندی پشتیبانی می‌کند، حتی اگر پروژه از ESM بومی Node استفاده نکند، مثلاً `"type: "module` در `package.json` نباشد. در این حالت، فایل پیکربندی پیش از بارگذاری به‌طور خودکار پیش‌پردازش می‌شود.

همچنین می‌توانید با استفاده از گزینه `config--` در CLI، فایل پیکربندی خاصی را مشخص کنید (فایل با توجه به مسیر کاری جاری (`cwd`) تفسیر و خوانده می‌شود):

```bash
vite --config my-config.js
```

::: tip بارگذاری پیکربندی
به‌طور پیش‌فرض، Vite از `esbuild` برای باندل کردن پیکربندی به یک فایل موقت و بارگذاری آن استفاده می‌کند. این ممکن است در مونوریپوها هنگام ایمپورت فایل‌های TypeScript مشکل ایجاد کند. اگر با این روش مشکلی داشتید، می‌توانید با `configLoader runner--` از [module runner](/guide/api-environment-runtimes.html#modulerunner) استفاده کنید که فایل موقتی ایجاد نمی‌کند و فایل‌ها را در لحظه تبدیل می‌کند. توجه کنید که module runner از CJS در فایل‌های پیکربندی پشتیبانی نمی‌کند، اما پکیج‌های خارجی CJS باید به‌طور عادی کار کنند.

همچنین، اگر از محیطی استفاده می‌کنید که TypeScript را پشتیبانی می‌کند (مثلاً `node --experimental-strip-types`) یا فقط جاوااسکریپت ساده می‌نویسید، می‌توانید با `configLoader native--` از ران‌تایم بومی محیط برای بارگذاری فایل پیکربندی استفاده کنید. توجه داشته باشید که تغییرات در ماژول‌های ایمپورت‌شده توسط فایل پیکربندی تشخیص داده نمی‌شوند و سرور Vite به‌طور خودکار ری‌استارت نمی‌شود.
:::

## هوشمندی پیکربندی (Intellisense)

از آنجا که Vite با تایپ‌های TypeScript ارائه می‌شود، می‌توانید از هوشمندی IDE خود با استفاده از نکات تایپ jsdoc بهره ببرید:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

یا می‌توانید از تابع کمکی `defineConfig` استفاده کنید که بدون نیاز به توضیحات jsdoc، هوشمندی را فراهم می‌کند:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite همچنین از فایل‌های پیکربندی TypeScript پشتیبانی می‌کند. می‌توانید از `vite.config.ts` با تابع کمکی `defineConfig` یا عملگر `satisfies` استفاده کنید:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## پیکربندی شرطی

اگر پیکربندی نیاز به تعیین شرطی گزینه‌ها بر اساس دستور (`serve` یا `build`)، [حالت](/guide/env-and-mode#modes) استفاده‌شده، ساخت SSR (`isSsrBuild`) یا پیش‌نمایش ساخت (`isPreview`) داشته باشد، می‌تواند به جای آبجکت، یک تابع صادر کند:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // پیکربندی خاص توسعه
    }
  } else {
    // command === 'build'
    return {
      // پیکربندی خاص ساخت
    }
  }
})
```

در API Vite، مقدار `command` در طول توسعه `serve` است (همچنین در CLI نام‌های مستعار [`vite`](/guide/cli#vite) و `vite dev` و `vite serve` را داریم) و هنگام ساخت برای تولید، `build` است ([`vite build`](/guide/cli#vite-build)).

`isSsrBuild` و `isPreview` پرچم‌های اختیاری اضافی برای تمایز نوع دستورهای `build` و `serve` هستند. برخی ابزارهایی که پیکربندی Vite را بارگذاری می‌کنند ممکن است از این پرچم‌ها پشتیبانی نکنند و به جای آن `undefined` ارسال کنند. بنابراین توصیه می‌شود از مقایسه صریح با `true` و `false` استفاده کنید.

## پیکربندی ناهمگام

اگر پیکربندی نیاز به فراخوانی توابع ناهمگام داشته باشد، می‌تواند یک تابع ناهمگام صادر کند. این تابع ناهمگام همچنین می‌تواند از طریق `defineConfig` برای پشتیبانی بهتر از هوشمندی منتقل شود:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite پیکربندی
  }
})
```

## استفاده از متغیرهای محیطی در پیکربندی

متغیرهای محیطی به‌طور معمول از `process.env` قابل دسترسی هستند.

توجه داشته باشید که Vite به‌طور پیش‌فرض فایل‌های `‎.env` را بارگذاری نمی‌کند، زیرا فایل‌های قابل بارگذاری تنها پس از ارزیابی پیکربندی Vite مشخص می‌شوند، مثلاً گزینه‌های `root` و `envDir` بر رفتار بارگذاری تأثیر می‌گذارند. با این حال، می‌توانید از تابع کمکی صادرشده `loadEnv` برای بارگذاری فایل `env.` خاص در صورت نیاز استفاده کنید.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // .در دایرکتوری کاری جاری بارگذاری کن `mode` را بر اساس env فایل
  // ،`VITE_` ها بدون توجه به پیشوند env برای بارگذاری همه
  // .پارامتر سوم را به '' تنظیم کن
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // پیکربندی vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```

## دیباگ کردن فایل پیکربندی در VS Code

وقتی از رفتار پیش‌فرض `configLoader bundle--`استفاده می‌شه، Vite فایل پیکربندی موقتی تولیدشده را در پوشه `node_modules/.vite-temp` می‌نویسد و هنگام تنظیم نقاط توقف برای دیباگ در فایل پیکربندی Vite، خطای "فایل پیدا نشد" رخ می‌دهد. برای رفع این مشکل، پیکربندی زیر را به `vscode/settings.json.` اضافه کنید:

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
