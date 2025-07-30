import { useState, useEffect } from "react";
import LoadingAnimation from "@/components/ui/loading";
import ContractorFeed from "../components/_feed/_contractorFeed";
import JobFeed from "../components/_feed/_jobFeed";
import { useFeedStore } from "@/store/useFeed";

export default function Home() {
  const { feedType } = useFeedStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh]">
        <LoadingAnimation />
      </div>
    );
  }

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