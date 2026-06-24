export const fallbackCategories = [
  { id: 1, slug: 'chat', name: 'AI 聊天', description: '通用问答、多模态助手、写作和分析。', icon: 'MessageCircle', sortOrder: 1 },
  { id: 2, slug: 'image', name: 'AI 画图', description: '文生图、修图、设计和品牌视觉。', icon: 'Palette', sortOrder: 2 },
  { id: 3, slug: 'video', name: 'AI 视频', description: '视频生成、剪辑、数字人和动画。', icon: 'Video', sortOrder: 3 },
  { id: 4, slug: 'audio', name: 'AI 音频', description: '配音、音乐、转写和播客。', icon: 'AudioLines', sortOrder: 4 },
  { id: 5, slug: 'dev', name: 'AI 开发', description: '代码助手、Agent、IDE 和应用生成。', icon: 'Code2', sortOrder: 5 },
  { id: 6, slug: 'search', name: '搜索研究', description: '联网搜索、资料整理和研究。', icon: 'Search', sortOrder: 6 },
  { id: 7, slug: 'office', name: '办公效率', description: '文档、演示、会议和自动化。', icon: 'BriefcaseBusiness', sortOrder: 7 }
]

const tool = (slug, name, description, url, categorySlug, pricing, featured, domestic, tags) => ({
  id: slug,
  slug,
  name,
  description,
  url,
  iconUrl: '',
  pricing,
  featured,
  domestic,
  sortOrder: 1,
  category: fallbackCategories.find((category) => category.slug === categorySlug),
  tags
})

export const fallbackTools = [
  tool('chatgpt', 'ChatGPT', 'OpenAI 的通用 AI 助手，覆盖写作、分析、代码和多模态对话。', 'https://chatgpt.com', 'chat', '免费/订阅', true, false, ['通用', '多模态']),
  tool('claude', 'Claude', 'Anthropic 的长上下文助手，适合复杂文档、代码理解和写作。', 'https://claude.ai', 'chat', '免费/订阅', true, false, ['长上下文']),
  tool('gemini', 'Gemini', 'Google 多模态 AI 助手，结合搜索、Workspace 和移动生态。', 'https://gemini.google.com', 'chat', '免费/订阅', true, false, ['Google']),
  tool('perplexity', 'Perplexity', '面向资料溯源和研究的 AI 搜索助手。', 'https://www.perplexity.ai', 'search', '免费/订阅', true, false, ['搜索']),
  tool('midjourney', 'Midjourney', '高质量 AI 图像生成工具，适合艺术风格和商业视觉。', 'https://www.midjourney.com', 'image', '订阅', true, false, ['画图']),
  tool('firefly', 'Adobe Firefly', 'Adobe 生成式设计工具，集成创意软件工作流。', 'https://firefly.adobe.com', 'image', '免费/订阅', true, false, ['设计']),
  tool('runway', 'Runway', '主流 AI 视频创作平台，支持生成和编辑。', 'https://runwayml.com', 'video', '免费/订阅', true, false, ['视频']),
  tool('kling', 'Kling AI', '快手可灵 AI，支持文生视频、图生视频和图像生成。', 'https://klingai.com', 'video', '免费/订阅', true, true, ['国产', '视频']),
  tool('elevenlabs', 'ElevenLabs', '高质量 AI 语音生成、声音克隆和配音平台。', 'https://elevenlabs.io', 'audio', '免费/订阅', true, false, ['配音']),
  tool('suno', 'Suno', 'AI 音乐生成工具，可根据提示生成歌曲和伴奏。', 'https://suno.com', 'audio', '免费/订阅', true, false, ['音乐']),
  tool('cursor', 'Cursor', 'AI 编程编辑器，支持代码库理解和 Agent 修改。', 'https://cursor.com', 'dev', '免费/订阅', true, false, ['IDE', 'Agent']),
  tool('copilot', 'GitHub Copilot', 'GitHub 官方 AI 编程助手，深度集成 IDE 和 PR 工作流。', 'https://github.com/features/copilot', 'dev', '订阅', true, false, ['代码']),
  tool('v0', 'v0', 'Vercel 的 AI UI 生成工具，适合快速生成页面和组件。', 'https://v0.dev', 'dev', '免费/订阅', true, false, ['UI']),
  tool('notion-ai', 'Notion AI', '知识库和文档协作中的 AI 写作、总结和整理工具。', 'https://www.notion.so/product/ai', 'office', '订阅', true, false, ['文档']),
  tool('remio', 'Remio', '本地优先 AI 记忆与知识库，索引文件、网页、会议、邮件和笔记，快速找回个人上下文。', 'https://remio.ai', 'office', '免费/订阅', true, false, ['知识库', '本地优先']),
  tool('doubao', '豆包', '字节跳动 AI 助手，覆盖聊天、写作、图像和语音。', 'https://www.doubao.com', 'chat', '免费', true, true, ['国产']),
  tool('deepseek', 'DeepSeek', '深度求索 AI 助手与模型平台，覆盖聊天、代码和推理。', 'https://chat.deepseek.com', 'chat', '免费/API', true, true, ['国产', '推理'])
]
