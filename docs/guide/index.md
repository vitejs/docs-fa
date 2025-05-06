# شروع

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## مرور کلی

Vite (یک کلمه فرانسوی به معنای "سریع"، که `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button> تلفظ می‌شود، مانند "ویت") یک ابزار بیلد است که هدف آن ارائه تجربه توسعه سریع‌تر و سبک‌تر برای پروژه‌های وب مدرن است. این ابزار از دو بخش اصلی تشکیل شده است:

یک سرور توسعه که [ویژگی‌های پیشرفته‌تری](./features) را برای [ماژول‌های ES بومی](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) فراهم می‌کند. از جمله این ویژگی‌ها، [جایگزینی سریع ماژول (HMR)](./features#hot-module-replacement) با عملکردی بسیار بهینه است.

- یک کامَند بیلد که کد شما را با [Rollup](https://rollupjs.org) باندل می‌کند، که آماده شده تا فایل‌های استاتیک بسیار بهینه‌شده برای پروداکشن بسازد.

Vite با یک نگرش خاص طراحی شده و تنظیمات پیش‌فرض معقولی را ارائه می‌دهد. برای آشنایی با امکانات بیشتر، می‌توانید به [راهنمای ویژگی‌ها](./features) مراجعه کنید. همچنین، امکان پشتیبانی از فریم‌ورک‌ها و ادغام با سایر ابزارها از طریق [پلاگین‌ها](./using-plugins) وجود دارد. در [بخش تنظیمات](../config/) نیز توضیح داده‌ایم که چگونه Vite را متناسب با نیازهای پروژه خود سفارشی کنید.

Vite همچنین از طریق [API پلاگین](./api-plugin) و [API جاوااسکریپت](./api-javascript) با پشتیبانی کامل از تایپ‌ها، به شدت قابل توسعه است.

می‌توانید برای آشنایی بیشتر با دلایل پشت پروژه به بخش [چرا Vite](./why) مراجعه کنید.

## پشتیبانی مرورگر

در طول توسعه، Vite مقدار [`esnext` را به target](https://esbuild.github.io/api/#target) تنظیم می‌کند، زیرا ما فرض می‌کنیم که از یک مرورگر مدرن استفاده می‌شود که تمام ویژگی‌های جدید جاوااسکریپت و CSS را پشتیبانی می‌کند. این از کاهش سطح سینتکس جلوگیری می‌کند و به Vite اجازه می‌دهد ماژول‌ها را تا حد امکان نزدیک به سورس کد اصلی سِرو کند.

در فرآیند بیلد برای پروداکشن، Vite به‌طور پیش‌فرض مرورگرهایی را هدف قرار می‌دهد که از ویژگی‌های مدرن جاوااسکریپت پشتیبانی می‌کنند. این ویژگی‌ها شامل [ماژول‌های ES بومی](https://caniuse.com/es6-module) ، [ایمپورت داینامیک ESM](https://caniuse.com/es6-module-dynamic-import) ، [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) ، [Nullish Coalescing](https://caniuse.com/mdn-javascript_operators_nullish_coalescing) و [BigInt](https://caniuse.com/bigint) هستند. در صورت نیاز به پشتیبانی از مرورگرهای قدیمی، می‌توان از پلاگین رسمی [‎@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) استفاده کرد. برای اطلاعات بیشتر، به بخش [بیلد برای پروداکشن](./build) مراجعه کنید.

## امتحان Vite به صورت آنلاین

می‌توانید Vite را به صورت آنلاین در [StackBlitz](https://vite.new/) امتحان کنید. این ابزار، تنظیمات بیلد مبتنی بر Vite را مستقیماً در مرورگر شما اجرا می‌کند، بنابراین تقریباً با تنظیمات لوکال (local) مشابه است اما نیازی به نصب هیچ چیزی بر روی دستگاه شما ندارد. می‌توانید به `vite.new/{template}` بروید تا فریم‌ورک مورد نظر خود را انتخاب کنید.

قالب‌های پشتیبانی شده عبارتند از:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## ساخت اولین پروژه Vite شما

::: tip نکته سازگاری
Vite به نسخه ۱۸+ یا ۲۰+ از [Node.js](https://nodejs.org/en/) نیاز دارد. با این حال، برخی قالب‌ها برای کار نیاز به نسخه بالاتری از Node.js دارند. لطفاً اگر پکیج منیحر شما هشدار می‌دهد، Node.js را به‌روزرسانی کنید.
:::

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [pnpm]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

سپس مراحل را دنبال کنید!

همچنین می‌توانید با استفاده از آپسن‌های اضافی خط فرمان، نام پروژه و قالب مورد نظر خود را مستقیماً مشخص کنید. به عنوان مثال، برای ایجاد یک پروژه Vite با Vue این دستور را اجرا کنید:

::: code-group

```bash [npm]
# npm 7+ , دو خط تیره اضافی مورد نیاز است:
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [pnpm]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

برای جزئیات بیشتر درباره قالب‌های پشتیبانی شده به [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) مراجعه کنید: `vanilla` ، `vanilla-ts` ، `vue` ، `vue-ts` ، `react` ، `react-ts` ، `react-swc` ، `react-swc-ts` ، `preact` ، `preact-ts` ، `lit` ، `lit-ts` ، `svelte` ، `svelte-ts` ، `solid` ، `solid-ts` ، `qwik`، `qwik-ts`.

می‌توانید از `.` برای نام پروژه استفاده کنید تا در دایرکتوری فعلی، ساختار پروژه ایجاد شود.

## قالب‌های ارائه شده توسط جامعه

create-vite ابزاری است برای شروع سریع یک پروژه از یک قالب پایه برای فریم‌ورک‌های محبوب. می‌توانید Awesome Vite را برای [قالب‌های نگهداری شده توسط جامعه](https://github.com/vitejs/awesome-vite#templates) که شامل ابزارهای دیگر یا فریم‌ورک‌های مختلف هستند، بررسی کنید.

برای استفاده قالبی که در `https://github.com/user/project` منتشر شده، می‌توانید آن را به صورت آنلاین با استفاده از `https://github.stackblitz.com/user/project` امتحان کنید (با اضافه کردن `‎.stackblitz` بعد از `github` به URL پروژه).

همچنین می‌توانید از ابزاری مانند [degit](https://github.com/Rich-Harris/degit) برای ساخت پروژه خود با یکی از قالب‌ها استفاده کنید. با فرض اینکه پروژه در GitHub است و از `main` به عنوان برنچ پیش‌فرض استفاده می‌کند، می‌توان یک کپی محلی با این دستور ایجاد کرد:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## نصب دستی

در پروژه خود، می‌توانید ابزار خط فرمان `vite` را با استفاده از دستور زیر نصب کنید:

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [pnpm]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

و یک فایل `index.html` به شکل زیر ایجاد کنید:

```html
<p>Hello Vite!</p>
```

سپس دستور CLI مناسب را در ترمینال خود اجرا کنید:

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [pnpm]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

`index.html` در `http://localhost:5173` سرو می‌شود.

## `index.html` و ریشه (Root) پروژه

یک نکته‌ای که ممکن است متوجه شده باشید این است که در یک پروژه Vite، فایل `index.html` در مرکز توجه قرار دارد به جای اینکه در داخل `public` پنهان شده باشد. این عمدی است: در طول توسعه، Vite یک سرور است و `index.html` نقطه ورود به برنامه شما است.

Vite فایل `index.html` را به‌عنوان بخشی از گراف ماژول‌ها و یکی از منابع اصلی کد در نظر می‌گیرد. این ابزار تگ اسکریپت `‎<script type="module" src="...">‎` را پردازش کرده و به کد جاوااسکریپت شما اعمال می‌کند. حتی تگ‌های `‎<script type="module">‎` داخلی و فایل‌های CSS که از طریق `<link href="...">` ارجاع داده شده‌اند نیز از قابلیت‌های ویژه‌ی Vite بهره‌مند می‌شوند. علاوه بر این، URLهای درون `index.html` به‌صورت خودکار تنظیم می‌شوند، بنابراین نیازی به استفاده از نگهدارنده‌هایی مانند `%PUBLIC_URL%` نخواهید داشت.

مشابه سرورهای HTTP استاتیک، Vite مفهومی با نام "دایرکتوری ریشه" را دارد که فایل‌های شما از آنجا سرو می‌شوند. شما آن را به عنوان `<root>` در بقیه مستندات مشاهده خواهید کرد. URLهای مطلق در سورس کد شما با استفاده از ریشه پروژه به عنوان پایه پردازش می‌شوند، بنابراین می‌توانید کدی بنویسید که انگار با یک سرور فایل استاتیک عادی کار می‌کنید (جز اینکه بسیار قدرتمندتر!). Vite همچنین قادر به مدیریت وابستگی‌هایی است که در مکان‌های خارج از سیستم فایل ریشه پردازش می‌شوند، که استفاده از آن را حتی در تنظیمات مبتنی بر مونوریپو امکان‌پذیر می‌سازد.

Vite همچنین از [برنامه‌های چند صفحه‌ای](./build#multi-page-app) با چندین نقطه ورود `‎.html` پشتیبانی می‌کند.

#### تعیین ریشه (Root) جایگزین

`vite` سرور توسعه را با استفاده از دایرکتوری کاری فعلی به عنوان ریشه راه‌اندازی می‌کند. شما می‌توانید ریشه جایگزینی را با استفاده از `vite serve some/sub/dir` مشخص کنید.
توجه داشته باشید که Vite همچنین [فایل پیکربندی خود (یعنی `vite.config.js`)](/config/#configuring-vite) را در داخل ریشه پروژه حل و فصل می‌کند، بنابراین اگر ریشه تغییر کند باید آن را جابجا کنید.

## رابط خط فرمان (CLI)

در پروژه‌ای که Vite نصب شده است، می‌توانید از باینری `vite` در اسکریپت‌های npm خود استفاده کنید، یا مستقیماً آن را با `npx vite` اجرا کنید. در اینجا اسکریپت‌های پیش‌فرض npm در یک پروژه ساخته‌شده شده با Vite آورده شده است:

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // `vite dev` ، `vite serve` :شروع سرور توسعه، نام‌های جایگزین
    "build": "vite build", // بیلد برای پروداکشن
    "preview": "vite preview" // پیش‌نمایش بیلد پروداکشن به صورت محلی
  }
}
```

می‌توانید گزینه‌های CLI اضافی مانند `‎--port` یا `‎--open` را مشخص کنید. برای مشاهده لیست کامل گزینه‌های CLI، دستور `npx vite --help` را در پروژه خود اجرا کنید.

بیشتر در مورد [رابط خط فرمان (CLI)](./cli.md) یاد بگیرید

## استفاده از کامیت‌های منتشر نشده

اگر برای امتحان ویژگی‌های جدید نمی‌توانید منتظر نسخه جدید باشید، می‌توانید یک کامیت مشخص از vite را با استفاده از https://pkg.pr.new نصب کنید:

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

:::

`SHA` را با هر یک از [commit SHA های Vite](https://github.com/vitejs/vite/commits/main/) جایگزین کنید. توجه داشته باشید که فقط commit‌های مربوط به ماه گذشته کار می‌کنند، زیرا نسخه‌های قدیمی‌تر پاک می‌شوند.

به طور جایگزین، می‌توانید مخزن [vite](https://github.com/vitejs/vite) را در ماشین محلی خود کلون کرده و سپس آن را خودتان بسازید و لینک کنید ([pnpm](https://pnpm.io/) مورد نیاز است):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # از پکیج منیجر دلخواه خود برای این مرحله استفاده کنید
```

سپس به پروژه مبتنی بر Vite خود بروید و دستور `pnpm link --global vite` را اجرا کنید (یا مدیریت بسته‌ای که برای لینک کردن `vite` به صورت سراسری استفاده کرده‌اید). حالا سرور توسعه را مجدداً راه‌اندازی کنید تا در کنار آخرین ویژگی‌ها پیشرو باشید!

::: tip وابستگی‌ها با استفاده از Vite
برای جایگزینی نسخه Vite که به طور غیرمستقیم توسط وابستگی‌ها استفاده می‌شود، باید از [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) یا [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) استفاده کنید.
:::

## جامعه (Community)

اگر سوالی دارید یا به کمک نیاز دارید، با جامعه در [Discord](https://chat.vite.dev) و [GitHub Discussions](https://github.com/vitejs/vite/discussions) تماس بگیرید.
