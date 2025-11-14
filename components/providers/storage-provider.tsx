'use client'

import { useEffect } from 'react'
import { initializeMockData } from '@/lib/storage'

export function StorageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeMockData()
  }, [])

  return <>{children}</>
}

