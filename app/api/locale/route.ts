import type { NextRequest } from 'next/server'

// 返回访问者所在国家：Vercel 在边缘自动注入 x-vercel-ip-country 请求头，本地开发无此头则返回空
export async function GET(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || ''
  return Response.json({ country })
}
