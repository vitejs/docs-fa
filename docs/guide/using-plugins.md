# استفاده از پلاگین‌ها

Vite از طریق پلاگین‌ها قابل گسترش است. این پلاگین‌ها بر پایه‌ی رابط پلاگین‌های Rollup طراحی شده‌اند، با این تفاوت که گزینه‌های اضافی مخصوص Vite نیز به آن‌ها افزوده شده است. به همین دلیل، کاربران Vite می‌توانند هم‌زمان از اکوسیستم قدرتمند پلاگین‌های Rollup بهره ببرند و در عین حال، سرور توسعه و قابلیت‌های SSR را مطابق نیاز خود سفارشی کنند.

## اضافه کردن یک پلاگین

برای استفاده از یک پلاگین، باید آن را به `devDependencies` پروژه اضافه کرده و در آرایه `plugins` در فایل کانفیگ `vite.config.js` قرار دهید. به عنوان مثال، برای پشتیبانی از مرورگرهای قدیمی، می‌توان از پلاگین رسمی [‎@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) استفاده کرد:

```
$ npm add -D @vitejs/plugin-legacy
```

```js twoslash [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

آرایه `plugins` همچنین می‌تواند پیش‌تنظیماتی را بپذیرد که شامل چندین پلاگین به عنوان یک عنصر واحد هستند. این ویژگی برای موارد پیچیده‌تر (مثل یکپارچه‌سازی فریم‌ورک‌ها) که با استفاده از چندین پلاگین پیاده‌سازی می‌شوند، مفید است. آرایه‌ی پلاگین‌ها به طور داخلی به صورت تخت (flat) پردازش خواهد شد.

پلاگین‌های نادرست نادیده گرفته خواهند شد. این ویژگی می‌تواند برای فعال یا غیرفعال کردن راحت پلاگین‌ها مورد استفاده قرار گیرد.

## یافتن پلاگین‌ها

:::tip نکته
Vite هدف دارد تا پشتیبانی آماده از الگوهای رایج توسعه وب را فراهم کند. قبل از جستجو برای یک پلاگین Vite یا پلاگین سازگار با Rollup، پیشنهاد می‌شود راهنمای [ویژگی‌ها](../guide/features.md) را بررسی کنید. بسیاری از قابلیت‌هایی که در پروژه‌های Rollup نیاز به پلاگین دارند، در Vite به طور پیش‌فرض پشتیبانی می‌شوند.
:::

بخش [پلاگین‌ها](../plugins/) را برای اطلاعات بیشتر درباره پلاگین‌های رسمی بررسی کنید. پلاگین‌های جامعه (community) در [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) لیست شده‌اند.

همچنین می‌توانید پلاگین‌هایی که از [کنوانسیون‌های توصیه‌شده](./api-plugin.md#conventions) پیروی می‌کنند را با استفاده از [جستجوی npm برای vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) برای پلاگین‌های Vite یا [جستجوی npm برای rollup-plugin](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) برای پلاگین‌های Rollup پیدا کنید.

## ترتیب اعمال پلاگین

برای سازگاری با برخی از پلاگین‌های Rollup، ممکن است نیاز باشد ترتیب پلاگین‌ها را تغییر دهید یا آن‌ها را فقط در زمان بیلد اعمال کنید. این باید جزئیات پیاده‌سازی در سطح پلاگین‌های Vite باشد. شما می‌توانید موقعیت یک پلاگین را با استفاده از اصلاح‌کننده `enforce` تنظیم کنید:

- `pre`: اجرای پلاگین قبل از پلاگین‌های اصلی Vite
- پیش‌فرض: اجرای پلاگین بعد از پلاگین‌های اصلی Vite
- `post`: اجرای پلاگین بعد از پلاگین‌های build Vite

```js twoslash [vite.config.js]
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

برای اطلاعات دقیق، راهنمای [API پلاگین‌ها](./api-plugin.md#plugin-ordering) را بررسی کنید.

## فراخوانی شرطی

به طور پیش‌فرض، پلاگین‌ها برای هر دو حالت serve و build فراخوانی می‌شوند. در مواردی که نیاز است یک پلاگین به صورت شرطی فقط در زمان serve یا build اعمال شود، از ویژگی `apply` استفاده کنید تا فقط در زمان `'build'` یا `'serve'` فراخوانی شوند:

```js twoslash [vite.config.js]
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## بیلد پلاگین‌ها

برای مشاهده مستندات مربوط به ایجاد پلاگین‌ها، راهنمای [API پلاگین‌ها](./api-plugin.md) را بررسی کنید.
