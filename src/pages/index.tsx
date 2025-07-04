import { useEffect } from "react";
import { useFeedStore } from "@/store/useFeed";
import JobFeed from "./_home/_jobFeed";
import ContractorFeed from "./_home/_contractorFeed";
import { getContentCategories } from "@/utils/feedFilter/152ProfessionalFieldsAndAreasOfExpertise";

export default function Home() {

  const { feedType } = useFeedStore()

  useEffect(() => {
    function getAllCategories() {
      const data = getContentCategories()
    }
    getAllCategories()
  }, [])

  useEffect(() => {}, [feedType])

  return <>{feedType === "Contractors" ? <ContractorFeed /> : <JobFeed />}</>
  
}
