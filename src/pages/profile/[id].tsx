import React from 'react'
import FreelancerProfile from './_freelancer'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import useAuthStore from '@/store/useAuth'
import LockedOverlay from '@/components/subscription/LockedOverlay'

const PublicProfile: NextPage = () => {

  const router = useRouter()
  const { id } = router.query;
  const { isSubscribed } = useAuthStore();
  

  if (!router.isReady) {
    return <div>Loading router...</div>
  }

  if (!id || Array.isArray(id)) {
    return <div>Invalid profile ID</div>
  }

  if (!isSubscribed) {
    return <LockedOverlay
    descriptionText="Can't see consultant details? Go Premium and get full access to experience, skills, and contact info."
  />
  
  }

  return <FreelancerProfile initialProfileId={id} />
}

export default PublicProfile