import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  X,
  Compass,
  Archive,
  Plus,
  Settings,
  WalletMinimal,
  LogOut,
  House,
  Copy,
  CheckCheck,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useBlockchain } from "../context/BlockchainContext";

const navLinks = [
  {
    to: "/dashboard",
    name: "Dashboard",
    icon: <House size={18} />,
  },
  {
    to: "/explore-polls",
    name: "Explore Polls",
    icon: <Compass size={18} />,
  },
  {
    to: "/search-polls",
    name: "Search Polls",
    icon: <Search size={18} />,
  },
  {
    to: "/my-polls",
    name: "My Polls",
    icon: <Archive size={18} />,
  },
  {
    to: "/create-poll",
    name: "Create Poll",
    icon: <Plus size={18} />,
  },
];

const accountLinks = [
  {
    to: "/settings",
    name: "Settings",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar() {
  const { logout, isOpen, setIsOpen, user } = useAuth();
  const { walletAddress, connectWallet } = useBlockchain();
  const [copied, setIsCopied] = useState<boolean>(false);

  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);

  const logoutUser = async () => {
    setIsLoadingLogout(true);
    try {
      const response = await logout();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingLogout(false);
    }
  };

  const copyToClipboard = () => {
    if (walletAddress && !copied) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied((prev) => !prev);
      toast("Wallet address copied", {
        icon: "🏦",
      });
    }
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      setIsCopied(false);
    }, 4000);
    return () => clearTimeout(interval);
  }, [copied]);

  return (
    <>
      <div
        className={`
        fixed md:hidden inset-0 z-20 transition-opacity bg-black bg-opacity-30 
        ${
          isOpen
            ? "opacity-100 ease-out duration-300"
            : "opacity-0 ease-in duration-200 pointer-events-none"
        }
      `}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`flex flex-col p-4 w-[220px] h-screen fixed inset-y-0 md:sticky md:inset-0 md:translate-x-0 z-20 left-0 top-0 bg-gray-900 border-r border-gray-800 transition duration-200 transform ${
          isOpen ? "translate-x-0 ease-in" : "-translate-x-full ease-out"
        }`}
      >
        <div className="flex flex-col items-center justify-between w-full mb-8">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-gray-400 font-semibold text-lg">
              {walletAddress ? "Wallet Address" : "Connect wallet"}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200 flex items-center md:hidden"
            >
              <X size={18} />
            </button>
          </div>
          {walletAddress && (
            <div className="w-full flex gap-1">
              <p className="w-3/4 text-sm text-gray-400 truncate">
                {walletAddress}
              </p>
              <button
                type="button"
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-gray-200"
              >
                {copied ? <CheckCheck size={15} /> : <Copy size={15} />}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h4 className="text-gray-400">MENU</h4>
          <div className="flex flex-col gap-3 ml-2 mt-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 h-10 p-2 text-gray-200 rounded-md transition ease-in-out duration-100 hover:bg-gray-600 hover:text-white"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm">
          <h4 className="text-gray-400">ACCOUNT</h4>
          <div className="flex flex-col gap-3 ml-2 mt-2">
            {accountLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 h-10 p-2 text-gray-200 rounded-md transition ease-in-out duration-100 hover:bg-gray-600 hover:text-white"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col h-full mb-4 justify-between mt-6 w-full">
          <button
            onClick={connectWallet}
            className="flex text-sm items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
          >
            <WalletMinimal size={18} />
            Connect Wallet
          </button>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 md:hidden">
              <img
                src={user?.avatar}
                alt="Profile Pic"
                className="rounded-full h-10 w-10"
              />
              <p className="text-gray-200 font-semibold truncate">
                {user?.username}
              </p>
            </div>
            <button
              onClick={logoutUser}
              disabled={isLoadingLogout}
              className={`flex items-center justify-center gap-2 text-sm text-white font-semibold px-4 py-2 rounded-lg w-full ${
                isLoadingLogout
                  ? "cursor-not-allowed bg-red-900"
                  : "cursor-pointer bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoadingLogout ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 rounded-full border-[3px] border-solid border-gray-900 border-l-transparent animate-spin"></div>
                </div>
              ) : (
                <>
                  <LogOut size={16} />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
