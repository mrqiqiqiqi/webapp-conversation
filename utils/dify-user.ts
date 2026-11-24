import { v4 } from 'uuid'
import { APP_ID } from '@/config'

const SESSION_COOKIE_KEY = 'session_id'
const USER_STORAGE_KEY = 'dify_user_id'

const readCookie = (name: string): string => {
  const matched = document.cookie.split('; ').find(item => item.startsWith(`${name}=`))
  return matched ? matched.split('=').slice(1).join('=') : ''
}

// 直连 Dify 时的用户标识：优先复用代理模式种下的 session_id cookie（老访客的历史会话不丢），
// 没有则生成一个并写入 cookie + localStorage；同时回种 cookie，保证切回代理模式后仍是同一个用户。
export const getDifyUser = (): string => {
  if (typeof window === 'undefined') { return '' }
  const sessionId = readCookie(SESSION_COOKIE_KEY) || window.localStorage.getItem(USER_STORAGE_KEY) || v4()
  window.localStorage.setItem(USER_STORAGE_KEY, sessionId)
  document.cookie = `${SESSION_COOKIE_KEY}=${sessionId}; path=/; max-age=31536000; SameSite=Lax`
  return `user_${APP_ID}:${sessionId}`
}
