import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useBlockchain } from "../context/BlockchainContext";
import { blockchainServices } from "../services/blockchainServices";
import PollCard from "../components/PollCard";
import { getContract } from "../services/blockchainServices";
import NoWalletError from "../components/NoWalletError";
import { BigNumberish } from "ethers";

export default function MyPolls() {
  const {
    userPolls,
    setUserPolls,
    walletAddress,
    pollsDataUpdate,
    getUserPolls,
  } = useBlockchain();
  
  const {pollChainContract} = getContract();

  const [activePollsFilter, setIsActivePollsFilter] = useState<number>(0);
  const [displayPolls, setDisplayPolls] = useState<Poll[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  
  useEffect(() => {
    getUserPolls();
  }, []);

  useEffect(() => {
    if (!userPolls) return;

    let filteredPolls = userPolls;

    if (activePollsFilter === 1) {
      filteredPolls = filteredPolls.filter((p) => p.deadline >= Date.now());
    } else if (activePollsFilter === 2) {
      filteredPolls = filteredPolls.filter((p) => p.deadline < Date.now());
    }

    if (searchInput !== "") {
      filteredPolls = filteredPolls.filter(
        (p) =>
          p.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.question.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.creator.includes(searchInput)
      );
    }

    setDisplayPolls(filteredPolls);
  }, [activePollsFilter, searchInput, userPolls]);

  const toggleActivityStatus = () => {
    setIsActivePollsFilter((prev) => (prev === 2 ? 0 : prev + 1));
  };

  

  const deletePoll = async (id: number) => {
    const deletingPoll = (): Promise<number> => {
      return new Promise(async (resolve, reject) => {
        try {
          await blockchainServices.deletePoll(id);

          pollChainContract.on(
            "PollDeleted",
            (pollId: BigNumberish | BigInt) => {
              if (!pollId) {
                reject(new Error("PollDeleted event did not return a pollId"));
              } else {
                resolve(Number(pollId));
              }
            }
          );

          setTimeout(() => {
            reject(new Error("Timeout waiting for PollDeleted event"));
          }, 30000); // 30 seconds timeout
        } catch (error: any) {
          console.error("Error deleting poll:", error.message);
          reject(error);
        }
      });
    };

    const deletedPollId = await toast.promise(deletingPoll(), {
      loading: "Deleting poll...",
      success: "Poll deleted successfully",
      error: "Some error occurred, Please refresh page and check once before deleting a poll again",
    });

    pollChainContract.off("PollDeleted");

    setUserPolls((prev) => prev.filter((p) => p.id !== deletedPollId));
    pollsDataUpdate();
  };

  if (!walletAddress) {
    return <NoWalletError />;
  }

  if (userPolls.length === 0) {
    return (
      <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
        <p className="text-white font-semibold text-3xl text-center">
          No polls created by you yet!
        </p>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
      <div className="flex lg:items-center justify-between gap-4 flex-wrap lg:flex-row flex-col items-start">
        <h2 className="text-gray-200 text-2xl font-semibold">My Polls</h2>
        <div
          className="flex justify-between md:items-center gap-3 md:flex-row flex-col w-full max-w-md flex-1"
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
          <div className="relative w-full lg:max-w-[350px] max-w-[500] flex-1">
            <button
              type="button"
              className="absolute left-2.5 top-2.5 text-gray-400 hover:text-gray-200"
            >
              <Search size={20} />
            </button>
            <input
              type="text"
              name="search-polls"
              placeholder="Search polls via title, question or creator..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-lg h-10 pl-10 w-full flex-1 outline-none bg-gray-700 text-white pr-10"
            />
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 py-2 gap-3">
        {displayPolls.map((poll: Poll, index: number) => (
          <PollCard
            key={index}
            poll={poll}
            deletePoll={deletePoll}
            deleteFlag={true}
          />
        ))}
      </div>
    </section>
  );
}
