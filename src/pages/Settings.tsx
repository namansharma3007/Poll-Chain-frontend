import { Camera, Gem, LogOut, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useBlockchain } from "../context/BlockchainContext";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, testEmail } from "../utils/utils";

type EditValues = {
  username: string;
  email: string;
  avatar?: File;
};

export default function Settings() {
  const { walletAddress, disconnect, connectWallet } = useBlockchain();
  const { user, logout, setUser } = useAuth();

  const [editFormValues, setEditFormValues] = useState<EditValues>({
    username: "",
    email: "",
    avatar: undefined,
  });

  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  const disconnectWallet = () => {
    disconnect();
    toast("Wallet disconnected!", { icon: "🚫" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      const file = files[0];
      if (!file.type.includes("image")) {
        toast.error("Wrong file format!");
        handleFileRemove();
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB!");
        handleFileRemove();
        return;
      }
      setEditFormValues({ ...editFormValues, avatar: file });
    } else {
      setEditFormValues({ ...editFormValues, [name]: value });
    }
  };

  const handleFileRemove = () => {
    setEditFormValues({ ...editFormValues, avatar: undefined });
  };

  const triggerFileInput = () => {
    document.getElementById("avatar")?.click();
  };

  const triggerSubmitButton = () => {
    document.getElementById("submit-button")?.click();
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const flag = formValidation(editFormValues);

    if (!flag.check) {
      toast.error(flag.message);
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append("username", editFormValues.username);
      formData.append("email", editFormValues.email);
      if (editFormValues.avatar) {
        formData.append("avatar", editFormValues.avatar);
      }
      const response = await apiFetch("/auth/update-profile", {
        method: "PATCH",
        body: formData,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      setUser(response.data.user);
      setEditFormValues({
        username: "",
        email: "",
        avatar: undefined,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const formValidation = (editFormValues: EditValues) => {
    if (
      editFormValues.username &&
      (editFormValues.username.length < 6 ||
        editFormValues.username.length > 20)
    ) {
      return {
        check: false,
        message: "Username must be between 6 and 20 characters",
      };
    }

    if (editFormValues.email && !testEmail(editFormValues.email)) {
      return {
        check: false,
        message: "Invalid email format",
      };
    }

    return {
      check: true,
      message: null,
    };
  };

  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col items-center gap-4 p-6 md:py-8 md:px-10">
      <div className="flex flex-col flex-1 gap-4 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-200 text-2xl font-semibold">Settings</h2>
          <button
            type="button"
            onClick={triggerSubmitButton}
            disabled={isUpdatingProfile}
            className={`text-white text-sm py-2 px-3 font-semibold rounded-lg w-max ${
              isUpdatingProfile
                ? "cursor-not-allowed bg-purple-900"
                : "cursor-pointer bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isUpdatingProfile ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 rounded-full border-[3px] border-solid border-gray-900 border-l-transparent animate-spin"></div>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4 pb-6 bg-gray-800 rounded-lg">
          <p className="font-semibold text-gray-200">Profile Settings</p>

          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            <div className="flex gap-4">
              <div className="h-30 w-30 relative">
                <img
                  src={user?.avatar || ""}
                  alt="Profile Pic"
                  className="rounded-full h-20 w-20 cursor-pointer"
                  onClick={triggerFileInput}
                />
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-purple-600 text-white p-2 rounded-full absolute right-0 -bottom-2"
                >
                  <Camera size={15} />
                </button>
              </div>

              {editFormValues.avatar ? (
                <div className="flex items-center gap-2 truncate w-[200px]">
                  <span className="text-gray-400 text-sm font-semibold truncate">
                    {editFormValues.avatar.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleFileRemove}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-semibold text-gray-200">
                    Upload Profile Picture
                  </p>
                  <p className="text-sm font-semibold text-gray-400 text-wrap">
                    Maximum file size: 5MB
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-gray-200 font-semibold">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={editFormValues.username}
                onChange={handleChange}
                placeholder={user?.username ?? ""}
                className="rounded-lg h-10 px-3 outline-none bg-gray-700 text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-200 font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={editFormValues.email}
                onChange={handleChange}
                placeholder={user?.email ?? ""}
                className="rounded-lg h-10 px-3 outline-none bg-gray-700 text-white"
              />
            </div>

            <input type="submit" className="hidden" id="submit-button" />
          </form>
        </div>

        <div className="flex flex-col gap-4 p-4 pb-6 bg-gray-800 rounded-lg">
          <p className="font-semibold text-gray-200">Connected Wallet</p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600 bg-opacity-40 rounded-full text-purple-400">
                <Gem size={20} />
              </div>
              <div className="flex flex-col w-[180px]">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {walletAddress}
                </p>
                <p className="text-sm font-semibold text-gray-400">
                  {walletAddress
                    ? "Connected via Metamask"
                    : "Connect your wallet"}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-1 justify-end">
              {walletAddress ? (
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="text-sm text-white font-semibold py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="text-sm text-white font-semibold py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex p-2 w-full justify-end">
          <button
            onClick={logoutUser}
            disabled={isLoadingLogout}
            className={`flex items-center justify-center gap-2 text-sm text-white font-semibold px-6 py-2 rounded-lg w-max ${
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
    </section>
  );
}
