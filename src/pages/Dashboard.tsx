import { ChartNoAxesCombined, Vote, Users, Clock5 } from "lucide-react";
import { Link } from "react-router";
import { useBlockchain } from "../context/BlockchainContext";
import NoWalletError from "../components/NoWalletError";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { walletAddress, userPolls, activePolls, totalPolls, votesCasted } = useBlockchain();
  const {activeUsers} = useAuth();

  if (!walletAddress) {
    return <NoWalletError />;
  }

  const cards = [
    {
      icon: <ChartNoAxesCombined size={18} className="text-purple-400" />,
      css: "bg-purple-600",
      name: "Total Polls",
      count: totalPolls,
    },
    {
      icon: <Vote size={18} className="text-blue-400" />,
      css: "bg-blue-600",
      name: "Votes Cast",
      count: votesCasted,
    },
    {
      icon: <Users size={18} className="text-green-400" />,
      css: "bg-green-600",
      name: "Active Participants",
      count: activeUsers,
    },
    {
      icon: <Clock5 size={18} className="text-orange-400" />,
      css: "bg-orange-600",
      name: "Active Polls",
      count: activePolls,
    },
  ];

  
  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col gap-4 p-6 md:py-8 md:px-10">
      <h2 className="text-gray-200 text-2xl font-semibold">Dashboard</h2>

      <div className="grid gap-5 py-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col flex-1 p-5 gap-5 rounded-lg bg-gray-700"
          >
            <span className="flex items-center justify-between">
              <span className={`p-3 bg-opacity-40 rounded-lg ${card.css}`}>
                {card.icon}
              </span>
              <span className="text-gray-400 font-semibold text-sm">
                {card.name}
              </span>
            </span>
            <p className="ml-1 text-2xl font-semibold text-gray-200">
              {card.count}
            </p>
          </div>
        ))}
      </div>

      {userPolls.length === 0 ? (
        <p className="text-gray-200 font-semibold">No polls created by you yet</p>
      ) : (
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-700 overflow-hidden">
          <div className="flex justify-between items-center">
            <p className="text-gray-200 text-lg font-semibold">Your Polls</p>
            <Link
              to="/my-polls"
              className="text-sm font-semibold text-gray-200 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col text-sm">
            <div className="grid grid-cols-5 border-b border-gray-600 pb-2">
              <span className="text-gray-400 font-semibold col-span-3">
                Title
              </span>
              <span className="text-gray-400 font-semibold">Votes</span>
              <span className="text-gray-400 font-semibold">Status</span>
            </div>
            {userPolls.slice(0, 10).map((poll: Poll, index: number) => (
              <div
                key={index}
                className="grid items-center grid-cols-5 border-b border-gray-600 py-2"
              >
                <span className="text-gray-200 font-semibold col-span-3 truncate mr-1">
                  {poll.title}
                </span>
                <span className="text-gray-200 font-semibold">
                  {poll.optionVotes.reduce((i, sum) => sum + i, 0)}
                </span>
                {
                  poll.deadline >= Date.now() ? (
                    <span
                      className={`px-4 py-1 text-sm font-semibold rounded-full w-max bg-opacity-40 text-green-400 bg-green-600`}
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      className={`px-4 py-1 text-sm font-semibold rounded-full w-max bg-opacity-40 text-red-400 bg-red-600`}
                    >
                      Ended
                    </span>
                  )
                }
                
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
