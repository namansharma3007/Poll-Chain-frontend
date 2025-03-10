import { useBlockchain } from "../context/BlockchainContext";
import NoWalletError from "../components/NoWalletError";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { blockchainServices } from "../services/blockchainServices";
import PollCard from "../components/PollCard";
export default function SearchPolls() {
  const { walletAddress } = useBlockchain();

  const [activePollsFilter, setIsActivePollsFilter] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const [displayPolls, setDisplayPolls] = useState<Poll[]>([]);
  const [searchedPolls, setSearchedPolls] = useState<Poll[]>([]);

  useEffect(() => {
    if (searchedPolls.length === 0) return;
    let filteredPolls = searchedPolls;

    if (activePollsFilter === 1) {
      filteredPolls = filteredPolls.filter((p) => p.deadline >= Date.now());
    } else if (activePollsFilter === 2) {
      filteredPolls = filteredPolls.filter((p) => p.deadline < Date.now());
    }

    setDisplayPolls(filteredPolls);
  }, [activePollsFilter, searchedPolls]);

  const toggleActivityStatus = () => {
    setIsActivePollsFilter((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const polls = await blockchainServices.getPollsViaAddress(searchInput);
      setSearchedPolls(polls);
    } catch (error: any) {
      console.log("Error searching for polls:", error.message);
    }
  };
  if (!walletAddress) {
    return <NoWalletError />;
  }
  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
      <div className="flex lg:items-center justify-between gap-4 flex-wrap lg:flex-row flex-col items-start">
        <h2 className="text-gray-200 text-2xl font-semibold">Search Polls</h2>
        <form
          onSubmit={handleSubmit}
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
              type="submit"
              className="absolute left-2.5 top-2.5 text-gray-400 hover:text-gray-200"
            >
              <Search size={20} />
            </button>
            <input
              type="text"
              name="search-polls"
              placeholder="Search polls via creators address..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-lg h-10 pl-10 w-full flex-1 outline-none bg-gray-700 text-white pr-10"
            />
          </div>
        </form>
      </div>

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
    </section>
  );
}
