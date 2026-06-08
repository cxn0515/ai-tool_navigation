<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  AudioLines,
  Blocks,
  BookOpen,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChartColumn,
  Code2,
  ExternalLink,
  Flame,
  GraduationCap,
  Image,
  LoaderCircle,
  Megaphone,
  MessageCircle,
  Palette,
  PenLine,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  SquareTerminal,
  Video
} from 'lucide-vue-next'
import { fetchBrowserLocale, fetchCategories, fetchLocale, fetchTools } from './api'
import { localizeCategories, localizeTools } from './i18n'

const iconMap = {
  AudioLines,
  Blocks,
  BookOpen,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ChartColumn,
  Code2,
  GraduationCap,
  Image,
  Megaphone,
  MessageCircle,
  Palette,
  PenLine,
  Presentation,
  Search,
  ShieldCheck,
  SquareTerminal,
  Store,
  Video
}

const messages = {
  zh: {
    appTitle: 'AI 工具导航',
    allTools: '全部工具',
    searchPlaceholder: '搜索工具、能力、价格或分类',
    featured: '热门精选',
    loading: '正在加载 AI 工具库',
    emptyTitle: '没有找到匹配的工具',
    emptyText: '换一个关键词，或者取消热门精选筛选。',
    countUnit: '个',
    iconAlt: '图标',
    popular: '热门',
    domestic: '国产',
    switchLabel: 'English'
  },
  en: {
    appTitle: 'AI Tools Directory',
    allTools: 'All Tools',
    searchPlaceholder: 'Search tools, features, pricing, or categories',
    featured: 'Featured',
    loading: 'Loading AI tools',
    emptyTitle: 'No matching tools found',
    emptyText: 'Try another keyword or turn off the featured filter.',
    countUnit: 'tools',
    iconAlt: 'icon',
    popular: 'Popular',
    domestic: 'China',
    switchLabel: '中文'
  }
}

const sitePages = {
  zh: {
    nav: {
      home: '首页',
      about: '关于',
      contact: '联系',
      privacy: '隐私政策'
    },
    about: {
      title: '关于',
      eyebrow: 'About',
      body: [
        '我是一个用 AI 编程做工具站的独立开发者，在这里记录和分享出海建站的经验。',
        '这个网站整理 AI 工具、建站资源和独立开发过程中真实用得到的服务，主要给正在做产品、内容站、工具站和海外项目的人参考。',
        '我会尽量保持内容真实、简洁、可验证。如果某个工具或信息发生变化，也会持续更新。'
      ]
    },
    contact: {
      title: '联系',
      eyebrow: 'Contact',
      body: [
        '如果你想反馈工具信息、提交合作建议，或者指出页面里的错误，可以通过邮箱联系我。',
        '我会尽量查看并回复与本站内容相关的邮件。'
      ],
      emailLabel: '邮箱'
    },
    privacy: {
      title: '隐私政策',
      eyebrow: 'Privacy Policy',
      updated: '最后更新：2026 年 6 月 8 日',
      body: [
        '本隐私政策说明本站如何收集、使用和保护访问者的信息。使用本站即表示你同意本政策中说明的做法。',
        '本站可能会收集浏览器类型、设备信息、访问页面、来源页面、访问时间等基础日志信息，用于了解网站运行情况、改进内容和排查问题。',
        '本站计划接入 Google AdSense 广告。Google 以及其广告合作伙伴可能会在你的浏览器中使用 Cookie 或类似技术，用于投放广告、衡量广告效果，以及根据你访问本站和其他网站的情况展示个性化或非个性化广告。',
        '你可以在浏览器设置中禁用 Cookie，也可以通过 Google 的广告设置管理个性化广告偏好。禁用 Cookie 可能会影响部分网站功能或广告展示。',
        '本站不会出售你的个人信息，也不会主动要求你提交敏感个人资料。你通过邮件联系本站时，邮箱地址和邮件内容仅用于回复你的问题或处理相关请求。',
        '本站可能包含指向第三方网站的链接。第三方网站有自己的隐私政策，本站不对其内容或数据处理方式负责。',
        '如果本隐私政策发生重要变化，我会在本页面更新说明和日期。'
      ],
      contact: '如有隐私相关问题，请联系：'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy'
    },
    about: {
      title: 'About',
      eyebrow: 'About',
      body: [
        'I am an independent developer building tool sites with AI-assisted programming, and I use this site to document and share practical experience about building websites for global audiences.',
        'This directory collects AI tools, website-building resources, and services that are useful for makers working on products, content sites, utility sites, and international projects.',
        'I try to keep the content honest, concise, and verifiable, and I update it when tools or details change.'
      ]
    },
    contact: {
      title: 'Contact',
      eyebrow: 'Contact',
      body: [
        'For tool corrections, partnership ideas, or website feedback, you can reach me by email.',
        'I try to review and respond to messages related to this site.'
      ],
      emailLabel: 'Email'
    },
    privacy: {
      title: 'Privacy Policy',
      eyebrow: 'Privacy Policy',
      updated: 'Last updated: June 8, 2026',
      body: [
        'This Privacy Policy explains how this website collects, uses, and protects visitor information. By using this website, you agree to the practices described here.',
        'This website may collect basic log information such as browser type, device information, pages visited, referring pages, and access times to understand site performance, improve content, and troubleshoot issues.',
        'This website plans to use Google AdSense advertising. Google and its advertising partners may use cookies or similar technologies in your browser to serve ads, measure ad performance, and show personalized or non-personalized ads based on your visits to this and other websites.',
        'You can disable cookies in your browser settings and manage personalized advertising preferences through Google Ads settings. Disabling cookies may affect some website functionality or ad delivery.',
        'This website does not sell your personal information and does not ask you to submit sensitive personal data. If you contact the site by email, your email address and message content are used only to respond to your request.',
        'This website may include links to third-party websites. Those websites have their own privacy policies, and this site is not responsible for their content or data practices.',
        'If this Privacy Policy changes in a meaningful way, the updated details and date will be posted on this page.'
      ],
      contact: 'For privacy questions, contact:'
    }
  }
}

function browserFallbackLanguage() {
  const locale = navigator.language || ''
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  return locale.toLowerCase().includes('zh-cn') || timezone === 'Asia/Shanghai' ? 'zh' : 'en'
}

async function detectLanguage() {
  window.localStorage.removeItem('ainav-language')
  window.localStorage.removeItem('ainav-language-manual')

  const locale = await fetchBrowserLocale() || await fetchLocale()
  if (locale?.language === 'zh' || locale?.language === 'en') {
    return locale.language
  }

  return browserFallbackLanguage()
}

const categories = ref([])
const tools = ref([])
const activeCategory = ref('all')
const query = ref('')
const onlyFeatured = ref(false)
const loading = ref(true)
const failedIcons = ref(new Set())
const language = ref(browserFallbackLanguage())
const currentPath = ref(window.location.pathname)

const t = computed(() => messages[language.value])
const pages = computed(() => sitePages[language.value])
const currentPage = computed(() => {
  const path = currentPath.value.replace(/\/$/, '') || '/'
  if (path === '/about') return pages.value.about
  if (path === '/contact') return pages.value.contact
  if (path === '/privacy-policy') return pages.value.privacy
  return null
})
const localizedCategories = computed(() => localizeCategories(categories.value, language.value))
const localizedTools = computed(() => localizeTools(tools.value, language.value))

const loadDirectory = async () => {
  const showInitialLoading = categories.value.length === 0 && tools.value.length === 0
  loading.value = showInitialLoading
  failedIcons.value = new Set()
  try {
    const categoryFallback = categories.value.length ? categories.value : undefined
    const toolFallback = tools.value.length ? tools.value : undefined
    const [categoryData, toolData] = await Promise.all([
      fetchCategories('zh', categoryFallback),
      fetchTools('zh', toolFallback)
    ])
    categories.value = categoryData
    tools.value = toolData
  } finally {
    loading.value = false
  }
}

const initializeDirectory = async () => {
  language.value = await detectLanguage()
  await loadDirectory()
}

const syncPath = () => {
  currentPath.value = window.location.pathname
}

onMounted(() => {
  initializeDirectory()
  window.addEventListener('popstate', syncPath)
})

onUnmounted(() => {
  window.removeEventListener('popstate', syncPath)
})

const toggleLanguage = () => {
  language.value = language.value === 'zh' ? 'en' : 'zh'
}

const navigateTo = (path) => {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
  currentPath.value = path
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const filteredTools = computed(() => {
  const text = query.value.trim().toLowerCase()
  return localizedTools.value.filter((tool) => {
    const categoryMatch = activeCategory.value === 'all' || tool.category.slug === activeCategory.value
    const featuredMatch = !onlyFeatured.value || tool.featured
    const textMatch = !text || [
      tool.name,
      tool.description,
      tool.pricing,
      tool.category.name,
      ...(tool.tags || [])
    ].join(' ').toLowerCase().includes(text)
    return categoryMatch && featuredMatch && textMatch
  })
})

const groupedTools = computed(() => {
  return localizedCategories.value
    .map((category) => ({
      category,
      tools: filteredTools.value.filter((tool) => tool.category.slug === category.slug)
    }))
    .filter((group) => group.tools.length > 0)
})

const categoryCounts = computed(() => {
  return localizedCategories.value.reduce((counts, category) => {
    counts[category.slug] = localizedTools.value.filter((tool) => tool.category.slug === category.slug).length
    return counts
  }, {})
})

const setCategory = (slug) => {
  activeCategory.value = slug
  if (currentPath.value !== '/') {
    navigateTo('/')
  }
}

const iconLabel = (tool) => {
  return (tool.name || 'AI').replace(/[^\p{L}\p{N}\p{Unified_Ideograph}]/gu, '').slice(0, 2) || 'AI'
}

const markIconFailed = (tool) => {
  failedIcons.value = new Set([...failedIcons.value, tool.slug])
}

const hasLocalIcon = (tool) => {
  return Boolean(tool.iconUrl) && !failedIcons.value.has(tool.slug)
}
</script>

<template>
  <main class="app-shell">
    <aside class="sidebar" :aria-label="t.appTitle">
      <div class="brand-block">
        <a class="brand-mark" href="/" :aria-label="pages.nav.home" @click.prevent="navigateTo('/')">
          <Sparkles :size="22" />
        </a>
        <div>
          <h1>{{ t.appTitle }}</h1>
        </div>
      </div>

      <nav class="category-menu">
        <button class="category-item" :class="{ active: activeCategory === 'all' }" type="button" @click="setCategory('all')">
          <span class="category-icon"><Star :size="18" /></span>
          <span class="category-name">{{ t.allTools }}</span>
          <span class="category-count">{{ localizedTools.length }}</span>
        </button>
        <button
          v-for="category in localizedCategories"
          :key="category.slug"
          class="category-item"
          :class="{ active: activeCategory === category.slug }"
          type="button"
          @click="setCategory(category.slug)"
        >
          <span class="category-icon">
            <component :is="iconMap[category.icon] || Sparkles" :size="18" />
          </span>
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count">{{ categoryCounts[category.slug] || 0 }}</span>
        </button>
      </nav>

      <nav class="sidebar-footer" aria-label="Site links">
        <a href="/about" @click.prevent="navigateTo('/about')">{{ pages.nav.about }}</a>
        <a href="/contact" @click.prevent="navigateTo('/contact')">{{ pages.nav.contact }}</a>
        <a href="/privacy-policy" @click.prevent="navigateTo('/privacy-policy')">{{ pages.nav.privacy }}</a>
      </nav>
    </aside>

    <section class="content-pane">
      <header class="topbar">
        <label class="search-box">
          <Search :size="20" />
          <input v-model="query" type="search" :placeholder="t.searchPlaceholder" />
        </label>

        <button class="featured-toggle" :class="{ active: onlyFeatured }" type="button" @click="onlyFeatured = !onlyFeatured">
          <Flame :size="18" />
          <span>{{ t.featured }}</span>
        </button>

        <button class="language-toggle" type="button" @click="toggleLanguage">
          {{ t.switchLabel }}
        </button>
      </header>

      <section v-if="loading" class="loading-state">
        <LoaderCircle :size="24" />
        <span>{{ t.loading }}</span>
      </section>

      <section v-else-if="currentPage" class="legal-page">
        <p class="legal-eyebrow">{{ currentPage.eyebrow }}</p>
        <h2>{{ currentPage.title }}</h2>
        <p v-if="currentPage.updated" class="legal-updated">{{ currentPage.updated }}</p>
        <div class="legal-copy">
          <p v-for="paragraph in currentPage.body" :key="paragraph">{{ paragraph }}</p>
          <p v-if="currentPage.emailLabel">
            <strong>{{ currentPage.emailLabel }}：</strong>
            <a href="mailto:cxn0515@gmail.com">cxn0515@gmail.com</a>
          </p>
          <p v-if="currentPage.contact">
            {{ currentPage.contact }}
            <a href="mailto:cxn0515@gmail.com">cxn0515@gmail.com</a>
          </p>
        </div>
      </section>

      <section v-else-if="filteredTools.length === 0" class="empty-state">
        <h2>{{ t.emptyTitle }}</h2>
        <p>{{ t.emptyText }}</p>
      </section>

      <section v-else class="tool-sections">
        <div v-for="group in groupedTools" :key="group.category.slug" class="tool-section">
          <div class="section-heading">
            <div>
              <h2>{{ group.category.name }}</h2>
              <p>{{ group.category.description }}</p>
            </div>
            <span>{{ group.tools.length }} {{ t.countUnit }}</span>
          </div>

          <div class="tool-grid">
            <a v-for="tool in group.tools" :key="tool.slug" class="tool-card" :href="tool.url" target="_blank" rel="noopener noreferrer">
              <div class="tool-card-head">
                <img v-if="hasLocalIcon(tool)" :src="tool.iconUrl" :alt="`${tool.name} ${t.iconAlt}`" width="44" height="44" @error="markIconFailed(tool)" />
                <span v-else class="tool-icon-placeholder">{{ iconLabel(tool) }}</span>
                <div>
                  <h3>{{ tool.name }}</h3>
                  <p>{{ tool.category.name }}</p>
                </div>
                <ExternalLink class="external-icon" :size="17" />
              </div>

              <p class="tool-description">{{ tool.description }}</p>

              <div class="tag-row">
                <span class="price-tag">{{ tool.pricing }}</span>
                <span v-if="tool.featured" class="hot-tag">{{ t.popular }}</span>
                <span v-if="tool.domestic" class="cn-tag">{{ t.domestic }}</span>
                <span v-for="tag in tool.tags" :key="tag" class="soft-tag">{{ tag }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer class="site-footer">
        <a href="/" @click.prevent="navigateTo('/')">{{ pages.nav.home }}</a>
        <a href="/about" @click.prevent="navigateTo('/about')">{{ pages.nav.about }}</a>
        <a href="/contact" @click.prevent="navigateTo('/contact')">{{ pages.nav.contact }}</a>
        <a href="/privacy-policy" @click.prevent="navigateTo('/privacy-policy')">{{ pages.nav.privacy }}</a>
      </footer>
    </section>
  </main>
</template>
