'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { LanguageIcon } from '@heroicons/react/24/outline'
import { USER_LANGUAGE_OPTIONS, useUserLanguage } from '@/utils/user-language'

// 头部语言选择器：切换后写入 localStorage，并在下次发消息时随 inputs 传给工作流
const LanguageSelector: FC = () => {
  const [language, changeLanguage] = useUserLanguage()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = USER_LANGUAGE_OPTIONS.find(option => option.value === language)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) { setOpen(false) }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        className='flex items-center space-x-1.5 h-8 px-2.5 rounded-lg text-sm text-gray-700 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50'
        onClick={() => setOpen(!open)}
      >
        <LanguageIcon className='h-4 w-4 text-gray-400' />
        <span>{current?.label}</span>
        <ChevronDownIcon className='h-3.5 w-3.5 text-gray-400' />
      </button>
      {open && (
        <div className='absolute right-0 mt-1 z-50 w-36 py-1 bg-white rounded-lg border border-gray-100 shadow-lg'>
          {USER_LANGUAGE_OPTIONS.map(option => (
            <div
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${option.value === language ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
              onClick={() => { changeLanguage(option.value); setOpen(false) }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(LanguageSelector)
