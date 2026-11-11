import { useEffect, useState } from 'react'

// 会话语言：传给 Dify 工作流开始节点的 user_language 变量
export type UserLanguage = 'zh' | 'en-US' | 'ru' | 'pt-BR'

export const USER_LANGUAGE_KEY = 'user_language'
export const USER_LANGUAGE_CHANGED_EVENT = 'user-language-changed'

export const USER_LANGUAGE_OPTIONS: { value: UserLanguage, label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'pt-BR', label: 'Português' },
]

export const isValidUserLanguage = (value: string | null | undefined): value is UserLanguage =>
  !!value && USER_LANGUAGE_OPTIONS.some(option => option.value === value)

// 浏览器语言映射到支持的语言，未匹配时默认中文
const localeToLanguage = (locale: string): UserLanguage => {
  const name = (locale || '').toLowerCase()
  if (name.startsWith('zh')) { return 'zh' }
  if (name.startsWith('en')) { return 'en-US' }
  if (name.startsWith('ru')) { return 'ru' }
  if (name.startsWith('pt')) { return 'pt-BR' }
  return 'zh'
}

export const getUserLanguage = (): UserLanguage => {
  if (typeof window === 'undefined') { return 'zh' }
  const stored = window.localStorage.getItem(USER_LANGUAGE_KEY)
  if (isValidUserLanguage(stored)) { return stored }
  return localeToLanguage(window.navigator.language || '')
}

export const setUserLanguage = (language: UserLanguage) => {
  if (typeof window === 'undefined') { return }
  window.localStorage.setItem(USER_LANGUAGE_KEY, language)
  window.dispatchEvent(new CustomEvent(USER_LANGUAGE_CHANGED_EVENT, { detail: language }))
}

// IP 国家码兜底映射：浏览器语言不在支持列表内时，按访问者所在国家推断
const COUNTRY_TO_LANGUAGE: Record<string, UserLanguage> = {
  CN: 'zh',
  RU: 'ru',
  BR: 'pt-BR',
}

const countryToLanguage = (country: string): UserLanguage => {
  return COUNTRY_TO_LANGUAGE[country.toUpperCase()] || 'en-US'
}

// 语言判定优先级：手动选择 > 浏览器语言 > IP 国家 > 中文。
// 浏览器语言已可识别时不发请求；否则向前端服务要一次访问者国家（Vercel 自带请求头）。
export const autoDetectLanguage = () => {
  if (typeof window === 'undefined') { return }
  if (window.localStorage.getItem(USER_LANGUAGE_KEY)) { return }

  const browserMatched = isValidUserLanguage(window.navigator.language)
    || USER_LANGUAGE_OPTIONS.some(option => (window.navigator.language || '').toLowerCase().startsWith(option.value.toLowerCase().split('-')[0]))
  if (browserMatched) { return }

  fetch('/api/locale')
    .then(res => res.json())
    .then(({ country }: { country?: string }) => {
      if (window.localStorage.getItem(USER_LANGUAGE_KEY)) { return }
      if (!country) { return }
      setUserLanguage(countryToLanguage(country))
    })
    .catch(() => { /* 检测失败保持中文默认 */ })
}

// 服务端渲染时先用固定值，挂载后再读真实值，避免水合不一致
export const useUserLanguage = (): [UserLanguage, (language: UserLanguage) => void] => {
  const [language, setLanguageState] = useState<UserLanguage>('zh')

  useEffect(() => {
    setLanguageState(getUserLanguage())
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<UserLanguage>).detail
      if (isValidUserLanguage(detail)) { setLanguageState(detail) }
    }
    window.addEventListener(USER_LANGUAGE_CHANGED_EVENT, handler)
    return () => window.removeEventListener(USER_LANGUAGE_CHANGED_EVENT, handler)
  }, [])

  const changeLanguage = (value: UserLanguage) => {
    setUserLanguage(value)
  }

  return [language, changeLanguage]
}
