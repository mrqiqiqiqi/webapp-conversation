import type { UserLanguage } from './user-language'

// 默认进入消息：打开页面或新建对话时不经过选择界面，直接进入导航咨询并自动发送这条消息。
// 文案跟随右上角语言选择器（user_language），不走 react-i18next。
export const DEFAULT_ENTRY_MESSAGE: Record<UserLanguage, string> = {
  'zh': '以列表的形式展示导航常见问题',
  'en-US': 'Show the navigation FAQs as a list',
  'ru': 'Покажи часто задаваемые вопросы по навигации в виде списка',
  'pt-BR': 'Mostre as perguntas frequentes sobre navegação em forma de lista',
  'tr': 'Navigasyondaki sık sorulan soruları liste halinde göster',
  'pl': 'Wyświetl najczęstsze pytania dotyczące nawigacji w formie listy',
}

export const getDefaultEntryMessage = (language: UserLanguage): string =>
  DEFAULT_ENTRY_MESSAGE[language] || DEFAULT_ENTRY_MESSAGE.zh
