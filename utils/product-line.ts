import type { UserLanguage } from './user-language'

// 产品线入口：按钮文案与选中后自动发送的消息都跟随右上角语言选择器（user_language），不走 react-i18next。
export interface ProductLine {
  key: string
  icon: string
  // 按钮上显示的文案
  label: Record<UserLanguage, string>
  // 选中后自动发送的消息；未配置时发送按钮文案
  message?: Record<UserLanguage, string>
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    key: 'navigation',
    icon: '🧭',
    label: {
      'zh': '导航常见问题',
      'en-US': 'Navigation FAQs',
      'ru': 'Часто задаваемые вопросы по навигации',
      'pt-BR': 'Perguntas frequentes sobre navegação',
      'tr': 'Navigasyon SSS',
      'pl': 'Najczęstsze pytania o nawigację',
    },
    message: {
      'zh': '以列表的形式展示导航常见问题',
      'en-US': 'Show the navigation FAQs as a list',
      'ru': 'Покажи часто задаваемые вопросы по навигации в виде списка',
      'pt-BR': 'Mostre as perguntas frequentes sobre navegação em forma de lista',
      'tr': 'Navigasyondaki sık sorulan soruları liste halinde göster',
      'pl': 'Wyświetl najczęstsze pytania dotyczące nawigacji w formie listy',
    },
  },
  {
    key: 'drone',
    icon: '🚁',
    label: {
      'zh': '海外无人机常见问题',
      'en-US': 'Overseas Drone FAQs',
      'ru': 'Часто задаваемые вопросы по дронам',
      'pt-BR': 'Perguntas frequentes sobre drones internacionais',
      'tr': 'Yurt Dışı Drone SSS',
      'pl': 'Najczęstsze pytania o drony za granicą',
    },
  },
]

export const getProductLineLabel = (line: ProductLine, language: UserLanguage): string =>
  line.label[language] || line.label.zh

export const getProductLineMessage = (line: ProductLine, language: UserLanguage): string =>
  line.message?.[language] || line.message?.zh || getProductLineLabel(line, language)
