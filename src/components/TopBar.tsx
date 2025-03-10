import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { setIsOpen, user } = useAuth();
  return (
    <nav className="sticky h-14 z-10 flex items-center justify-between py-5 px-6 bg-gray-900 border-b border-gray-800 transition-all duration-200 ease-in-out">
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-gray-200 md:hidden"
      >
        <Menu size={25} />
      </button>
      <h2 className="text-purple-600 font-semibold text-2xl text-center flex-grow">
        PollChain
      </h2>
      {user && (
        <div className="items-center gap-3 hidden md:flex">
          <p className="text-gray-200 font-semibold truncate ">
            {user.username}
          </p>
          <img
            src={user.avatar}
            alt="Profile Pic"
            className="rounded-full h-10 w-10"
          />
        </div>
      )}
    </nav>
  );
}
