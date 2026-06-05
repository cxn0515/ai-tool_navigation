const CATEGORY_TEXT = {
  chat: ['AI Chatbots', 'General chat, multimodal assistants, writing help, and everyday AI companions.'],
  agent: ['AI Agents', 'Autonomous agents, workflow assistants, task automation, and role-based helpers.'],
  writing: ['AI Writing', 'Articles, copywriting, scripts, emails, fiction, editing, and content polishing.'],
  office: ['AI Productivity', 'Documents, spreadsheets, meeting notes, knowledge bases, email, and collaboration.'],
  ppt: ['AI Presentation', 'Slides, decks, reports, business proposals, and visual storytelling.'],
  image: ['AI Image', 'Image generation, illustration, photo creation, creative visuals, and image editing.'],
  design: ['AI Design', 'Logos, posters, UI, product images, brand visuals, and design assets.'],
  video: ['AI Video', 'Text-to-video, image-to-video, editing, subtitles, avatars, and animation.'],
  audio: ['AI Audio', 'Voice generation, music, transcription, podcasts, dubbing, and audio processing.'],
  dev: ['AI Coding', 'Code generation, IDE assistants, completions, DevOps, and technical docs.'],
  'no-code': ['AI App Builders', 'No-code, low-code, website generation, app prototypes, and automation builders.'],
  search: ['AI Search', 'Web search, answer engines, information retrieval, browsers, and research discovery.'],
  research: ['AI Research', 'Paper reading, literature review, academic search, research writing, and reports.'],
  data: ['AI Data', 'Data analysis, visualization, BI, spreadsheet insights, and data processing.'],
  marketing: ['AI Marketing', 'Ads, SEO, social content, ecommerce operations, sales, and customer support.'],
  prompt: ['Prompt Tools', 'Prompt generators, prompt libraries, role templates, and prompt optimization.'],
  model: ['AI Models', 'Model platforms, open-source models, APIs, training, fine-tuning, and inference.'],
  education: ['AI Education', 'Language learning, courses, homework help, teaching prep, and learning assistants.'],
  detection: ['AI Detection', 'AI content detection, plagiarism checks, fact checking, safety, and copyright tools.'],
  business: ['AI Business', 'Startups, side projects, business analysis, industry solutions, and enterprise services.']
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

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'zh'
}

function localizeCategory(category, lang) {
  if (normalizeLang(lang) !== 'en') {
    return category
  }

  const text = CATEGORY_TEXT[category.slug]
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
  if (text.includes('API')) {
    return text.includes('/') ? 'Free / API' : 'API'
  }
  if (text.includes('/')) {
    return 'Free / Paid'
  }
  return text ? 'Paid' : 'Free / Paid'
}

export function localizeCategories(categories, lang) {
  return categories.map((category) => localizeCategory(category, lang))
}

export function localizeTools(tools, lang) {
  if (normalizeLang(lang) !== 'en') {
    return tools
  }

  return tools.map((tool) => {
    const category = localizeCategory(tool.category, 'en')
    const scene = CATEGORY_SCENES[tool.category?.slug] || 'AI workflows'

    return {
      ...tool,
      description: `${tool.name} is an AI tool for ${scene}.`,
      pricing: englishPricing(tool.pricing),
      category
    }
  })
}
