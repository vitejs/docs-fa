# دیپلوی یک سایت استاتیک

راهنماهای زیر بر اساس برخی فرضیات مشترک نوشته شده‌اند:

- شما از مسیر پیش‌فرض برای خروجی فایل‌های بیلد شده (`dist`) استفاده می‌کنید. این مسیر را می‌توانید با استفاده از گزینه `build.outDir` تغییر دهید. اگر مسیر خروجی را تغییر داده‌اید، می‌توانید دستورالعمل‌های زیر را بر اساس نیاز خود تنظیم و تطبیق دهید.
- شما از npm به عنوان پکیج منیجر استفاده می‌کنید. اگر از Yarn یا دیگر پکیج منیجرها استفاده می‌کنید، می‌توانید از دستورات معادل برای اجرای اسکریپت‌ها استفاده کنید.
- Vite به عنوان یک وابستگی توسعه (dev dependency) به صورت محلی در پروژه شما نصب شده است و شما اسکریپت‌های npm زیر را در پروژه خود تنظیم کرده‌اید:

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

توجه داشته باشید که دستور `vite preview` فقط برای پیش‌نمایش فایل‌های build شده به کار می‌رود و نمی‌توان از آن به عنوان یک پروداکشن سرور استفاده کرد.

::: tip توجه
این راهنماها دستورالعمل‌هایی برای انجام پیاده سازی استاتیک (Static Deployment) سایت شما با استفاده از Vite ارائه می‌دهند. Vite همچنین از رندرینگ سمت سرور (Server-Side Rendering یا SSR) پشتیبانی می‌کند. SSR به فریم‌ورک‌های فرانت‌اندی اشاره دارد که قابلیت اجرای یک برنامه یکسان در Node.js، پیش‌رندر کردن آن به HTML و در نهایت Hydrate آن در سمت کلاینت را فراهم می‌کنند. برای یادگیری بیشتر درباره این قابلیت، به [راهنمای SSR](./ssr) مراجعه کنید. از طرف دیگر، اگر به دنبال ادغام با فریم‌ورک‌های سنتی سمت سرور هستید، به جای آن [راهنمای ادغام با backend](./backend-integration) را بررسی کنید.
:::

## بیلد برنامه

می‌توانید از دستور `npm run build` برای بیلد برنامه استفاده کنید.

```bash
$ npm run build
```

به طور پیش‌فرض، خروجی بیلد در پوشه `dist` ذخیره می‌شود. شما می‌توانید این پوشه `dist` را روی هر پلتفرم دلخواهی که مدنظر دارید، دیپلوی کنید.

### تست برنامه به صورت لوکال

پس از بیلد کردن برنامه، می‌توانید آن را به صورت لوکال با استفاده از دستور `npm run preview` تست کنید.

```bash
$ npm run preview
```

دستور `vite preview`،این دستور یک وب سرور استاتیک لوکال راه‌اندازی می‌کند که فایل‌های داخل پوشه `dist` را در آدرس `http://localhost:4173` سرو می‌دهد. این روشی ساده برای بررسی این است که production build در محیط لوکال شما به درستی نمایش داده می‌شود.

می‌توانید پورت سرور را با استفاده از فلگ `‎--port` به عنوان آرگومان تنظیم کنید.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

اکنون دستور `preview` سرور را در آدرس `http://localhost:8080` راه‌اندازی می‌کند.

## GitHub Pages

1. مقدار `base` را در فایل `vite.config.js` به درستی تنظیم کنید.

   - اگر قصد دارید پروژه را در `https://<USERNAME>.github.io/‎` یا روی یک دامنه سفارشی از طریق GitHub Pages (مثلاً `www.example.com`) مستقر کنید، `base` را روی `'/'` تنظیم کنید. همچنین می‌توانید `base` را از تنظیمات حذف کنید، زیرا به طور پیش‌فرض مقدار آن `'/'` است.

   - اگر قصد دارید پروژه را در `https://<USERNAME>.github.io/<REPO>/‎` مستقر کنید (مثلاً اگر مخزن شما در آدرس `https://github.com/<USERNAME>/<REPO>‎` قرار دارد)، `base` را روی `'/<REPO>/'` تنظیم کنید.

2. به بخش تنظیمات GitHub Pages در صفحه تنظیمات مخزن بروید و منبع استقرار را به عنوان **GitHub Actions** انتخاب کنید. این کار شما را به ایجاد یک workflow هدایت می‌کند که پروژه شما را بیلد و مستقر می‌کند. یک workflow نمونه که وابستگی‌ها را نصب کرده و با استفاده از npm پروژه را بیلد می‌کند، ارائه شده است:

   <<< ./static-deploy-github-pages.yaml#content

## GitLab Pages و GitLab CI

1. مقدار `base` را در فایل `vite.config.js` به درستی تنظیم کنید.

   - اگر قصد دارید پروژه خود را در آدرس `‎https://<USERNAME or GROUP>.gitlab.io/‎` دیپلوی کنید، می‌توانید `base` را نادیده بگیرید، زیرا به طور پیش‌فرض مقدار آن `'/'` است.

   - اگر قصد دارید پروژه خود را در آدرس `https://<USERNAME or GROUP>.gitlab.io/<REPO>/‎` دیپلوی کنید (مثلاً اگر مخزن شما در آدرس `https://gitlab.com/<USERNAME>/<REPO>‎` قرار دارد)، باید `base` را به `'/<REPO>/'` تنظیم کنید.

2. در root پروژه خود، یک فایل با نام `‎.gitlab-ci.yml` ایجاد کنید و محتوای زیر را به آن اضافه کنید. این فایل باعث می‌شود هر زمان که تغییراتی در محتوای پروژه ایجاد کنید، به‌طور خودکار سایت شما ساخته شده (build) و دیپلوی شود:

   ```yaml [.gitlab-ci.yml]
   image: node:lts
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

### Netlify CLI

1. [Netlify CLI](https://cli.netlify.com/) را نصب کنید.
2. با استفاده از دستور `ntl init` یک سایت جدید ایجاد کنید.
3. با دستور `ntl deploy` دیپلوی کنید.

```bash
# Install the Netlify CLI
$ npm install -g netlify-cli

# Create a new site in Netlify
$ ntl init

# Deploy to a unique preview URL
$ ntl deploy
```

CLI Netlify یک preview URL در اختیار شما قرار می‌دهد تا بتوانید آن را بررسی کنید. زمانی که آماده هستید به مرحله production بروید، از فلگ `prod` استفاده کنید:

```bash
# Deploy the site into production
$ ntl deploy --prod
```

### Netlify با Git

1. کد خود را به یک ریپازیتوری Git (مثل GitHub، GitLab، BitBucket، Azure DevOps) پوش کنید.
2. [پروژه را به Netlify ایمپورت کنید](https://app.netlify.com/start).
3. برنچ (Branch)، پوشه خروجی و متغیرهای محیطی را در صورت نیاز تنظیم کنید.
4. روی **Deploy** کلیک کنید.
5. اپلیکیشن Vite شما دیپلوی شد!

بعد از اینکه پروژه شما ایمپورت و دیپلوی شد، تمام پوش‌های بعدی به برنچ‌های غیر از برنچ اصلی (Production Branch) و همچنین Pull Request‌ها، [Preview Deployments](https://docs.netlify.com/site-deploys/deploy-previews/) ایجاد می‌کنند و تمام تغییرات اعمال شده روی برنچ اصلی (معمولاً “main”) منجر به یک [Production Deployment](https://docs.netlify.com/site-deploys/overview/#definitions) خواهند شد.

## Vercel

### Vercel CLI

1. [Vercel CLI](https://vercel.com/cli) را نصب کنید و دستور `vercel` را اجرا کنید تا دیپلوی انجام شود.
2. Vercel تشخیص می‌دهد که شما از Vite استفاده می‌کنید و تنظیمات صحیح را برای دیپلوی فعال می‌کند.
3. اپلیکیشن شما دیپلوی شد! (مثال: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel برای Git

1. کد خود را به ریپازیتوری Git (مثل GitHub، GitLab، Bitbucket) پوش کنید.
2. [پروژه Vite خود را به Vercel ایمپورت کنید](https://vercel.com/new).
3. Vercel تشخیص می‌دهد که شما از Vite استفاده می‌کنید و تنظیمات صحیح را برای دیپلوی فعال می‌کند.
4. اپلیکیشن شما دیپلوی شد! (مثال: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

بعد از اینکه پروژه شما ایمپورت و دیپلوی شد، تمام پوش‌های بعدی به برنچ‌ها، [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview) ایجاد می‌کنند و تمام تغییرات اعمال شده روی برنچ اصلی (معمولاً “main”) منجر به یک [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production) خواهند شد.

برای اطلاعات بیشتر، می‌توانید درباره [Git Integration در Vercel](https://vercel.com/docs/concepts/git) مطالعه کنید.

## Cloudflare Pages

### Cloudflare Pages از طریق Wrangler

1. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/) را نصب کنید.
2. Wrangler را با حساب Cloudflare خود احراز هویت کنید. برای این کار از دستور `wrangler login` استفاده کنید.
3. دستور build خود را اجرا کنید.
4. با استفاده از دستور `npx wrangler pages deploy dist` دیپلوی کنید.

```bash
# Install Wrangler CLI
$ npm install -g wrangler

# Login to Cloudflare account from CLI
$ wrangler login

# Run your build command
$ npm run build

# Create new deployment
$ npx wrangler pages deploy dist
```

بعد از آپلود فایل‌ها، Wrangler یک preview URL در اختیار شما قرار می‌دهد تا سایت خود را بررسی کنید. وقتی وارد داشبورد Cloudflare Pages می‌شوید، پروژه جدید خود را مشاهده خواهید کرد.

### Cloudflare Pages با Git

1. کد خود را به ریپازیتوری Git (مثل GitHub، GitLab) پوش کنید.
2. وارد داشبورد Cloudflare شوید و حساب خود را در **Account Home** > **Pages** انتخاب کنید.
3. **Create a new Project** و گزینه **Connect Git** را انتخاب کنید.
4. پروژه Git که می‌خواهید دیپلوی کنید را انتخاب کرده و روی **Begin setup** کلیک کنید.
5. در تنظیمات build، پریست فریم‌ورک مربوطه را بسته به فریم‌ورک Vite انتخاب‌شده تنظیم کنید.
6. سپس ذخیره کرده و دیپلوی کنید!
7. اپلیکیشن شما دیپلوی شد! (مثال: `https://<PROJECTNAME>.pages.dev/‎`)

بعد از اینکه پروژه شما ایمپورت و دیپلوی شد، تمام پوش‌های بعدی به برنچ‌ها، [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/) ایجاد می‌کنند (مگر اینکه در [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/) غیرفعال شده باشد). تمام تغییرات در برنچ اصلی (معمولاً “main”) منجر به یک Production Deployment خواهد شد.

همچنین می‌توانید دامنه‌های سفارشی اضافه کنید و تنظیمات build سفارشی را در Pages مدیریت کنید. برای اطلاعات بیشتر، [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site) را مطالعه کنید.

## Google Firebase

1. مطمئن شوید که [firebase-tools](https://www.npmjs.com/package/firebase-tools) نصب شده است.

2. در root پروژه خود فایل‌های `firebase.json` و `.firebaserc` را با محتوای زیر ایجاد کنید:

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. بعد از اجرای دستور `npm run build`، با استفاده از دستور `firebase deploy` دیپلوی کنید.

## Surge

ابتدا اگر surge را نصب نکرده‌اید، آن را نصب کنید.

دستور `npm run build` را اجرا کنید.

برای دیپلوی روی surge، دستور `surge dist` را وارد کنید.

همچنین می‌توانید با استفاده از دستور `surge dist yourdomain.com` روی یک دامنه سفارشی دیپلوی کنید.

## Azure Static Web Apps

می‌توانید اپلیکیشن Vite خود را به سرعت با سرویس [Static Web Apps](https://aka.ms/staticwebapps) مایکروسافت Azure دیپلوی کنید. برای این کار به موارد زیر نیاز دارید:

- یک حساب Azure و کلید اشتراک. می‌توانید [یک حساب Azure رایگان ایجاد کنید](https://azure.microsoft.com/free).
- کد اپلیکیشن شما که به [GitHub](https://github.com) پوش شده باشد.
- [افزونه SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) در [Visual Studio Code](https://code.visualstudio.com).

افزونه را در VS Code نصب کنید و به root پروژه خود بروید. افزونه Static Web Apps را باز کنید، به Azure وارد شوید و روی علامت '+' کلیک کنید تا یک Static Web App جدید ایجاد کنید. از شما خواسته می‌شود که کلید اشتراک مورد نظر خود را انتخاب کنید.

مراحل راهنمای ارائه‌شده توسط افزونه را دنبال کنید تا نام اپلیکیشن خود را انتخاب کنید، پریست فریم‌ورک را تنظیم کنید و مسیر root اپلیکیشن (معمولاً `/`) و مسیر فایل‌های ساخته‌شده (`‎/dist`) را مشخص کنید. راهنما اجرا می‌شود و یک GitHub Action در ریپازیتوری شما در پوشه `‎.github` ایجاد می‌کند.

این Action برای دیپلوی اپلیکیشن شما کار می‌کند (پیشرفت آن را در تب Actions ریپازیتوری خود مشاهده کنید) و پس از تکمیل موفقیت‌آمیز، می‌توانید اپلیکیشن خود را در آدرس ارائه‌شده در پنجره پیشرفت افزونه مشاهده کنید. برای این کار، روی دکمه 'Browse Website' که پس از اجرای GitHub Action ظاهر می‌شود، کلیک کنید.

## Render

می‌توانید اپلیکیشن Vite خود را به عنوان یک سایت استاتیک در [Render](https://render.com/) دیپلوی کنید.

1. یک [حساب Render](https://dashboard.render.com/register) ایجاد کنید.

2. در [داشبورد](https://dashboard.render.com/)، روی دکمه **New** کلیک کنید و **Static Site** را انتخاب کنید.

3. حساب GitHub/GitLab خود را متصل کنید یا از یک ریپازیتوری عمومی استفاده کنید.

4. یک نام پروژه و برنچ مشخص کنید.
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. روی **Create Static Site** کلیک کنید.

   اپلیکیشن شما باید در `https://<PROJECTNAME>.onrender.com/‎` دیپلوی شود.

به طور پیش‌فرض، هر کامیت جدیدی که به برنچ مشخص‌شده پوش شود، به طور خودکار یک دیپلوی جدید ایجاد می‌کند. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) را می‌توان در تنظیمات پروژه پیکربندی کرد.

همچنین می‌توانید یک [دامنه سفارشی](https://render.com/docs/custom-domains) به پروژه خود اضافه کنید.

<!--
  NOTE: The sections below are reserved for more deployment platforms not listed above.
  Feel free to submit a PR that adds a new section with a link to your platform's
  deployment guide, as long as it meets these criteria:

  1. Users should be able to deploy their site for free.
  2. Free tier offerings should host the site indefinitely and are not time-bound.
     Offering a limited number of computation resource or site counts in exchange is fine.
  3. The linked guides should not contain any malicious content.

  The Vite team may change the criteria and audit the current list from time to time.
  If a section is removed, we will ping the original PR authors before doing so.
-->

## Flightcontrol

سایت استاتیک خود را با استفاده از [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) و با دنبال کردن این [دستورالعمل‌ها](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite) دیپلوی کنید.

## Kinsta Static Site Hosting

سایت استاتیک خود را با استفاده از [Kinsta](https://kinsta.com/static-site-hosting/) و با دنبال کردن این [دستورالعمل‌ها](https://kinsta.com/docs/react-vite-example/) دیپلوی کنید.

## xmit Static Site Hosting

سایت استاتیک خود را با استفاده از [xmit](https://xmit.co) و با دنبال کردن این [راهنما](https://xmit.dev/posts/vite-quickstart/) دیپلوی کنید.
