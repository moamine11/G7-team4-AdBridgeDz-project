import { Suspense } from 'react'

import ResetPasswordPage from '@/components/pages/reset-password-page'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  )
}

