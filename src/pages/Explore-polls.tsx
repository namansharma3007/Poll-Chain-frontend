import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import PollCard from "../components/PollCard";
import { useBlockchain } from "../context/BlockchainContext";
import NoWalletError from "../components/NoWalletError";

export default function ExplorePolls() {
  const { globalPolls, walletAddress, getGlobalPolls } = useBlockchain();

  const [activePollsFilter, setIsActivePollsFilter] = useState<number>(0);
  const [displayPolls, setDisplayPolls] = useState<Poll[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!globalPolls) return;
    if (activePollsFilter == 0) {
      setDisplayPolls(globalPolls);
    } else if (activePollsFilter == 1) {
      setDisplayPolls(globalPolls.filter((p) => p.deadline >= Date.now()));
    } else {
      setDisplayPolls(globalPolls.filter((p) => p.deadline < Date.now()));
    }
  }, [activePollsFilter, globalPolls]);

  useEffect(() => {
    if (!globalPolls) return;
    const getPolls = async () => {
      try {
        await getGlobalPolls((page - 1) * 6, 6);
      } catch (error: any) {
        console.error("Error getting global polls:", error.message);
      }
    };
    getPolls();
  }, [globalPolls, page]);

  const toggleActivityStatus = () => {
    setIsActivePollsFilter((prev) => (prev === 2 ? 0 : prev + 1));
  };


  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const nextPage = () => {
    const maxPage = Math.ceil(globalPolls.length / 6.0);
    setPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  if (!walletAddress) {
    return <NoWalletError />;
  }

  if (globalPolls.length === 0) {
    return (
      <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
        <p className="text-white font-semibold text-3xl text-center">
          No polls created yet!
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
      <div className="flex items-center">
        <h2 className="text-gray-200 text-2xl font-semibold">Explore Polls</h2>
      </div>

      <div
        className="flex flex-col"
      >
        <button
          type="button"
          onClick={toggleActivityStatus}
          className={`px-4 py-1 h-max rounded-full w-[90px] font-semibold bg-opacity-40 text-sm ${
            activePollsFilter === 0
              ? "bg-purple-600 text-purple-400"
              : activePollsFilter === 1
              ? "bg-green-600 text-green-400"
              : "bg-red-600 text-red-400"
          }`}
        >
          {activePollsFilter == 0
            ? "All"
            : activePollsFilter === 1
            ? "Active"
            : "Ended"}
        </button>
      </div>

      {/* Polls */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 py-2 gap-3">
        {displayPolls.map((poll: Poll, index: number) => (
          <PollCard
            key={index}
            poll={poll}
            deletePoll={() => {}}
            deleteFlag={false}
          />
        ))}
      </div>
      <div className="flex gap-4 p-4 w-full justify-center items-center mt-2">
        <button
          type="button"
          onClick={prevPage}
          className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
        >
          <ChevronLeft />
        </button>
        <span className="text-white">Page {page}</span>
        <button
          type="button"
          onClick={nextPage}
          className="p-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
