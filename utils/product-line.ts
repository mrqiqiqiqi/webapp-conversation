import type { UserLanguage } from './user-language'

// 产品线入口：标签与选中后自动发送的消息共用同一份多语言文案，
// 跟随右上角语言选择器（user_language），不走 react-i18next。
export interface ProductLine {
  key: string
  icon: string
  label: Record<UserLanguage, string>
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
    },
  },
]

export const getProductLineLabel = (line: ProductLine, language: UserLanguage): string =>
  line.label[language] || line.label.zh
