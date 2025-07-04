import React from 'react'
import FreelancerProfile from './_freelancer'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

const PublicProfile: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  if (!router.isReady) {
    return <div>Loading router...</div>
  }

  if (!id || Array.isArray(id)) {
    return <div>Invalid profile ID</div>
  }

  return <FreelancerProfile initialProfileId={id} />
}

export default PublicProfile