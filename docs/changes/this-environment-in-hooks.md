# `this.environment` در هوک‌ها

::: tip بازخورد
به ما در [Environment API feedback discussion](https://github.com/vitejs/vite/discussions/16358) بازخورد دهید
:::

پیش از Vite 6، فقط دو محیط موجود بود: `client` و `ssr`. یک آرگومان هوک پلاگین `options.ssr` در `resolveId`، `load` و `transform` به نویسندگان پلاگین این امکان را می‌داد که هنگام پردازش ماژول‌ها در هوک‌های پلاگین، این دو محیط را از هم تمایز دهند. در Vite 6، یک برنامه Vite می‌تواند هر تعداد محیط نام‌گذاری‌شده را طبق نیاز تعریف کند. ما `this.environment` را در زمینه پلاگین معرفی می‌کنیم تا با محیط ماژول جاری در هوک‌ها تعامل داشته باشیم.

دامنه تاثیر: `نویسندگان پلاگین Vite`

::: warning منسوخ‌شدن در آینده
`this.environment` در نسخه `v6.0` معرفی‌شد. منسوخ شدن `options.ssr` برای یکی از نسخه‌های اصلی (major) آینده برنامه‌ریزی شده است. در آن زمان، شروع به توصیه به مهاجرت پلاگین‌ها به استفاده از API جدید خواهیم کرد. برای شناسایی استفاده از این ویژگی، می‌توانید `future.removePluginHookSsrArgument` را در تنظیمات Vite خود به مقدار `"warn"` تنظیم کنید.
:::

## انگیزه

`this.environment` نه تنها به پیاده‌سازی هوک پلاگین اجازه می‌دهد که نام محیط جاری را بداند، بلکه دسترسی به گزینه‌های پیکربندی محیط، اطلاعات گراف ماژول، و خط لوله تبدیل (transform pipeline) را نیز فراهم می‌کند (`environment.config`، `environment.moduleGraph`، `environment.transformRequest `). در دسترس بودن نمونه محیط در زمینه پلاگین به نویسندگان پلاگین این امکان را می‌دهد که از وابستگی به سرور توسعه کامل (که معمولاً از طریق هوک `configureServer` در ابتدای راه‌اندازی کش می‌شود) جلوگیری کنند.

## راهنمای مهاجرت

برای انجام یک مهاجرت سریع در پلاگین‌های موجود، آرگومان `options.ssr` را با `this.environment.config.consumer === 'server'` در هوک‌های `resolveId`، `load` و `transform` جایگزین کنید:

```ts
import { Plugin } from 'vite'

export function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId(id, importer, options) {
      const isSSR = options.ssr // [!code --]
      const isSSR = this.environment.config.consumer === 'server' // [!code ++]

      if (isSSR) {
        // منطق خاص SSR
      } else {
        // منطق خاص Client
      }
    },
  }
}
```

برای یک پیاده‌سازی پایدارتر در بلندمدت، هوک پلاگین باید به جای تکیه بر نام محیط، به‌طور دقیق برای [چندین محیط](/guide/api-environment-plugins.html#accessing-the-current-environment-in-hooks)  از گزینه‌های محیطی ریزدانه استفاده کند.
