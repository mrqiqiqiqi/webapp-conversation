import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

// 请求未携带 Accept-Language 时，Negotiator 会返回通配符 ['*']；cookie 也可能被写成非法值。
// 这些都不是合法的语言标签，match 遇到会抛出 RangeError。这里先过滤掉，再由 match 回落到默认语言。
const isValidLanguageTag = (tag: string): boolean => {
  try {
    Intl.getCanonicalLocales(tag)
    return true
  }
  catch {
    return false
  }
}

export const getLocaleOnServer = async (): Promise<Locale> => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] | undefined
  // get locale from cookie
  const localeCookie = (await cookies()).get('locale')
  languages = localeCookie?.value ? [localeCookie.value] : []

  if (!languages.length) {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    const headersList = await headers()
    headersList.forEach((value, key) => (negotiatorHeaders[key] = value))
    // Use negotiator and intl-localematcher to get best locale
    languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  }

  // match locale
  const matchedLocale = match(languages.filter(isValidLanguageTag), locales, i18n.defaultLocale) as Locale
  return matchedLocale
}
