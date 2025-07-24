import ContractorFeed from "../components/_feed/_contractorFeed";
import JobFeed from "../components/_feed/_jobFeed";

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
