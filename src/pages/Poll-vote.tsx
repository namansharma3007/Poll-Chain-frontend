import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  blockchainServices,
  getContract,
} from "../services/blockchainServices";
import toast from "react-hot-toast";
import { oneDayMilliseconds } from "../constants/constants";
import { convertDate } from "../utils/utils";
import { BigNumberish } from "ethers";
import { useBlockchain } from "../context/BlockchainContext";

type PollForm = {
  pollId: string;
  chosenOption: number | undefined;
};

export default function PollVote() {
  const { pollId } = useParams<{ pollId?: string }>();

  const { pollsDataUpdate } = useBlockchain();

  const {pollChainContract} = getContract();

  const [poll, setPollData] = useState<Poll | undefined>();
  const [totalPolls, setTotalPolls] = useState<number>(0);

  const [pollForm, setPollForm] = useState<PollForm>({
    pollId: pollId!,
    chosenOption: undefined,
  });

  const handleChange = (index: number) => {
    setPollForm({ ...pollForm, chosenOption: index });
  };

  const loadPoll = async () => {
    try {
      const poll = await blockchainServices.getPoll(Number(pollId));
      if (!poll) {
        throw new Error(`No poll exists with id ${pollId}`);
      }
      setPollData(poll);
      setTotalPolls(
        poll.optionVotes.reduce((vote: number, sum: number) => vote + sum, 0)
      );
    } catch (error: any) {
      console.error("Error fetching poll details ", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!pollId || isNaN(Number(pollId))) {
      toast.error("Invalid poll Id");
      return;
    }
    loadPoll();
  }, [pollId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const flag = formValidation(pollForm);

    if (!flag.check) {
      toast.error(flag.message);
      return;
    }

    try {
      const vote = (): Promise<number> => {
        return new Promise(async (resolve, reject) => {
          try {
            await blockchainServices.vote(
              Number(pollForm.pollId),
              pollForm.chosenOption!
            );

            resolve(Number(pollForm.pollId));
          } catch (error: any) {
            console.error("Error voting in poll", error.message);
            reject(error);
          }
        });
      };

      const pollIdNew = await toast.promise(vote(), {
        loading: "Voting in poll...",
        success: "Voted successfully",
        error:
          "Some error occurred while voting in poll, Please try again later",
      });
      
     

      if (!pollIdNew) return;

      const fetchingPoll = (): Promise<Poll> => {
        return new Promise(async (resolve, reject) => {
          try {
            const poll = await blockchainServices.getPoll(pollIdNew);
            resolve(poll);
          } catch (error: any) {
            console.error("Error fetching poll details ", error.message);
            reject(error);
          }
        });
      };

      const nPoll = await toast.promise(fetchingPoll(), {
        loading: "Fetching poll...",
        success: "Poll fetched successfully",
        error: "Some error occurred while fetching poll, Please refresh page",
      });

      if (!nPoll) return;

      setPollData(nPoll);
      setPollForm({
        ...pollForm,
        chosenOption: undefined,
      });
      pollsDataUpdate();
    } catch (error: any) {
      console.error("Error voting in poll", error.message);
      toast.error(error.message);
    }
  };

  const formValidation = (pollForm: PollForm) => {
    if (!pollForm.pollId || pollForm.chosenOption === undefined) {
      return {
        check: false,
        message: "Please fill in all the particulars",
      };
    }

    if (
      pollForm.chosenOption < 0 ||
      (poll && pollForm.chosenOption >= poll.optionTexts.length)
    ) {
      return {
        check: false,
        message: "Invalid option",
      };
    }

    return {
      check: true,
      message: null,
    };
  };

  const isPollActive = (poll && poll.deadline >= Date.now()) || false;

  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col items-center gap-4 p-6 md:py-8 md:px-10">
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-gray-200 text-2xl font-semibold md:text-start text-center">
          {poll ? poll.title : "Loading Poll..."}
        </h2>
        <p className="text-gray-400 md:text-start text-center">
          {poll ? poll.question : "Fetching poll details..."}
        </p>
        {poll && (
          <div className="flex flex-col gap-4 bg-gray-700 bg-opacity-70 p-4 rounded-lg w-full">
            <div className="flex text-gray-400 justify-between text-sm font-semibold">
              <span>{poll.voterCount} voters</span>
              <span>{totalPolls} votes</span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <span className="flex gap-2 items-center">
                {poll.hasAlreadyVoted && (
                  <span className="text-sm font-semibold px-4 py-1 rounded-lg bg-opacity-40 bg-purple-600 text-purple-400">
                    Already voted
                  </span>
                )}
                {isPollActive ? (
                  <span className="px-4 py-1 rounded-full bg-opacity-40 bg-green-600 text-green-400 text-sm font-semibold">
                    Active
                  </span>
                ) : (
                  <span className="px-4 py-1 rounded-full bg-opacity-40 bg-red-600 text-red-400 text-sm font-semibold">
                    Ended
                  </span>
                )}
              </span>
              {poll.optionTexts.map((option, index) => {
                const percentage =
                  totalPolls > 0
                    ? ((poll.optionVotes[index] * 100) / totalPolls).toFixed(2)
                    : "0.00";
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between cursor-pointer rounded-md p-2 bg-gray-700 text-gray-200 duration-100 hover:bg-gray-800 hover:scale-[1.01] focus:bg-gray-800 text-sm font-semibold ${
                      pollForm.chosenOption === index
                        ? "bg-gray-900"
                        : "bg-gray-700"
                    }`}
                    onClick={() => handleChange(index)}
                  >
                    <input
                      type="radio"
                      name="vote"
                      value={index}
                      checked={pollForm.chosenOption === index}
                      onChange={() => handleChange(index)}
                      className="hidden"
                    />
                    <label className="text-gray-200 cursor-pointer flex w-full justify-between">
                      <span>{option}</span>
                      <span>{percentage} %</span>
                    </label>
                  </div>
                );
              })}

              <div className="flex text-sm font-semibold text-gray-400 justify-between mt-2">
                <span>Created at: {convertDate(poll.createdAt * 1000)}</span>
                <span>
                  Deadline: {convertDate(poll.deadline - oneDayMilliseconds)}
                </span>
              </div>

              <button
                type="submit"
                disabled={
                  pollForm.chosenOption === undefined ||
                  !isPollActive ||
                  poll.hasAlreadyVoted
                }
                className={`px-3 py-2 h-max text-sm font-semibold text-white rounded-lg ${
                  pollForm.chosenOption === undefined ||
                  !isPollActive ||
                  poll.hasAlreadyVoted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-purple-700 bg-purple-600 cursor-pointer"
                }`}
              >
                Submit Vote
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
