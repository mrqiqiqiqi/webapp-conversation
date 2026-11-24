import { useEffect, useState } from 'react'

// 会话语言：传给 Dify 工作流开始节点的 user_language 变量
export type UserLanguage = 'zh' | 'en-US' | 'ru' | 'pt-BR' | 'tr' | 'pl'

export const USER_LANGUAGE_KEY = 'user_language'
export const USER_LANGUAGE_CHANGED_EVENT = 'user-language-changed'

// 默认语言：未手动选择，且访问者 IP 所在国家没有对应语言时使用
export const DEFAULT_USER_LANGUAGE: UserLanguage = 'en-US'

export const USER_LANGUAGE_OPTIONS: { value: UserLanguage, label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'pt-BR', label: 'Português' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'pl', label: 'Polski' },
]

export const isValidUserLanguage = (value: string | null | undefined): value is UserLanguage =>
  !!value && USER_LANGUAGE_OPTIONS.some(option => option.value === value)

// 手动选择的语言保存在 localStorage
const getStoredUserLanguage = (): UserLanguage | null => {
  const stored = window.localStorage.getItem(USER_LANGUAGE_KEY)
  return isValidUserLanguage(stored) ? stored : null
}

const notifyLanguageChanged = (language: UserLanguage) => {
  window.dispatchEvent(new CustomEvent(USER_LANGUAGE_CHANGED_EVENT, { detail: language }))
}

// 按 IP 识别出的语言只保留在当前页面内，不写入 localStorage：手动选择始终优先，下次访问重新识别
let detectedLanguage: UserLanguage | null = null

export const getUserLanguage = (): UserLanguage => {
  if (typeof window === 'undefined') { return DEFAULT_USER_LANGUAGE }
  return getStoredUserLanguage() || detectedLanguage || DEFAULT_USER_LANGUAGE
}

export const setUserLanguage = (language: UserLanguage) => {
  if (typeof window === 'undefined') { return }
  window.localStorage.setItem(USER_LANGUAGE_KEY, language)
  notifyLanguageChanged(language)
}

// 访问者 IP 所在国家到语言的映射；未列出的国家使用默认语言
const COUNTRY_TO_LANGUAGE: Record<string, UserLanguage> = {
  CN: 'zh',
  RU: 'ru',
  BR: 'pt-BR',
  TR: 'tr',
  PL: 'pl',
}

const countryToLanguage = (country: string): UserLanguage =>
  COUNTRY_TO_LANGUAGE[country.toUpperCase()] || DEFAULT_USER_LANGUAGE

// 语言判定优先级：手动选择 > 访问 IP 所在国家 > 默认语言。
// 国家码由 /api/locale 从 Vercel 注入的请求头中读取；本地开发没有该请求头，使用默认语言。
// 返回的 Promise 在识别结束时 resolve（包括失败和超时），调用方可据此等待识别完成后再使用语言。
export const autoDetectLanguage = (): Promise<void> => {
  if (typeof window === 'undefined' || getStoredUserLanguage()) { return Promise.resolve() }

  return fetch('/api/locale', { signal: AbortSignal.timeout(5000) })
    .then(res => res.json())
    .then(({ country }: { country?: string }) => {
      // 识别期间用户已手动选择时不再覆盖
      if (getStoredUserLanguage() || !country) { return }
      detectedLanguage = countryToLanguage(country)
      notifyLanguageChanged(detectedLanguage)
    })
    .catch(() => { /* 识别失败或超时，保持默认语言 */ })
}

// 服务端渲染时先用默认语言，挂载后再读真实值，避免水合不一致
export const useUserLanguage = (): [UserLanguage, (language: UserLanguage) => void] => {
  const [language, setLanguageState] = useState<UserLanguage>(DEFAULT_USER_LANGUAGE)

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
