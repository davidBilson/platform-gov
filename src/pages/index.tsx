'use client'
import LegalAgreement from "@/components/ui/legal-agreement";
// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

export default function Home() {
  // const router = useRouter()

  // useEffect(() => {
  //   router.push('/auth/sign-in')
  // }, [router])

  return (
    <main>
      <LegalAgreement />
    </main>
  )
}
