import JobFeed from "./job/_feed";
import ContractorFeed from "./contractor/_feed";
import { useFeedStore } from "@/store/feedStore";
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
