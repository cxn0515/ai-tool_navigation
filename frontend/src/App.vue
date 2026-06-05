<script setup>
import { computed, onMounted, ref } from 'vue'
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

const t = computed(() => messages[language.value])
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

onMounted(initializeDirectory)

const toggleLanguage = () => {
  language.value = language.value === 'zh' ? 'en' : 'zh'
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
        <div class="brand-mark">
          <Sparkles :size="22" />
        </div>
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
    </section>
  </main>
</template>
