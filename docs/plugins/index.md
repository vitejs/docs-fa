# Plugins

:::tip نکته
Vite هدف دارد پشتیبانی پیش‌فرض از الگوهای رایج توسعه وب را ارائه دهد. قبل از جست‌وجو برای یافتن پلاگین‌های Vite یا پلاگین‌های سازگار با Rollup، [راهنمای ویژگی‌ها](../guide/features.md) را بررسی کنید. بسیاری از مواردی که در پروژه‌های Rollup نیاز به استفاده از پلاگین دارند، در Vite به‌صورت پیش‌فرض پوشش داده شده‌اند.
:::

برای کسب اطلاعات بیشتر درباره نحوه استفاده از پلاگین‌ها، بخش [استفاده از پلاگین‌ها](../guide/using-plugins) را مطالعه کنید.

## Official Plugins

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- از Vue 3 Single File Components پشتیبانی می‌کند .

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- از Vue 3 JSX پشتیبانی می‌کند (با استفاده از [تبدیل اختصاصی Babel](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- از Vue 2.7 Single File Components پشتیبانی می‌کند.

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

- از Vue 2.7 JSX پشتیبانی می‌کند (با استفاده از [تبدیل اختصاصی Babel](https://github.com/vuejs/jsx-vue2/)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- با استفاده از esbuild و Babeldدر نهایت HMR سریع و پکیجی کم‌حجم ارائه می‌دهد، در حالی که امکان استفاده از پایپ‌لاین تبدیل Babel را هم دارد. در فرآیند ساخت (build)، اگر پلاگین‌های اضافی Babel اضافه نشوند، تنها از esbuild استفاده می‌شود.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- در مرحله توسعه، Babel با SWC جایگزین می‌شود. در مرحله بیلد پرواکشن، اگر از پلاگین‌ها استفاده شود، SWC+esbuild به کار گرفته می‌شوند و در غیر این صورت فقط از esbuild استفاده می‌شود. برای پروژه‌های بزرگ که به اکسننشن های غیراستاندارد React نیازی ندارند، زمان راه‌اندازی اولیه (cold start) و تعویض ماژول‌ها در حین توسعه (HMR) می‌توانند به طور قابل توجهی سریع‌تر باشند.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- پشتیبانی از مرورگرهای قدیمی برای بیلد پرواکشن فراهم می‌کند.

## Community Plugins

[awesome-vite](https://github.com/vitejs/awesome-vite#plugins) را بررسی کنید - شما همچنین می‌توانید یک درخواست PR ارسال کنید تا پلاگین‌های خود را در آنجا اضافه کنید.

## Rollup Plugins

[پلاگین‌های Vite](../guide/api-plugin) توسعه یافته از اینترفیس پلاگین‌های Rollup هستند. برای جزئیات بیشتر، به بخش [سازگاری با پلاگین‌های Rollup](../guide/api-plugin#rollup-plugin-compatibility) مراجعه کنید.
