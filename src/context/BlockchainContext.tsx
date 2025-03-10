import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";


import {
  blockchainServices,
  connectToWallet,
  initEthers,
  disconnectWallet
} from "../services/blockchainServices";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

type BlockchainContextType = {
  isConnected: boolean;
  walletAddress: string | undefined;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  globalPolls: Poll[];
  userPolls: Poll[];
  setGlobalPolls: Dispatch<SetStateAction<Poll[]>>;
  setUserPolls: Dispatch<SetStateAction<Poll[]>>;
  activePolls: number;
  totalPolls: number;
  votesCasted: number;
  pollsDataUpdate: () => void;
  getUserPolls: () => Promise<void>;
  getGlobalPolls: (start: number, limit: number) => Promise<void>;
};

const BlockchainContext = createContext<BlockchainContextType>(
  {} as BlockchainContextType
);

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [globalPolls, setGlobalPolls] = useState<Poll[]>([]);
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const [activePolls, setActivePolls] = useState<number>(0);
  const [totalPolls, setTotalPolls] = useState<number>(0);
  const [votesCasted, setVotesCasted] = useState<number>(0);

  const { user } = useAuth();

  const initialize = async () => {
    try {
      const connected = await initEthers();
      if(connected){
        const wallet = await connectToWallet();
        setWalletAddress(wallet);
        toast("Wallet connected successfully", {
          icon: "💰",
        });
        setIsConnected(true);
      }
    } catch (error: any) {
      setIsConnected(false);
      console.error("Error initializing ethers ", error.message);
      toast.error("Error initializing Ethers, Please refresh page");
    }
  };

  const connectWallet = async () => {
    try {
      const wallet = await connectToWallet();
      setWalletAddress(wallet);
      toast("Wallet connected successfully", {
        icon: "💰",
      });
    } catch (error: any) {
      setIsConnected(false);
      console.error("Error connecting to wallet, ", error.message);
      toast.error("Error connecting to wallet, Please refresh page");
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(undefined);
    disconnectWallet();
  };

  const getUserPolls = async () => {
    try {
      const polls = await blockchainServices.getUserPolls();
      setUserPolls(polls);
    } catch (error: any) {
      console.error("Error getting user polls:", error.message);
      throw error;
    }
  };

  const getGlobalPolls = async (start: number, limit: number) => {
    try {
      const polls = await blockchainServices.getAllPolls(start, limit);
      setGlobalPolls(polls);
    } catch (error: any) {
      console.error("Error getting global polls:", error.message);
      throw error;
    }
  };

  const getVotesCasted = async () => {
    try {
      const votes = await blockchainServices.getVotesCasted();
      setVotesCasted(votes);
    } catch (error: any) {
      console.error("Error getting votes casted:", error.message);
    }
  };
  const getActivePolls = async () => {
    try {
      const activePolls = await blockchainServices.getActivePollsCount();
      setActivePolls(activePolls);
    } catch (error: any) {
      console.error("Error getting active polls:", error.message);
    }
  };

  const getTotalPolls = async () => {
    try {
      const totalPolls = await blockchainServices.getAllPollsCount();
      setTotalPolls(totalPolls);
    } catch (error: any) {
      console.error("Error getting total polls:", error.message);
    }
  };

  const pollsDataUpdate = () => {
    getActivePolls();
    getTotalPolls();
    getVotesCasted();
  }

  useEffect(() => {
    if (isConnected && user) {
      pollsDataUpdate();
    } else if(!isConnected){
      disconnect();
    }
  }, [isConnected]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress(undefined);
        setIsConnected(false);
      } else {
        setWalletAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (user) {
      initialize();
    }
  }, [user]);

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        disconnect,
        globalPolls,
        userPolls,
        setGlobalPolls,
        setUserPolls,
        activePolls,
        totalPolls,
        votesCasted,
        pollsDataUpdate,
        getUserPolls,
        getGlobalPolls,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
