import type { UserLanguage } from './user-language'

// 欢迎语：由前端按会话语言显示，只显示一种语言，不使用 Dify 应用里配置的开场白。
// 修改欢迎语内容时直接改这里，各语言分别维护。
export const WELCOME_MESSAGE: Record<UserLanguage, string> = {
  'zh': '您好！我是您的 Vector AGR 助手。👋\n\n关于 HD408 自动驾驶系统有疑问？请告诉我具体现象，例如：「显示屏不亮。」',
  'en-US': 'Hello! I\'m your Vector AGR assistant. 👋\n\nHave questions about the HD408 Auto Steering System? Tell me what\'s happening, for example: "The display won\'t turn on."',
  'ru': 'Здравствуйте! Я ваш ассистент Vector AGR. 👋\n\nЕсть вопросы по системе автоматического вождения HD408? Расскажите, что происходит, например: «Дисплей не включается.»',
  'pt-BR': 'Olá! Sou seu assistente Vector AGR. 👋\n\nTem dúvidas sobre o Sistema de Direção Automática HD408? Conte o que está acontecendo, por exemplo: “O display não liga.”',
  'tr': 'Merhaba! Ben sizin Vector AGR asistanınızım. 👋\n\nHD408 Otomatik Direksiyon Sistemi hakkında sorularınız mı var? Bana ne olduğunu anlatın, örneğin: “Ekran açılmıyor.”',
  'pl': 'Cześć! Jestem Twoim asystentem Vector AGR. 👋\n\nMasz pytania dotyczące systemu automatycznego prowadzenia HD408? Napisz, co się dzieje, na przykład: „Wyświetlacz się nie włącza.”',
}

// 某种语言没有配置文案时使用英语
export const getWelcomeMessage = (language: UserLanguage): string =>
  WELCOME_MESSAGE[language] || WELCOME_MESSAGE['en-US']

// 引导按钮沿用 Dify 应用里配置的内容；现有配置只有中文，因此只在中文下显示，其他语言不显示
export const getSuggestedQuestions = (language: UserLanguage, questions: string[] | undefined): string[] =>
  language === 'zh' ? (questions || []) : []
