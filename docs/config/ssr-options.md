# آپشن‌های SSR

آپشن‌های این بخش هم در حالت توسعه (`dev`) و هم در مرحله ساخت (`build`) اعمال خواهند شد،مگر اینکه خلاف آن ذکر شده باشد.

## ssr.external

- **تایپ:** `string[]‎ | true`
- **مرتبط:** [SSR Externals](/guide/ssr#ssr-externals)

وابستگی‌های مشخص‌شده و وابستگی‌های وابسته به آن‌ها را برای SSR به حالت externalize در می‌آورد (مستقل کردن یا خارج کردن یک وابستگی از باندل اصلی). به‌طور پیش‌فرض، همه وابستگی‌ها به‌جز وابستگی‌های لینک‌شده (برای HMR) externalize می‌شوند. اگر می‌خواهید وابستگی لینک‌شده‌ای را نیز externalize کنید، می‌توانید نام آن را در این آپشن مشخص کنید.

اگر `true` باشد، تمام وابستگی‌ها از جمله وابستگی‌های لینک‌شده externalized می‌شوند.

توجه کنید که وابستگی‌هایی که به‌طور مشخص و صریح لیست شده‌اند (با استفاده از تایپ `string[]‎`) در هر حالتی اولویت دارند، حتی اگر در `ssr.noExternal` (با هر تایپی) نیز تعریف شده باشند.

## ssr.noExternal

- **تایپ:** `string | RegExp | (string | RegExp)[] | true`
- **مرتبط:** [SSR Externals](/guide/ssr#ssr-externals)

از مستقل شدن (externalized) وابستگی‌های فهرست‌شده برای SSR جلوگیری کنید، زیرا آن‌ها در مرحله ساخت (build) باندل خواهند شد. به‌طور پیش‌فرض، فقط وابستگی‌های لینک‌شده (linked) مستقل نمی‌شوند (برای HMR). اگر ترجیح می‌دهید که وابستگی‌های لینک‌شده نیز externalized شوند (مستقل کردن یا خارج کردن یک وابستگی از باندل اصلی)، می‌توانید نام آن‌ها را به گزینه `ssr.external` اضافه کنید.

اگر `true` باشد، هیچ وابستگی‌ای مستقل (externalized) نخواهد شد. با این حال، وابستگی‌هایی که به‌طور صریح در `ssr.external` (با استفاده از تایپ `string[]‎`) فهرست شده‌اند، می‌توانند اولویت داشته باشند و همچنان externalized شوند. اگر `ssr.target: 'node'` تنظیم شده باشد، ماژول‌های داخلی Node.js نیز به‌طور پیش‌فرض externalized خواهند شد.

توجه داشته باشید که اگر هر دو گزینه `ssr.noExternal: true` و `ssr.external: true` کانفیگ شده باشند، `ssr.noExternal` اولویت دارد و هیچ وابستگی‌ای مستقل (externalized) نخواهد شد.

## ssr.target

- **تایپ:** `'node' | 'webworker'`
- **پیش‌فرض:** `node`

بیلد target برای سرور SSR.

## ssr.resolve.conditions

- **تایپ:** `string[]‎`
- **پیش‌فرض:** `['module', 'node', 'development|production']` (`defaultServerConditions`) (`['module', 'browser', 'development|production']` (`defaultClientConditions`) برای `ssr.target === 'webworker'`)
- **مرتبط:** [Resolve Conditions](./shared-options.md#resolve-conditions)

این شرایط در مسیر پلاگین‌ها استفاده می‌شوند و فقط بر وابستگی‌های non-externalized در زمان ساخت SSR تأثیر می‌گذارند. برای تأثیرگذاری بر ایمپورت های externalized، از `ssr.resolve.externalConditions` استفاده کنید.

## ssr.resolve.externalConditions

- **تایپ:** `string[]‎`
- **پیش‌فرض:** `['node']`

شرایطی که در هنگام ایمپورت SSR (شامل `ssrLoadModule`) برای وابستگی‌های مستقیم externalized (وابستگی‌های خارجی که توسط Vite ایمپورت شده‌اند) اعمال می‌شوند.

:::tip نکته

هنگام استفاده از این آپشن، مطمئن شوید که Node را با [`flag --conditions`](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) وبا مقادیر یکسان در هر دو حالت dev و build اجرا کنید تا رفتار یکسانی داشته باشید.

برای مثال، وقتی `['node', 'custom']` را تنظیم می‌کنید، باید در حالت dev دستور `NODE_OPTIONS='--conditions custom' vite` و پس از بیلد دستور `NODE_OPTIONS="--conditions custom" node ./dist/server.js` را اجرا کنید.

:::

## ssr.resolve.mainFields

- **تایپ:** `string[]‎`
- **پیش‌فرض:** `['module', 'jsnext:main', 'jsnext']`

فهرستی از فیلدهای `package.json` که هنگام تشخیص entry pointهای یک پکیج بررسی می‌شوند. توجه داشته باشید که این گزینه نسبت به اکسپورت شرطی که از فیلد `exports` شناسایی می‌شود، اولویت کم‌تری دارد: اگر entry point با موفقیت از `exports` تشخیص داده شود، فیلد `main` نادیده گرفته خواهد شد. این تنظیم فقط بر وابستگی‌های غیرمستقل (non-externalized) تأثیر می‌گذارد.
