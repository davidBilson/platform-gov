import JobFeed from "./_home/_jobFeed";
import ContractorFeed from "./_home/_contractorFeed";
import { useFeedStore } from "@/store/useFeed";
import { useEffect } from "react";

export default function Home() {

  const { feedType } = useFeedStore()

  useEffect(() => {}, [feedType])

  return (
    <>
      {
        feedType === "Contractors" ? <ContractorFeed /> : <JobFeed />
      }
    </>
  )
}
