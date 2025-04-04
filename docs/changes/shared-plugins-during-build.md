# پلاگین‌های مشترک در زمان Build

::: tip بازخورد
نظرات خود را در [بازخورد درباره Environment API](https://github.com/vitejs/vite/discussions/16358) با ما به اشتراک بگذارید.
:::

برای اطلاعات بیشتر به بخش [Shared plugins during build](/guide/api-environment.md#shared-plugins-during-build) مراجعه کنید.

**دامنه تأثیر:** نویسندگان افزونه‌های Vite

::: warning تغییر پیش‌فرض در آینده
ویژگی `builder.sharedConfigBuild` برای اولین بار در نسخه `v6.0` معرفی شد. می‌توانید آن را روی `true` تنظیم کنید تا بررسی کنید افزونه‌هایتان با پیکربندی مشترک چگونه کار می‌کنند. ما به دنبال بازخورد هستیم تا پس از آمادگی اکوسیستم افزونه‌ها، این مقدار پیش‌فرض را در نسخه‌ای اصلی از Vite تغییر دهیم.
:::

## انگیزه
## انگیزه

هماهنگ کردن مسیر پلاگین‌ها در محیط توسعه و ساخت.

## راهنمای مهاجرت
## راهنمای مهاجرت

برای اینکه بتوانید پلاگین‌ها را در محیط‌های مختلف به اشتراک بگذارید، وضعیت پلاگین باید بر اساس محیط جاری کلیدگذاری شود. پلاگینی به شکل زیر تعداد ماژول‌های تبدیل‌شده در همه محیط‌ها را محاسبه می‌کند.

```js
function CountTransformedModulesPlugin() {
  let transformedModules
  return {
    name: 'count-transformed-modules',
    buildStart() {
      transformedModules = 0
    },
    transform(id) {
      transformedModules++
    },
    buildEnd() {
      console.log(transformedModules)
    },
  }
}
```

اگر به جای آن بخواهیم تعداد ماژول‌های تبدیل‌شده را برای هر محیط شمارش کنیم، باید یک Map نگه داریم:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = new Map<Environment, { count: number }>()
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state.set(this.environment, { count: 0 })
    }
    transform(id) {
      state.get(this.environment).count++
    },
    buildEnd() {
      console.log(this.environment.name, state.get(this.environment).count)
    }
  }
}
```

برای ساده‌سازی این الگو، Vite یک ابزار کمکی به نام `perEnvironmentState` را اکسپورت می‌کند:

```js
function PerEnvironmentCountTransformedModulesPlugin() {
  const state = perEnvironmentState<{ count: number }>(() => ({ count: 0 }))
  return {
    name: 'count-transformed-modules',
    perEnvironmentStartEndDuringDev: true,
    buildStart() {
      state(this).count = 0
    }
    transform(id) {
      state(this).count++
    },
    buildEnd() {
      console.log(this.environment.name, state(this).count)
    }
  }
}
```
