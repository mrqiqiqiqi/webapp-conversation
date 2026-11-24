'use client'
import React from 'react'

export enum MediaType {
  mobile = 'mobile',
  tablet = 'tablet',
  pc = 'pc',
}

const useBreakpoints = (): MediaType | null => {
  // 服务端渲染时没有窗口宽度（渲染结果会按 pc 布局，在 iframe/窄窗口里首屏错乱且引发水合不匹配），
  // 因此首帧返回 null，由调用方渲染加载态；挂载后再按真实宽度出布局。
  const [width, setWidth] = React.useState<number | null>(null)
  const media = (() => {
    if (width === null) { return null }
    if (width <= 640) { return MediaType.mobile }
    if (width <= 768) { return MediaType.tablet }
    return MediaType.pc
  })()

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth)
    setWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return media
}

export default useBreakpoints
