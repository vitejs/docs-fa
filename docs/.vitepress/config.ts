import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import type { PluginOption } from 'vite'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'ابزار نسل بعدی فرانت‌اند'
const ogImage = 'https://vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://vite.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ''
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Vite 5 Docs',
      link: 'https://v5.vite.dev'
    },
    {
      text: 'Vite 4 Docs',
      link: 'https://v4.vite.dev'
    },
    {
      text: 'Vite 3 Docs',
      link: 'https://v3.vite.dev'
    },
    {
      text: 'Vite 2 Docs',
      link: 'https://v2.vite.dev'
    }
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 6 Docs (release)',
          link: 'https://vite.dev'
        },
        ...oldVersions
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'ابزار نسل بعدی فرانت‌اند',
  dir: 'rtl',
  lang: 'fa',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' }
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true'
      }
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap'
      }
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: ''
      }
    ]
  ],

  locales: {
    root: { label: 'فارسی' },
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' }
  },

  themeConfig: {
    logo: '/logo.svg',

    docFooter: {
      prev: 'قبلی',
      next: 'بعدی'
    },

    outlineTitle: 'در این صفحه',

    editLink: {
      pattern:
        'https://github.com/mostafa-nematpour/vite-docs-fa/edit/main/docs/:path',
      text: 'اصلاح ترجمه این صفحه در گیت‌هاب'
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],

    // algolia: {
    //   appId: '7H67QR5P0A',
    //   apiKey: '208bb9c14574939326032b937431014b',
    //   indexName: 'vitejs',
    //   searchParameters: {
    //     facetFilters: ['tags:en']
    //   }
    // },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    footer: {
      message: `تحت مجوز MIT منتشر شده. (${commitRef})`,
      copyright:
        'کپی‌رایت © ۲۰۱۹ تا کنون متعلق به VoidZero Inc و مشارکت‌کنندگان vite.'
    },

    nav: [
      { text: 'مستندات', link: '/guide/', activeMatch: '/guide/' },
      { text: 'کانفیگ', link: '/config/', activeMatch: '/config/' },
      { text: 'پلاگین‌ها', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'منابع',
        items: [
          { text: 'تیم', link: '/team' },
          { text: 'بلاگ', link: '/blog' },
          { text: 'ریلیز ها', link: '/releases' },
          {
            items: [
              {
                text: 'بلواسکای',
                link: 'https://bsky.app/profile/vite.dev'
              },
              {
                text: 'ماستادون',
                link: 'https://elk.zone/m.webtoo.ls/@vite'
              },
              {
                text: 'ایکس',
                link: 'https://x.com/vite_js'
              },
              {
                text: 'چت دیسکورد',
                link: 'https://chat.vite.dev'
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite'
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org'
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite'
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
              },
              {
                text: 'Contributing',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md'
              }
            ]
          }
        ]
      },
      {
        text: 'نسخه',
        items: versionLinks
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'مقدمه',
          items: [
            {
              text: 'شروع',
              link: '/guide/'
            },
            {
              text: 'فلسفه',
              link: '/guide/philosophy'
            },
            {
              text: 'چرا Vite',
              link: '/guide/why'
            }
          ]
        },
        {
          text: 'راهنما',
          items: [
            {
              text: 'ویژگی‌ها',
              link: '/guide/features'
            },
            {
              text: 'رابط خط فرمان - CLI',
              link: '/guide/cli'
            },
            {
              text: 'استفاده از پلاگین‌ها ',
              link: '/guide/using-plugins'
            },
            {
              text: 'پیش‌بسته‌بندی وابستگی',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: 'مدیریت asset های استاتیک',
              link: '/guide/assets',
            },
            {
              text: 'ساخت برای محیط پروداکشن',
              link: '/guide/build'
            },
            {
              text: 'دیپلوی یک سایت استاتیک',
              link: '/guide/static-deploy'
            },
            {
              text: 'متغیرهای محیطی (Env) و حالت‌ها ',
              link: '/guide/env-and-mode'
            },
            {
              text: 'رندر سمت سرور (SSR)',
              link: '/guide/ssr'
            },
            {
              text: 'یکپارچه‌سازی با بک‌اند',
              link: '/guide/backend-integration'
            },
            {
              text: 'عیب‌یابی',
              link: '/guide/troubleshooting'
            },
            {
              text: 'عملکرد',
              link: '/guide/performance'
            },
            {
              text: 'یکپارچه‌سازی با Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'مهاجرت از v5',
              link: '/guide/migration'
            },
            {
              text: 'تغییرات اساسی',
              link: '/changes/'
            }
          ]
        },
        {
          text: 'API ها',
          items: [
            {
              text: 'API پلاگین',
              link: '/guide/api-plugin'
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr'
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript'
            },
            {
              text: 'بخش کانفیگ',
              link: '/config/'
            }
          ]
        },
        {
          text: 'Environment API',
          items: [
            {
              text: 'مقدمه',
              link: '/guide/api-environment'
            },
            {
              text: 'نمونه‌های Environment',
              link: '/guide/api-environment-instances'
            },
            {
              text: 'پلاگین‌ها',
              link: '/guide/api-environment-plugins'
            },
            {
              text: 'فریمورک‌ها',
              link: '/guide/api-environment-frameworks'
            },
            {
              text: 'رانتایم‌ها',
              link: '/guide/api-environment-runtimes'
            }
          ]
        }
      ],
      '/config/': [
        {
          text: 'کانفیگ',
          items: [
            {
              text: 'پیکربندی Vite',
              link: '/config/'
            },
            {
              text: 'گزینه‌های مشترک',
              link: '/config/shared-options'
            },
            {
              text: 'گزینه‌های سرور',
              link: '/config/server-options'
            },
            {
              text: 'گزینه‌های بیلد',
              link: '/config/build-options'
            },
            {
              text: 'گزینه‌های پیش‌نمایش',
              link: '/config/preview-options'
            },
            {
              text: 'گزینه‌های بهینه‌سازی وابستگی‌ها',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'گزینه‌های SSR',
              link: '/config/ssr-options'
            },
            {
              text: 'Worker Options',
              link: '/config/worker-options'
            }
          ]
        }
      ],
      '/changes/': [
        {
          text: 'Breaking Changes',
          link: '/changes/'
        },
        {
          text: 'Current',
          items: []
        },
        {
          text: 'Future',
          items: [
            {
              text: 'this.environment in Hooks',
              link: '/changes/this-environment-in-hooks'
            },
            {
              text: 'HMR hotUpdate Plugin Hook',
              link: '/changes/hotupdate-hook'
            },
            {
              text: 'انتقال به APIهای مخصوص هر محیط',
              link: '/changes/per-environment-apis'
            },
            {
              text: 'SSR با استفاده از ModuleRunner API',
              link: '/changes/ssr-using-modulerunner'
            },
            {
              text: 'پلاگین‌های مشترک در زمان Build',
              link: '/changes/shared-plugins-during-build'
            }
          ]
        },
        {
          text: 'Past',
          items: []
        }
      ]
    },

    outline: {
      level: [2, 3]
    }
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }]
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab'
        }
      }),
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: 'The Build Tool for the Web',
        details: `\
- 💡 Instant Server Start
- ⚡️ Lightning Fast HMR
- 🛠️ Rich Features
- 📦 Optimized Build
- 🔩 Universal Plugin Interface
- 🔑 Fully Typed APIs

Vite is a new breed of frontend build tooling that significantly improves the frontend development experience. It consists of two major parts:

- A dev server that serves your source files over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), with [rich built-in features](https://vite.dev/guide/features.md) and astonishingly fast [Hot Module Replacement (HMR)](https://vite.dev/guide/features.md#hot-module-replacement).

- A [build command](https://vite.dev/guide/build.md) that bundles your code with [Rollup](https://rollupjs.org), pre-configured to output highly optimized static assets for production.

In addition, Vite is highly extensible via its [Plugin API](https://vite.dev/guide/api-plugin.md) and [JavaScript API](https://vite.dev/guide/api-javascript.md) with full typing support.`,
      }) as PluginOption,
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin'
      ]
    }
  },
  buildEnd
})
