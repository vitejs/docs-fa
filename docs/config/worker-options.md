# آپشن‌های Worker

آپشن‌های این بخش برای همه‌ی حالت‌های dev، build و preview اعمال می‌شوند مگر آنکه بطور مشخص ذکر شده باشد.

## worker.format

- **تایپ:** `'es' | 'iife'`
- **مقدار پیش فرض:** `'iife'`

فرمت خروجی برای باندل worker.

## worker.plugins

- **تایپ:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

پلاگین های vite که بر باندل های worker اعمال می‌شوند. توجه کنید که [config.plugins](./shared-options#plugins) فقط در حالت dev بر روی باندل های worker اعمال خواهند شد و برای حالت build باید از این گزینه استفاده کنید.
این تابع باید نمونه‌های جدیدی از پلاگین‌ها را بازگرداند چون آن‌ها به‌صورت موازی در build های rollup اجرا می‌شوند. به همین دلیل، تغییر گزینه‌های config.worker در هوک config نادیده گرفته می‌شود.

## worker.rollupOptions

- **تایپ:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

آپشن‌های Rollup برای ساخت باندل worker.
