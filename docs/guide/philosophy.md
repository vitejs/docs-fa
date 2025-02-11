<!-- # Project Philosophy
 

## Lean Extendable Core

Vite doesn't intend to cover every use case for every user. Vite aims to support the most common patterns to build Web apps out-of-the-box, but [Vite core](https://github.com/vitejs/vite) must remain lean with a small API surface to keep the project maintainable long-term. This goal is possible thanks to [Vite's rollup-based plugin system](./api-plugin.md). Features that can be implemented as external plugins will generally not be added to Vite core. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) is a great example of what can be achieved out of Vite core, and there are a lot of [well maintained plugins](https://github.com/vitejs/awesome-vite#plugins) to cover your needs. Vite works closely with the Rollup project to ensure that plugins can be used in both plain-rollup and Vite projects as much as possible, trying to push needed extensions to the Plugin API upstream when possible.

## Pushing the Modern Web

Vite provides opinionated features that push writing modern code. For example:

- The source code can only be written in ESM, where non-ESM dependencies need to be [pre-bundled as ESM](./dep-pre-bundling) in order to work.
- Web workers are encouraged to be written with the [`new Worker` syntax](./features#web-workers) to follow modern standards.
- Node.js modules cannot be used in the browser.

When adding new features, these patterns are followed to create a future-proof API, which may not always be compatible with other build tools.

## A Pragmatic Approach to Performance

Vite has been focused on performance since its [origins](./why.md). Its dev server architecture allows HMR that stays fast as projects scale. Vite uses native tools like [esbuild](https://esbuild.github.io/) and [SWC](https://github.com/vitejs/vite-plugin-react-swc) to implement intensive tasks but keeps the rest of the code in JS to balance speed with flexibility. When needed, framework plugins will tap into [Babel](https://babeljs.io/) to compile user code. And during build time Vite currently uses [Rollup](https://rollupjs.org/) where bundling size and having access to a wide ecosystem of plugins are more important than raw speed. Vite will continue to evolve internally, using new libraries as they appear to improve DX while keeping its API stable.

## Building Frameworks on Top of Vite

Although Vite can be used by users directly, it shines as a tool to create frameworks. Vite core is framework agnostic, but there are polished plugins for each UI framework. Its [JS API](./api-javascript.md) allows App Framework authors to use Vite features to create tailored experiences for their users. Vite includes support for [SSR primitives](./ssr.md), usually present in higher-level tools but fundamental to building modern web frameworks. And Vite plugins complete the picture by offering a way to share between frameworks. Vite is also a great fit when paired with [Backend frameworks](./backend-integration.md) like [Ruby](https://vite-ruby.netlify.app/) and [Laravel](https://laravel.com/docs/10.x/vite).

## An Active Ecosystem

Vite evolution is a cooperation between framework and plugin maintainers, users, and the Vite team. We encourage active participation in Vite's Core development once a project adopts Vite. We work closely with the main projects in the ecosystem to minimize regressions on each release, aided by tools like [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). It allows us to run the CI of major projects using Vite on selected PRs and gives us a clear status of how the Ecosystem would react to a release. We strive to fix regressions before they hit users and allow projects to update to the next versions as soon as they are released. If you are working with Vite, we invite you to join [Vite's Discord](https://chat.vite.dev) and get involved in the project too. -->





# فلسفه‌ی پروژه Vite

## هسته‌ی کم‌حجم و قابل توسعه

Vite قصد ندارد تمام سناریوهای ممکن را برای همه‌ی کاربران پوشش دهد. هدف Vite این است که الگوهای رایج برای ساخت اپلیکیشن‌های وب را به‌صورت پیش‌فرض ارائه کند، اما [هسته‌ی Vite](https://github.com/vitejs/vite) باید کم‌حجم باقی بماند و API کوچکی داشته باشد تا نگهداری آن در طولانی‌مدت ساده باشد. این هدف به لطف [سیستم پلاگین مبتنی بر Rollup در Vite](./api-plugin.md) محقق می‌شود. قابلیت‌هایی که می‌توانند به‌عنوان پلاگین‌های خارجی پیاده‌سازی شوند، معمولاً به هسته‌ی Vite اضافه نخواهند شد. برای مثال، [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) نمونه‌ای عالی از قابلیت‌هایی است که خارج از هسته‌ی Vite توسعه یافته‌اند. همچنین، مجموعه‌ای از [پلاگین‌های خوب و پشتیبانی‌شده](https://github.com/vitejs/awesome-vite#plugins) برای پوشش نیازهای کاربران وجود دارد. Vite همکاری نزدیکی با پروژه Rollup دارد تا اطمینان حاصل شود که پلاگین‌ها تا حد ممکن هم در پروژه‌های Rollup و هم در Vite قابل استفاده باشند و در صورت نیاز، گسترش‌های لازم به API پلاگین‌ها اضافه شوند.

## پیشبرد توسعه‌ی وب مدرن

Vite ویژگی‌هایی را ارائه می‌کند که توسعه‌ی کد مدرن را تشویق می‌کند. برای مثال:

- کد منبع باید فقط در قالب ESM نوشته شود، و وابستگی‌های غیر-ESM باید ابتدا [به‌صورت ESM پیش‌باندل](./dep-pre-bundling) شوند تا کار کنند.
- پیشنهاد می‌شود که Web Workers با استفاده از [ `new Worker` syntax ](./features#web-workers) نوشته شوند تا از استانداردهای مدرن پیروی کنند.
- ماژول‌های Node.js را نمی‌توان در مرورگر استفاده کرد.

در هنگام افزودن قابلیت‌های جدید، این الگوها رعایت می‌شوند تا API‌ای ساخته شود که در آینده نیز پایدار و قابل استفاده باشد، حتی اگر همیشه با سایر ابزارهای ساخت سازگار نباشد.

## رویکرد عمل‌گرایانه نسبت به عملکرد

Vite از [ابتدای توسعه‌ی خود](./why.md) بر عملکرد متمرکز بوده است. معماری سرور توسعه‌ی آن به HMR اجازه می‌دهد که حتی با بزرگ‌تر شدن پروژه‌ها، سریع بماند. Vite از ابزارهای بومی مانند [esbuild](https://esbuild.github.io/) و [SWC](https://github.com/vitejs/vite-plugin-react-swc) برای انجام وظایف سنگین استفاده می‌کند، اما بقیه‌ی کد را در JS نگه می‌دارد تا تعادل بین سرعت و انعطاف‌پذیری حفظ شود. در صورت نیاز، پلاگین‌های فریمورک می‌توانند از [Babel](https://babeljs.io/) برای کامپایل کد کاربر استفاده کنند. همچنین، در زمان ساخت، Vite از [Rollup](https://rollupjs.org/) بهره می‌برد، جایی که اندازه‌ی باندل و دسترسی به اکوسیستم گسترده‌ی پلاگین‌ها اهمیت بیشتری نسبت به سرعت خام دارد. Vite به‌صورت مداوم تکامل می‌یابد و در صورت ظهور کتابخانه‌های جدید برای بهبود تجربه‌ی توسعه‌دهنده (DX)، آن‌ها را در معماری داخلی خود ادغام خواهد کرد، در حالی که API آن پایدار باقی می‌ماند.

## ایجاد فریمورک‌ها بر پایه‌ی Vite

هرچند Vite به‌صورت مستقیم توسط کاربران قابل استفاده است، اما قدرت اصلی آن در ایجاد فریمورک‌ها نمایان می‌شود. هسته‌ی Vite وابسته به فریمورک خاصی نیست، اما پلاگین‌های بهینه‌شده‌ای برای هر فریمورک UI وجود دارد. [API جاوااسکریپت Vite](./api-javascript.md) به توسعه‌دهندگان فریمورک‌ها این امکان را می‌دهد که قابلیت‌های Vite را برای ایجاد تجربه‌های اختصاصی برای کاربران خود به کار ببرند. Vite همچنین از [SSRs](./ssr.md) پشتیبانی می‌کند که معمولاً در ابزارهای سطح بالاتر وجود دارند، اما برای ساخت فریمورک‌های وب مدرن ضروری هستند. پلاگین‌های Vite نیز امکان اشتراک‌گذاری بین فریمورک‌های مختلف را فراهم می‌کنند. علاوه بر این، Vite گزینه‌ی مناسبی برای ادغام با [فریمورک‌های بک‌اند](./backend-integration.md) مانند [Ruby](https://vite-ruby.netlify.app/) و [Laravel](https://laravel.com/docs/10.x/vite) است.

## یک اکوسیستم فعال

توسعه‌ی Vite نتیجه‌ی همکاری بین توسعه‌دهندگان فریمورک‌ها، نگه‌داران پلاگین‌ها، کاربران و تیم اصلی Vite است. ما مشارکت فعال در توسعه‌ی هسته‌ی Vite را تشویق می‌کنیم، به‌ویژه زمانی که پروژه‌ای از آن استفاده می‌کند. تیم Vite با پروژه‌های اصلی در اکوسیستم همکاری می‌کند تا از بروز مشکلات در هر نسخه‌ی جدید جلوگیری کند. ابزارهایی مانند [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) به ما کمک می‌کنند تا تست‌های CI را برای پروژه‌های مهم که از Vite استفاده می‌کنند روی PRهای منتخب اجرا کنیم و بررسی کنیم که اکوسیستم چگونه به نسخه‌های جدید واکنش نشان خواهد داد. هدف ما این است که مشکلات قبل از رسیدن به کاربران حل شوند و پروژه‌ها بتوانند بلافاصله پس از انتشار نسخه‌های جدید، به‌روز شوند. اگر شما هم با Vite کار می‌کنید، از شما دعوت می‌کنیم که به [Discord رسمی Vite](https://chat.vite.dev) بپیوندید و در توسعه‌ی این پروژه مشارکت داشته باشید.
