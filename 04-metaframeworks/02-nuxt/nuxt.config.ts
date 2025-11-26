// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  },

  // App 配置
  app: {
    head: {
      title: 'Nuxt 3 Todo App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Full-stack Todo List application built with Nuxt 3'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // 服务器端渲染配置
  ssr: true,

  // CSS 配置
  css: ['~/assets/styles/main.css'],

  // 自动导入配置
  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'utils/**'
    ]
  },

  // 运行时配置
  runtimeConfig: {
    // 服务器端可用的私有配置
    // public 中的配置在客户端和服务器端都可用
    public: {
      apiBase: '/api'
    }
  }
})
