import ContractorFeed from "./_home/_contractorFeed";
import JobFeed from "./_home/_jobFeed";

import { useFeedStore } from "@/store/useFeed";

export default function Home() {
  const { feedType } = useFeedStore();

  return (
    <>
      <div className={feedType === "Consultants" ? "block" : "hidden"}>
        <ContractorFeed />
      </div>
      <div className={feedType === "Jobs" ? "block" : "hidden"}>
        <JobFeed />
      </div>
    </>
  );
}
