import { useEffect } from "react";
import { useFeedStore } from "@/store/useFeed";
import JobFeed from "./_home/_jobFeed";
import ContractorFeed from "./_home/_contractorFeed";

export default function Home() {

  const { feedType } = useFeedStore()

  useEffect(() => {}, [feedType])

  return <>{feedType === "Contractors" ? <ContractorFeed /> : <JobFeed />}</>
  
}
