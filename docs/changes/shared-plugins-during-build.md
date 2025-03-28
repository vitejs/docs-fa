# افزونه‌های مشترک در زمان ساخت

::: tip بازخورد
بازخورد خود را در [بحث بازخورد API محیط](https://github.com/vitejs/vite/discussions/16358) با ما در میان بگذارید.
:::

به [افزونه‌های مشترک در زمان ساخت](/guide/api-environment.md#shared-plugins-during-build) مراجعه کنید.

دامنه تأثیر: `نویسندگان افزونه‌های Vite`

::: warning تغییر پیش‌فرض در آینده
`builder.sharedConfigBuild` برای اولین بار در نسخه `v6.0` معرفی شد. می‌توانید آن را روی `true` تنظیم کنید تا بررسی کنید افزونه‌هایتان با تنظیمات مشترک چگونه کار می‌کنند. ما به دنبال بازخورد درباره تغییر پیش‌فرض در یک نسخه اصلی آینده هستیم، زمانی که اکوسیستم افزونه‌ها آماده باشد.
:::

## انگیزه

هم‌راستا کردن خطوط لوله افزونه‌ها در زمان توسعه و ساخت.

## راهنمای مهاجرت

برای به اشتراک گذاشتن افزونه‌ها بین محیط‌ها، وضعیت افزونه باید بر اساس محیط فعلی کلیدگذاری شود. افزونه‌ای به شکل زیر تعداد ماژول‌های تبدیل‌شده را در همه محیط‌ها می‌شمارد:

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

اگر بخواهیم تعداد ماژول‌های تبدیل‌شده را برای هر محیط به‌صورت جداگانه بشماریم، باید یک نقشه نگه داریم:

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

برای ساده‌سازی این الگو، Vite یک کمک‌کننده به نام `perEnvironmentState` ارائه می‌دهد:

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
