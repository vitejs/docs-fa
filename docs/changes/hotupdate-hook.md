# هوک پلاگین `hotUpdate` برای HMR

::: tip بازخورد
به ما در [Environment API feedback discussion](https://github.com/vitejs/vite/discussions/16358) بازخورد دهید
:::

ما قصد داریم هوک پلاگین `handleHotUpdate` را به نفع [هوک `hotUpdate`](/guide/api-environment#the-hotupdate-hook) منسوخ کنیم تا با [API محیطی](/guide/api-environment.md) هماهنگ شود و رویدادهای  اضافی نظلرت (watch events) را با create و delete مدیریت کند.

دامنه تاثیر: `نویسندگان پلاگین Vite`

::: warning منسوخ‌شدن در آینده
هوک `hotUpdate` اولین بار در نسخه `v6.0` معرفی شد. منسوخ شدن `handleHotUpdate` برای نسخه `v7.0` برنامه‌ریزی شده است. هنوز توصیه نمی‌کنیم که از `handleHotUpdate` استفاده نکنید. اگر می‌خواهید آزمایش کنید و بازخورد بدهید، می‌توانید در تنظیمات Vite خود `future.removePluginHookHandleHotUpdate` را به مقدار `"warn"` تنظیم کنید.
:::

## انگیزه

[هوک `handleHotUpdate`](/guide/api-plugin.md#handlehotupdate) به شما این امکان را می‌دهد که به‌طور سفارشی به‌روزرسانی‌های HMR را مدیریت کنید. یک لیست از ماژول‌هایی که باید به‌روزرسانی شوند در `HmrContext` ارسال می‌شود.

```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

این هوک یک‌بار برای تمامی محیط‌ها فراخوانی می‌شود و ماژول‌های ارسال‌شده اطلاعات ترکیبی از محیط‌های Client و SSR دارند. زمانی که فریم‌ورک‌ها به محیط‌های سفارشی منتقل شوند، به هوک جدیدی نیاز است که برای هر یک از این محیط‌ها فراخوانی شود.

هوک جدید `hotUpdate` به همان روش `handleHotUpdate` کار می‌کند، اما برای هر محیط به‌طور جداگانه فراخوانی می‌شود و یک نمونه جدید از `HotUpdateOptions` دریافت می‌کند.

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'
  file: string
  timestamp: number
  modules: Array<EnvironmentModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

محیط توسعه کنونی مانند سایر هوک‌های پلاگین با استفاده از `this.environment` قابل دسترسی است. لیست `modules` اکنون تنها شامل گره‌های ماژول از محیط جاری خواهد بود. هر به‌روزرسانی محیط می‌تواند استراتژی‌های به‌روزرسانی مختلفی را تعریف کند.


این هوک اکنون برای رویدادهای اضافی نظارت (watch events) نیز فراخوانی می‌شود و تنها مختص `'update'` نیست. برای تمایز بین آن‌ها از `type` استفاده کنید.

## راهنمای مهاجرت

برای دقت بیشتر در HMR، لیست ماژول‌های تحت تاثیر را فیلتر کرده و محدود کنید.

```js
handleHotUpdate({ modules }) {
  return modules.filter(condition)
}

// مهاجرت کنید به:

hotUpdate({ modules }) {
  return modules.filter(condition)
}
```

یک آرایه خالی برگردانید و بارگذاری کامل را انجام دهید:

```js
handleHotUpdate({ server, modules, timestamp }) {
  // ماژول‌ها را به‌صورت دستی غیرفعال کنید
  const invalidatedModules = new Set()
  for (const mod of modules) {
    server.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  server.ws.send({ type: 'full-reload' })
  return []
}

// مهاجرت کنید به:

hotUpdate({ modules, timestamp }) {
  // ماژول‌ها را به‌صورت دستی غیرفعال کنید
  const invalidatedModules = new Set()
  for (const mod of modules) {
    this.environment.moduleGraph.invalidateModule(
      mod,
      invalidatedModules,
      timestamp,
      true
    )
  }
  this.environment.hot.send({ type: 'full-reload' })
  return []
}
```

یک آرایه خالی برگردانید و مدیریت کامل HMR سفارشی را با ارسال رویدادهای سفارشی به کلاینت انجام دهید:

```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}

// مهاجرت کنید به:

hotUpdate() {
  this.environment.hot.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
