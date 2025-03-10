import { ethers } from "ethers";
import POLL_CHAIN_JSON from "../contracts/PollChain.json";

const provider = new ethers.JsonRpcProvider("http://localhost:8545");
let pollChainContract: ethers.Contract;

const privateKey = import.meta.env.VITE_PRIVATE_KEY;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const initEthers = async (): Promise<string> => {
  try {
    if (!privateKey || !contractAddress) {
      throw new Error("Missing environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    pollChainContract = new ethers.Contract(
      contractAddress,
      POLL_CHAIN_JSON.abi,
      wallet
    );
    return wallet.address;
  } catch (error: any) {
    throw error;
  }
};

export const connectToWallet = async (): Promise<string> => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    return wallet.address;
  } catch (error: any) {
    throw error;
  }
};

export const getContract = () => {
  return pollChainContract;
};

const convertPollDetailsToPoll = (pollDetails: any): Poll => {
  return {
    id: Number(pollDetails.id),
    creator: pollDetails.creator,
    title: pollDetails.title,
    question: pollDetails.question,
    optionTexts: pollDetails.optionTexts.map((v: String) => String(v)),
    optionVotes: pollDetails.optionVotes.map((v: BigInt) => Number(v)),
    voterCount: Number(pollDetails.voterCount),
    deadline: Number(pollDetails.deadline),
    createdAt: Number(pollDetails.createdAt),
    hasAlreadyVoted: pollDetails.hasAlreadyVoted,
  };
};

export const blockchainServices = {
  createPoll: async (
    title: string,
    question: string,
    optionTexts: string[],
    deadline: number
  ) => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const tx = await pollChainContract.createPoll(
        title,
        question,
        optionTexts,
        deadline
      );
      await tx.wait();
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      console.log(error);
      throw new Error(`Failed to create poll: ${error.message}`);
    }
  },

  vote: async (pollId: number, chosenOption: number) => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const tx = await pollChainContract.vote(pollId, chosenOption);
      await tx.wait();
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to vote: ${error.message}`);
    }
  },

  deletePoll: async (pollId: number) => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const tx = await pollChainContract.deletePoll(pollId);
      await tx.wait(); // Wait for the transaction to be mined
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to delete poll: ${error.message}`);
    }
  },

  getPoll: async (pollId: number): Promise<Poll> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const pollDetails = await pollChainContract.getPoll(pollId);
      return convertPollDetailsToPoll(pollDetails);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch poll: ${error.message}`);
    }
  },
  
  getAllPolls: async (start: number, limit: number): Promise<Poll[]> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const polls = await pollChainContract.getAllPolls(start, limit);
      return polls.map(convertPollDetailsToPoll);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch all polls: ${error.message}`);
    }
  },

  getUserPolls: async (): Promise<Poll[]> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const polls = await pollChainContract.getUserPolls();
      return polls.map(convertPollDetailsToPoll);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch user polls: ${error.message}`);
    }
  },


  getActivePollsCount: async (): Promise<number> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const count = await pollChainContract.getActivePollsCount();
      return Number(count);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch active polls count: ${error.message}`);
    }
  },

  getAllPollsCount: async (): Promise<number> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const count = await pollChainContract.getAllPollsCount();
      return Number(count);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch all pools count: ${error.message}`);
    }
  },

  getVotesCasted: async (): Promise<number> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const count = await pollChainContract.getVotesCasted();
      return Number(count);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch votes casted: ${error.message}`);
    }
  },

  getPollsVotedByUser: async (): Promise<number> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const count = await pollChainContract.getPollsVotedByUser();
      return Number(count);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch votes casted: ${error.message}`);
    }
  },

  getPollsViaAddress: async (address: string): Promise<Poll[]> => {
    if (!pollChainContract) throw new Error("Contract not initialized");
    try {
      const polls = await pollChainContract.getPollsViaAddress(address);
      return polls.map(convertPollDetailsToPoll);
    } catch (error: any) {
      if (error.code === "CALL_EXCEPTION" && error.reason) {
        throw new Error(error.reason);
      }
      throw new Error(`Failed to fetch user polls: ${error.message}`);
    }
  },
};
