import JobFeed from "./job/_feed";
import ContractorFeed from "./contractor/_feed";
import { useFeedStore } from "@/store/feedStore";

export default function Home() {

  const { feedType } = useFeedStore()

  return (
    <>
      {
        feedType === "Contractors" ? <ContractorFeed /> : <JobFeed />
      }
    </>
  )
}
