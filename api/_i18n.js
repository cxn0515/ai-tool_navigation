const CATEGORY_TEXT = {
  chat: {
    en: ['AI Chatbots', 'General chat, multimodal assistants, writing help, and everyday AI companions.']
  },
  agent: {
    en: ['AI Agents', 'Autonomous agents, workflow assistants, task automation, and role-based helpers.']
  },
  writing: {
    en: ['AI Writing', 'Articles, copywriting, scripts, emails, fiction, editing, and content polishing.']
  },
  office: {
    en: ['AI Productivity', 'Documents, spreadsheets, meeting notes, knowledge bases, email, and collaboration.']
  },
  ppt: {
    en: ['AI Presentation', 'Slides, decks, reports, business proposals, and visual storytelling.']
  },
  image: {
    en: ['AI Image', 'Image generation, illustration, photo creation, creative visuals, and image editing.']
  },
  design: {
    en: ['AI Design', 'Logos, posters, UI, product images, brand visuals, and design assets.']
  },
  video: {
    en: ['AI Video', 'Text-to-video, image-to-video, editing, subtitles, avatars, and animation.']
  },
  audio: {
    en: ['AI Audio', 'Voice generation, music, transcription, podcasts, dubbing, and audio processing.']
  },
  dev: {
    en: ['AI Coding', 'Code generation, IDE assistants, completions, DevOps, and technical docs.']
  },
  'no-code': {
    en: ['AI App Builders', 'No-code, low-code, website generation, app prototypes, and automation builders.']
  },
  search: {
    en: ['AI Search', 'Web search, answer engines, information retrieval, browsers, and research discovery.']
  },
  research: {
    en: ['AI Research', 'Paper reading, literature review, academic search, research writing, and reports.']
  },
  data: {
    en: ['AI Data', 'Data analysis, visualization, BI, spreadsheet insights, and data processing.']
  },
  marketing: {
    en: ['AI Marketing', 'Ads, SEO, social content, ecommerce operations, sales, and customer support.']
  },
  prompt: {
    en: ['Prompt Tools', 'Prompt generators, prompt libraries, role templates, and prompt optimization.']
  },
  model: {
    en: ['AI Models', 'Model platforms, open-source models, APIs, training, fine-tuning, and inference.']
  },
  education: {
    en: ['AI Education', 'Language learning, courses, homework help, teaching prep, and learning assistants.']
  },
  detection: {
    en: ['AI Detection', 'AI content detection, plagiarism checks, fact checking, safety, and copyright tools.']
  },
  business: {
    en: ['AI Business', 'Startups, side projects, business analysis, industry solutions, and enterprise services.']
  }
}

const CATEGORY_SCENES = {
  chat: 'chat, writing, summarization, and general assistance',
  agent: 'agent workflows, task automation, and autonomous assistance',
  writing: 'writing, editing, content planning, and copy generation',
  office: 'documents, meetings, knowledge management, and productivity',
  ppt: 'presentations, decks, reports, and visual storytelling',
  image: 'image generation, creative visuals, and photo editing',
  design: 'brand design, posters, UI, product visuals, and design assets',
  video: 'video generation, editing, subtitles, avatars, and animation',
  audio: 'voice, music, transcription, dubbing, and audio processing',
  dev: 'coding, software development, DevOps, and technical workflows',
  'no-code': 'app building, no-code workflows, prototypes, and websites',
  search: 'web search, answer discovery, information retrieval, and research',
  research: 'academic research, paper reading, literature review, and reports',
  data: 'data analysis, reporting, visualization, and spreadsheet insights',
  marketing: 'marketing, ads, SEO, ecommerce, sales, and growth',
  prompt: 'prompt writing, prompt libraries, and prompt optimization',
  model: 'model platforms, APIs, open-source models, and inference',
  education: 'learning, teaching, courses, and education workflows',
  detection: 'AI detection, plagiarism checks, fact checking, and content safety',
  business: 'business analysis, startups, industry solutions, and enterprise work'
}

const TAG_TEXT = {
  国产: 'China',
  海外: 'Global',
  热门: 'Popular',
  编程: 'Coding',
  写作: 'Writing',
  办公: 'Productivity',
  绘画: 'Image',
  设计: 'Design',
  视频: 'Video',
  音频: 'Audio',
  搜索: 'Search',
  研究: 'Research',
  数据: 'Data',
  营销: 'Marketing',
  教育: 'Education',
  检测: 'Detection',
  商业: 'Business',
  智能体: 'Agent',
  应用构建: 'App Builder',
  提示词: 'Prompt',
  模型平台: 'Model Platform',
  聊天助手: 'Chatbot',
  PPT: 'Presentation'
}

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh'
}

function localizeCategory(category, lang) {
  if (normalizeLang(lang) !== 'en') {
    return category
  }

  const text = CATEGORY_TEXT[category.slug]?.en
  if (!text) {
    return category
  }

  return {
    ...category,
    name: text[0],
    description: text[1]
  }
}

function englishPricing(pricing) {
  const text = String(pricing || '')
  if (text.includes('订阅')) {
    return text.includes('免费') ? 'Free / Paid' : 'Paid'
  }
  if (text.includes('免费')) {
    return text.includes('API') ? 'Free / API' : 'Free'
  }
  if (text.includes('API')) {
    return 'API'
  }
  return text || 'Free / Paid'
}

function localizeTool(tool, lang) {
  if (normalizeLang(lang) !== 'en') {
    return tool
  }

  const category = localizeCategory(tool.category, 'en')
  const scene = CATEGORY_SCENES[tool.category?.slug] || 'AI workflows'

  return {
    ...tool,
    description: `${tool.name} is an AI tool for ${scene}.`,
    pricing: englishPricing(tool.pricing),
    category,
    tags: (tool.tags || []).map((tag) => TAG_TEXT[tag] || tag)
  }
}

module.exports = {
  normalizeLang,
  localizeCategory,
  localizeTool
}
