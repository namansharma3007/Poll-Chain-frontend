import { Trash2, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { convertDate } from "../utils/utils";
import { oneDayMilliseconds } from "../constants/constants";
import { useEffect, useState } from "react";
import { blockchainServices } from "../services/blockchainServices";

export default function PollCard({
  poll,
  deletePoll,
  deleteFlag,
}: {
  poll: Poll;
  deletePoll: Function;
  deleteFlag: boolean;
}) {


  const copyToClipboard = (creatorsAddress: string) => {
    navigator.clipboard.writeText(creatorsAddress);
    toast("Address copied to clipboard", {
      icon: "🏦",
    });
  };

  const totalPolls = poll.optionVotes.reduce(
    (vote: number, sum: number) => vote + sum,
    0
  );

  const isPollActive = poll.deadline >= Date.now();

  return (
    <div className="rounded-md flex flex-col gap-2 justify-between bg-gray-700 p-4 bg-opacity-70 text-sm font-semibold cursor-default">
      <div className="flex flex-col gap-2">
        <p
          onClick={() => copyToClipboard(poll.creator)}
          className="text-gray-200 truncate cursor-pointer hover:text-gray-400"
          title="Click"
        >
          Created by: {poll.creator}
        </p>
        <span className="flex gap-2 items-center">
          {poll.hasAlreadyVoted && (
            <span className="px-4 py-1 rounded-lg bg-opacity-40 bg-purple-600 text-purple-400">
              Already voted
            </span>
          )}
          {isPollActive ? (
            <span className="px-4 py-1 rounded-full bg-opacity-40 bg-green-600 text-green-400">
              Active
            </span>
          ) : (
            <span className="px-4 py-1 rounded-full bg-opacity-40 bg-red-600 text-red-400">
              Ended
            </span>
          )}
        </span>

        <div className="flex flex-col gap-2">
          <h5 className="text-gray-200 text-semibold text-2xl mt-2">
            {poll.title}
          </h5>
          <span className="word-wrap text-gray-200">{poll.question}</span>
          <div className="flex text-gray-400 justify-between">
            <span>{poll.voterCount} voters</span>
            <span>{totalPolls} votes</span>
          </div>

          <div className="flex flex-col gap-2">
            {poll.optionTexts.map((option, index) => {
              const percentage =
                totalPolls > 0
                  ? ((poll.optionVotes[index] * 100) / totalPolls).toFixed(2)
                  : "0.00";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer rounded-md p-2 bg-gray-700 text-gray-200 duration-100 hover:bg-gray-800 hover:scale-[1.01] focus:bg-gray-800"
                >
                  <span>{option}</span>
                  <span>{percentage} %</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex text-sm font-semibold text-gray-400 justify-between mt-2">
        <span>Created at: {convertDate(poll.createdAt * 1000)}</span>
        <span>Deadline: {convertDate(poll.deadline - oneDayMilliseconds)}</span>
      </div>

      <div
        className={`flex items-center mt-2 ${
          deleteFlag ? "justify-between" : "justify-end"
        }`}
      >
        <Link
          to={(isPollActive && !poll.hasAlreadyVoted) ? `/poll-vote/${poll.id}` : "#"}
          aria-disabled={!isPollActive || poll.hasAlreadyVoted}
          className={`flex text-xs items-center justify-center gap-2 px-4 py-2 rounded-lg text-white ${
            isPollActive
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          <Vote size={15} />
          Vote
        </Link>
        {deleteFlag && (
          <button
            onClick={() => deletePoll(poll.id)}
            className="flex text-xs items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 size={15} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
