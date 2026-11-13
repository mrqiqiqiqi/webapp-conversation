import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
// 强制 https：服务器 301 跳转 https 时 axios 会把 POST 降级为 GET，导致 /chat-messages 返回 405
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`.replace(/^http:\/\//, 'https://')
export const APP_INFO: AppInfo = {
  title: `${process.env.NEXT_PUBLIC_APP_TITLE || 'Chat APP'}`,
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

// 渠道号：随每条消息写入 inputs，变量名可通过 NEXT_PUBLIC_CHANNEL_VAR 对齐 Dify 开始节点
export const CHANNEL_VAR = `${process.env.NEXT_PUBLIC_CHANNEL_VAR || 'channel_no'}`
export const CHANNEL_NO = `${process.env.NEXT_PUBLIC_CHANNEL_NO || '1'}`
