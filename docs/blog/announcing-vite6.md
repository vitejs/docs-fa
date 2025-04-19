---
title: ‌‌نسخه Vite 6.0 منتشر شد!
author:
  name: The Vite Team
date: 2024-11-26
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: ‌‌نسخه Vite 6.0 منتشر شد
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite6.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite6
  - - meta
    - property: og:description
      content: اطلاعیه انتشار نسخه 6 vite
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# ‌‌نسخه Vite 6.0 منتشر شد!

_۲۶ نوامبر ۲۰۲۴_

![تصویری از بنر معرفی نسخه 6.0 Vite](/og-image-announcing-vite6.png)

امروزه، ما درحال برداشتن قدم بزرگ دیگری در داستان Vite هستیم. [تیم](/team) Vite، [همکاران آن](https://github.com/vitejs/vite/graphs/contributors) و شرکای اکوسیستم برای انتشار نسخه 6.0 Vite هیجان‌زده هستند.

امسال سرشار از رویداد بوده است. مقبولیت Vite رشد خود را با افزایش آمار دانلود هفنگی از ۷.۵ میلیون به ۱۷ میلیون، از زمان انتشار نسخه 5 Vite در سال پیش، ادامه داده‌ است. [Vitest](https://vitest.dev) نه‌ تنها مورد علاقه کاربران است، بلکه درحال شروع فرم‌دهی به یک اکوسیستم برای خودش نیز می‌باشد. برای مثال [storybook](https://storybook.js.org) دارای قابلیت‌های تست جدیدی‌ست که توسط Vitest طراحی شده‌است.

کتابخانه‌های جدید دیگری نیز به اکوسیستم Vite پیوسه‌اند. مانند [TanStack Start](https://tanstack.com/start) ، [One](https://onestack.dev/) ، [Ember](https://emberjs.com/) و سایر . کتابخانه‌های وب درحال نوآوری با سرعتی بیشتر و افزایشی هستند. پیشرفت‌های درحال انجام توسط گروه‌ها را در [Astro](https://astro.build/) ، [Nuxt](https://nuxt.com/) ، [SvelteKit](https://kit.svelte.dev/) ، [Solid Start](https://www.solidjs.com/blog/introducing-solidstart) ، [Qwik City](https://qwik.builder.io/qwikcity/overview/)، [RedwoodJS](https://redwoodjs.com/) ، [React Router](https://reactrouter.com/) مشاهده کنید. لیست ادامه‌دار می‌باشد.

در ادامه، Vite توسط OpenAI ,Google ,Apple ,Microsoft ,NASA ,Shopify ,Cloudflare ,GitLab ,Reddit ,Linear استفاده شده و در میان بسیار شرکت‌های دیگری نیز می‌باشد. ما لیستی از [شزکت‌هایی که درحال حاضر از Vite استفاده می‌کنند](https://github.com/vitejs/companies-using-vite) درست کرده‌ایم. خرسندیم که PR بسیاری از توسعه‌دهندگان را برای اضافه کردن شرکت‌شان به لیست می‌بینیم. باورش سخت است که چقدر اکوسیستمی که ما با یکدیگر ساخته‌ایم از زمانی که اولین قدم را برای آن برداشته‌ایم پیشرفت کرده است.

![دانلود هفتگی npm Vite](/vite6-npm-weekly-downloads.png)

## افزایش سرعت اکوسیستم Vite

ماه گذشته، کامیونیتی برای ویرایش سوم [ViteConf](https://viteconf.org/24/replay) دور هم جمع شد، یکبار دیگر توسط [StackBlitz](https://stackblitz.com) میزبانی شد. این بزرگترین کنفرانس Vite، با نمایندگی گسترده‌ای از سازندگان اکوسیستم بود. بین سایر معرفی‌ها [VoidZero](https://staging.voidzero.dev/posts/announcing-voidzero-inc) توسط Evan You معرفی شد؛ شرکتی که به ساخت یک زنجیره ابزار توسعه منبع باز، با کارایی بالا و یکپارچه برای اکوسیستم جاوا اسکریپت اختصاص داده شده است. VoidZero پشت [Rolldown](https://rolldown.rs) و [Oxc](https://oxc.rs) است، و تیم آنها گام های مهمی برمی دارد و آنها را به سرعت برای پذیرش توسط Vite آماده می کند. با تماشای سخنرانی اصلی ایوان، در مورد مراحل بعدی آینده مبتی بر Rust برای Vite بیشتر بدانید.

<YouTubeideo videoId="EKvvptbTx6k?si=EZ-rFJn4pDW3tUvp" />

 [استک‌بلیتز](https://stackblitz.com)  (Stackblitz) از [bolt.new](https://bolt.new) رونمایی کرد، یک اپلیکیشن مبتنی بر Remix که با ترکیب Claude و WebContainers به شما این امکان را می‌دهد که اپلیکیشن‌های فول‌استک بنویسید، ویرایش، اجرا و منتشر کنید. نِیت واینر نیز از فریم‌ورک جدیدی به نام [One](https://onestack.dev/) پرده‌برداری کرد؛ فریم‌ورکی مبتنی بر Vite که برای ساخت اپلیکیشن‌های وب و نیتیو طراحی شده است. استوری‌بوک (Storybook) هم [ابزارهای تست](https://youtu.be/8t5wxrFpCQY?si=PYZoWKf-45goQYDt). جدید خود را که بر پایه Vitest هستند به نمایش گذاشت. و کلی چیزهای دیگر!

به شما پیشنهاد می‌کنیم که حتما [تمام ۴۳ سخنرانی](https://www.youtube.com/playlist?list=PLqGQbXn_GDmnObDzgjUF4Krsfl6OUKxtp) را تماشا کنید. سخنرانان واقعاً تلاش زیادی کردند تا آنچه را که هر پروژه در دست اجرا دارد، با ما به اشتراک بگذارند.
همچنین Vite یک لندینگ جدید با یک دامنه تازه دارد که شما باید از این به بعد لینک‌ها و آدرس‌های خود را به دامنه جدید [vite.dev](https://vite.dev) به‌روزرسانی کنید. طراحی و پیاده‌سازی جدید توسط تیم VoidZero انجام شده است — همان افرادی که قبلاً وب‌سایت آن‌ها را ساخته بودند. تشکر ویژه از  [Vicente Rodriguez](https://bento.me/rmoon) و [Simon Le Marchant](https://marchantweb.com/).

## نسخه اصلی بعدی Vite منتشر شده است!

نسخه Vite 6 مهم‌ترین نسخه اصلی از زمان انتشار Vite 2 محسوب می‌شود. ما مشتاق همکاری با اکوسیستم هستیم تا با API های جدید فضای مشترک‌‌مان را گسترش دهیم. طبق معمول، ایجاد یک پایه‌ی به‌مراتب ماهرانه‌تر برای توسعه

لینک‌های سریع:

- [مستندات](/)
- ترجمه‌ها : [چینی](https://cn.vite.dev/), [ژاپنی](https://ja.vite.dev/), [اسپانیایی](https://es.vite.dev/), [پرتغالی](https://pt.vite.dev/), [کره‌ای](https://ko.vite.dev/), [آلمانی](https://de.vite.dev/)
- [راهنمای مهاجرت](/guide/migration)
- [تغییرات گیتهاب](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#600-2024-11-26)

اگر به تازگی با Vite آشنا شده‌اید، پیشنهاد می‌کنیم ابتدا راهنمای [شروع](/guide/) و [ویژگی‌ها](/guide/features) را بخوانید.

ما از بیش از  [۱۰۰۰ مشارکت‌کننده در مجموعه Vite](https://github.com/vitejs/vite/graphs/contributors) و همچنین نگهدارندگان و مشارکت‌کنندگان افزونه‌ها، یکپارچه‌سازی‌ها، ابزارها و ترجمه‌های Vite که به ما در ساخت این نسخه‌ی اصلی جدید کمک کرده‌اند، سپاسگزاریم. از شما دعوت می‌کنیم که در توسعه‌ی Vite مشارکت کنید و به بهبود آن برای کل اکوسیستم کمک نمایید. برای اطلاعات بیشتر، به راهنمای مشارکت ما مراجعه کنید.

برای شروع، پیشنهاد می‌کنیم که به [مرتب‌سازی مشکلات](https://github.com/vitejs/vite/issues)، [بررسی pull requestها](https://github.com/vitejs/vite/pulls)، ارسال درخواست‌های pull برای تست‌های ناموفق بر اساس مشکلات حل نشده و حمایت از دیگران در [بحث‌ها](https://github.com/vitejs/vite/discussions) و در [تالار گفت و گو و کمک](https://discord.com/channels/804011606160703521/1019670660856942652) Vite بپردازید. اگر می‌خواهید با ما صحبت کنید، به جامعه [Discord](http://chat.vite.dev/) ما بپیوندید و در کانال [مشارکت](https://discord.com/channels/804011606160703521/804439875226173480).با ما گفت و گو کنید.

برای آخرین اخبار درباره اکوسیستم و مجموعه Vite، ما را در [بلو اسکای](https://bsky.app/profile/vite.dev)، [X](https://twitter.com/vite_js) یا [Mastodon](https://webtoo.ls/@vite) دنبال کنید

## شروع کار با Vite 6

شما می‌توانید با استفاده از دستور `pnpm create vite` به‌سرعت یک اپلیکیشن Vite را با فریم‌ورک دلخواه خود ایجاد کنید یا به‌صورت آنلاین با نسخه ۶ Vite از طریق [vite.new](https://vite.new) کار کنید.

همچنین می‌توانید از دستور `pnpm create vite-extra` استفاده کنید تا به قالب‌هایی از فریم‌ورک‌ها و محیط‌های اجرایی دیگر مانند Solid، Deno، SSR و استارترهای کتابخانه‌ای دسترسی داشته باشید. این قالب‌های `create vite-extra` زمانی که دستور `create vite` را اجرا می‌کنید نیز تحت گزینه‌ی "Others" در دسترس هستند.

قالب‌های استارتری که Vite ارائه می‌دهد، بیشتر به‌عنوان زمین بازی (playground) برای آزمایش Vite با فریم‌ورک‌های مختلف طراحی شده‌اند. هنگام ساخت پروژه واقعی، بهتر است از قالب استارتر رسمی خود فریم‌ورک استفاده کنید.

دستور `create vite` همچنین میانبرهایی را برای راه‌اندازی قالب‌های پیشنهادی برخی فریم‌ورک‌ها فراهم می‌کند، مانند `create-vue`، `Nuxt 3`، `SvelteKit`، `Remix`، `Analog` و `Angular`.

## حمایت Node.js

در Vite نسخه ۶ از نسخه‌های ۱۸، ۲۰ و ۲۲ به بالای Node.js پشتیبانی می‌شود، درست مانند Vite نسخه ۵، پشتیبانی از Node.js نسخه ۲۱ حذف شده است. Vite به‌طور معمول پشتیبانی از نسخه‌های قدیمی Node.js را پس از رسیدن به پایان عمر آن‌ها [(EOL)](https://endoflife.date/nodejs) متوقف می‌کند. پایان عمر رسمی Node.js نسخه ۱۸ در پایان آوریل ۲۰۲۵ خواهد بود؛ پس از آن، ممکن است نسخه‌ی اصلی جدیدی از Vite منتشر شود که حداقل نسخه‌ی مورد نیاز Node.js را افزایش دهد.

## محیط آزمایشی API

حالا Vite با اضافه شدن API جدیدی به نام Environment API، انعطاف‌پذیری بیشتری دارد. این APIهای جدید به نویسندگان فریم‌ورک‌ها کمک می‌کنند تا تجربه‌ای در محیط توسعه ارائه دهند که به شرایط محیط production بسیار نزدیک‌تر است. همچنین این قابلیت‌ها باعث می‌شود اکوسیستم Vite بتواند بلوک‌های ساخت جدیدی را به اشتراک بگذارد.

اگر شما در حال ساخت یک SPA (Single Page Application) هستید، هیچ چیزی برای شما تغییر نکرده است. وقتی Vite را فقط در یک محیط کلاینتی استفاده می‌کنید، همه چیز مثل قبل عمل می‌کند.
حتی در پروژه‌های SSR (Server Side Rendering) سفارشی، Vite 6 هنوز با نسخه‌های قبلی سازگاری دارد. درواقع، مخاطب اصلی این API جدید بیشتر توسعه‌دهندگان فریم‌ورک‌ها هستند.

برای کاربران کنجکاو، [Sapphi](https://github.com/sapphi-red) یک راهنمای عالی با عنوان [«معرفی محیط API»](https://green.sapphi.red/blog/increasing-vites-potential-with-the-environment-api) نوشته است. این راهنما نقطه‌ی شروع بسیار خوبی برای آشنایی با این API و درک این موضوع است که چرا ما تلاش می‌کنیم Vite را حتی انعطاف‌پذیرتر کنیم.

اگر شما توسعه‌دهنده‌ی یک فریم‌ورک یا نگهدارنده‌ی یک افزونه (پلاگین) برای Vite هستید و می‌خواهید از APIهای جدید استفاده کنید، می‌توانید اطلاعات بیشتر را در [راهنمای Environment API](https://main.vite.dev/guide/api-environment) بخوانید.

ما از همه‌ی افرادی که در تعریف و پیاده‌سازی این APIهای جدید نقش داشتند تشکر می‌کنیم. داستان از زمانی آغاز شد که Vite نسخه ۲، طرح توسعه‌ی SSR بدون باندل (unbundled SSR dev scheme) را که توسط [Rich Harris](https://github.com/Rich-Harris) و تیم [SvelteKit](https://svelte.dev/docs/kit) معرفی شده بود، پذیرفت. تبدیل SSR در Vite زمینه را برای [Anthony Fu](https://github.com/antfu/) و [Pooya Parsa](https://github.com/pi0) فراهم کرد تا ابزار vite-node را بسازند و تجربه‌ی Dev SSR را در [Nuxt](https://antfu.me/posts/dev-ssr-on-nuxt) بهبود دهند.

سپس Anthony از vite-node برای ساخت [Vitest](https://vitest.dev) استفاده کرد و [Vladimir Sheremet](https://github.com/sheremet-va) به‌عنوان نگهدارنده‌ی Vitest، به بهبود آن ادامه داد. در آغاز سال ۲۰۲۳، ولادیمیر شروع به انتقال vite-node به هسته‌ی اصلی Vite کرد، و ما آن را در نسخه‌ی Vite 5.1 با نام **Runtime API** منتشر کردیم.

بازخوردهایی از سوی همکاران اکوسیستم — مخصوصاً تیم Cloudflare — باعث شد که یک بازطراحی بلندپروازانه‌تر برای مدیریت محیط‌ها در Vite انجام دهیم. شما می‌توانید داستان کامل این فرایند را در [سخنرانی Patak در ViteConf 24](https://www.youtube.com/watch?v=WImor3HDyqU?si=EZ-rFJn4pDW3tUvp) ببینید.

تمام اعضای تیم Vite در طراحی این API جدید نقش داشتند، که با مشارکت و بازخورد پروژه‌های مختلف اکوسیستم شکل گرفت. از همه‌ی افراد درگیر سپاسگزاریم! اگر در حال ساخت فریم‌ورک، پلاگین یا ابزاری بر پایه Vite هستید، ما شما را به مشارکت در این فرایند دعوت می‌کنیم.

همچنین APIهای جدید در حال حاضر **آزمایشی** (experimental) هستند. ما همراه با اکوسیستم بررسی خواهیم کرد که این APIها چطور استفاده می‌شوند تا آن‌ها را در نسخه‌ی اصلی بعدی پایدار (stable) کنیم. اگر سوالی دارید یا می‌خواهید بازخورد بدهید، یک [بحث عمومی در گیت‌هاب](https://github.com/vitejs/vite/discussions/16358) باز است که می‌توانید در آن شرکت کنید.

حتماً! در ادامه ترجمه‌ای روان و دقیق از متن:

---

## تغییرات اصلی

- [مقدار پیش‌فرض برای `resolve.conditions`](https://vitejs.dev/guide/migration#default-value-for-resolve-conditions)
- [تبدیل JSON به رشته (JSON stringify)](https://vitejs.dev/guide/migration#json-stringify)
- [پشتیبانی گسترده‌تر از ارجاع به فایل‌های asset در تگ‌های HTML](https://vitejs.dev/guide/migration#extended-support-of-asset-references-in-html-elements)
- [پشتیبانی از `postcss-load-config`](https://vitejs.dev/guide/migration#postcss-load-config)
- [استفاده پیش‌فرض از API مدرن در Sass](https://vitejs.dev/guide/migration#sass-now-uses-modern-api-by-default)
- [امکان سفارشی‌سازی نام فایل خروجی CSS در حالت کتابخانه‌ای](https://vitejs.dev/guide/migration#customize-css-output-file-name-in-library-mode)
- [و تغییرات بیشتر که فقط روی تعداد کمی از کاربران تأثیر می‌گذارند](https://vitejs.dev/guide/migration#advanced)

همچنین یک صفحه جدید با عنوان [تغییرات ناسازگار (Breaking Changes)](https://vitejs.dev/changes/) اضافه شده که شامل فهرست تمامی تغییرات برنامه‌ریزی‌شده، در حال بررسی و اعمال‌شده در Vite است.

---

## مهاجرت به Vite 6

برای بیشتر پروژه‌ها، به‌روزرسانی به Vite نسخه ۶ کار ساده‌ای خواهد بود. با این حال توصیه می‌کنیم پیش از آپگرید، حتماً [راهنمای کامل مهاجرت](https://vitejs.dev/guide/migration) را مرور کنید.

لیست کامل تغییرات در [گزارش تغییرات Vite 6](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2024-11-26) موجود است.

---

## قدردانی

 نسخه ۶ نتیجه‌ی ساعت‌ها کار و تلاش جامعه‌ی مشارکت‌کنندگان، نگهدارنده‌های پروژه‌های مرتبط، نویسندگان افزونه‌ها و تیم [Vite](https://vitejs.dev/team) است. ما قدردان افراد و شرکت‌هایی هستیم که توسعه‌ی Vite را حمایت مالی کرده‌اند.

همچنین Vite توسط [VoidZero](https://voidzero.dev) و با همکاری [StackBlitz](https://stackblitz.com/)، [Nuxt Labs](https://nuxtlabs.com/) و [Astro](https://astro.build) توسعه داده می‌شود.

تشکر ویژه از اسپانسرها در [اسپانسر گیتهاب Vite](https://github.com/sponsors/vitejs) و [جمعیت بزرگ Vite](https://opencollective.com/vite).
